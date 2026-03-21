using Domain.Entities.Users;
using Domain.Value_Objects.Users;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Repositories.Users;

public interface IUserRepository
{
  Task<User?> GetByIdAsync(UserId id, CancellationToken cancellationToken = default);
  Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);

  Task<User?> GetByRefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default);

  Task AddAsync(User user, CancellationToken cancellationToken = default);

  Task UpdateAsync(User user, CancellationToken cancellationToken = default);

  Task<bool> ExistsByEmailAsync(string email, CancellationToken cancellationToken = default);
}
