using Application.DTOs.Users;

namespace Application.Services.Users;

public interface IAuthService
{
  Task<AuthTokens> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default);
  Task<AuthTokens> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
  Task<AuthTokens> RefreshTokensAsync(string refreshToken, CancellationToken cancellationToken = default);
  Task ResetPasswordAsync(string email, CancellationToken cancellationToken = default);
}
