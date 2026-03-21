using Domain.Entities.Teams;
using Domain.Entities.Users;
using Domain.Repositories.Users;
using Domain.Value_Objects.Teams;
using Domain.Value_Objects.Users;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories.Users;

public class UserRepository : IUserRepository
{
  private readonly FlyHighDbContext _context;
  public UserRepository(FlyHighDbContext context)
  {
    _context = context;
  }

  public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
  {
    var normalizedEmail = email.Trim().ToLower();

    return await _context.Users
        .FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail, cancellationToken);
  }

  public async Task<User?> GetByRefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default)
  {
    return await _context.Users
        .FirstOrDefaultAsync(u => u.RefreshToken == refreshToken, cancellationToken);
  }

  public async Task AddAsync(User user, CancellationToken cancellationToken = default)
  {
    await _context.Users.AddAsync(user, cancellationToken);
  }

  public Task UpdateAsync(User user, CancellationToken cancellationToken = default)
  {
    _context.Users.Update(user);
    return Task.CompletedTask;
  }

  public async Task<bool> ExistsByEmailAsync(string email, CancellationToken cancellationToken = default)
  {
    var normalizedEmail = email.Trim().ToLower();

    return await _context.Users
        .AnyAsync(u => u.Email.ToLower() == normalizedEmail, cancellationToken);
  }

  public async Task<User?> GetByIdAsync(UserId id, CancellationToken cancellationToken = default)
  {
    return await _context.Users
        .FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
  }
}
