using Application.DTOs.Users;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Services.Users;

public interface IUserService
{
  Task UpdateProfileAsync(Guid userId, UpdateProfileDto dto, CancellationToken cancellationToken = default);
  Task ChangePasswordAsync(Guid userId, ChangePasswordDto dto, CancellationToken cancellationToken = default);
}
