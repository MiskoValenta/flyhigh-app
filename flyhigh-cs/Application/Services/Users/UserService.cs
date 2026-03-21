using Application.Common.Interfaces;
using Application.DTOs.Users;
using Application.Interfaces.Users;
using Domain.Repositories.Users;
using Domain.Value_Objects.Users;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Services.Users;

public class UserService : IUserService
{
  private readonly IUserRepository _userRepository;
  private readonly IPasswordHasher _passwordHasher;
  private readonly IUnitOfWork _unitOfWork;

  public UserService(IUserRepository userRepository, IPasswordHasher passwordHasher, IUnitOfWork unitOfWork)
  {
    _userRepository = userRepository;
    _passwordHasher = passwordHasher;
    _unitOfWork = unitOfWork;
  }

  public async Task UpdateProfileAsync(Guid userId, UpdateProfileDto dto, CancellationToken cancellationToken = default)
  {
    var user = await _userRepository.GetByIdAsync(new UserId(userId), cancellationToken)
        ?? throw new Exception("Uživatel nenalezen.");

    if (user.Email != dto.Email.Trim().ToLower())
    {
      var existingUser = await _userRepository.GetByEmailAsync(dto.Email, cancellationToken);
      if (existingUser != null) throw new Exception("Tento e-mail je již zabraný.");
    }

    user.UpdateProfile(dto.FirstName, dto.LastName, dto.Email);

    await _userRepository.UpdateAsync(user, cancellationToken);
    await _unitOfWork.SaveChangesAsync(cancellationToken);
  }

  public async Task ChangePasswordAsync(Guid userId, ChangePasswordDto dto, CancellationToken cancellationToken = default)
  {
    var user = await _userRepository.GetByIdAsync(new UserId(userId), cancellationToken)
        ?? throw new Exception("Uživatel nenalezen.");

    if (!_passwordHasher.Verify(dto.OldPassword, user.PasswordHash))
    {
      throw new Exception("Původní heslo není správné.");
    }

    var newHash = _passwordHasher.Hash(dto.NewPassword);
    user.UpdatePassword(newHash);

    await _userRepository.UpdateAsync(user, cancellationToken);
    await _unitOfWork.SaveChangesAsync(cancellationToken);
  }
}