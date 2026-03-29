using Application.DTOs.Users;
using Application.Services.Users;
using Domain.Entities.Users;
using Domain.Repositories.Users;
using Domain.Value_Objects.Users;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers.Users;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
  private readonly IAuthService _authService;
  private readonly IUserRepository _userRepository;

  public AuthController(IAuthService authService, IUserRepository userRepository)
  {
    _authService = authService;
    _userRepository = userRepository;
  }

  [HttpPost("register")]
  public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
  {
    try
    {
      var tokens = await _authService.RegisterAsync(request, cancellationToken);
      SetTokensInCookies(tokens.AccessToken, tokens.RefreshToken);

      return Ok(new { message = "Registration was successful" });
    }
    catch (Exception ex)
    {
      return BadRequest(new { message = ex.Message });
    }
  }

  [HttpPost("login")]
  public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
  {
    try
    {
      var tokens = await _authService.LoginAsync(request, cancellationToken);
      SetTokensInCookies(tokens.AccessToken, tokens.RefreshToken);

      return Ok(new { message = "Login was successful" });
    }
    catch (Exception ex)
    {
      return Unauthorized(new { message = ex.Message });
    }
  }

  [HttpPost("refresh")]
  public async Task<IActionResult> Refresh(CancellationToken cancellationToken)
  {
    try
    {
      var refreshToken = Request.Cookies["refreshToken"];
      if (string.IsNullOrEmpty(refreshToken))
        return Unauthorized(new { message = "Missing Refresh Token" });

      var tokens = await _authService.RefreshTokensAsync(refreshToken, cancellationToken);
      SetTokensInCookies(tokens.AccessToken, tokens.RefreshToken);

      return Ok(new { message = "Tokeny obnoveny" });
    }
    catch (Exception ex)
    {
      return Unauthorized(new { message = ex.Message });
    }
  }

  [HttpPost("logout")]
  public IActionResult Logout()
  {
    Response.Cookies.Delete("accessToken");
    Response.Cookies.Delete("refreshToken");
    return Ok(new { message = "Logout was successful" });
  }

  [Authorize]
  [HttpGet("me")]
  public async Task<ActionResult<UserProfileDto>> GetCurrentUser()
  {
    var userId = User.GetUserId();

    var user = await _userRepository.GetByIdAsync(new UserId(userId));
    if (user == null) return NotFound();

    var userProfile = new UserProfileDto(
      user.Id.Value,
      user.Email,
      user.FirstName,
      user.LastName
    );

    return Ok(userProfile);
  }

  [HttpPost("forgot-password")]
  public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request, CancellationToken cancellationToken)
  {
    try
    {
      await _authService.ResetPasswordAsync(request.Email, cancellationToken);

      return Ok(new { message = "Pokud email existuje v naší databázi, bylo na něj zasláno nové heslo." });
    }
    catch (Exception ex)
    {
      return BadRequest(new { message = ex.Message });
    }
  }

  private void SetTokensInCookies(string accessToken, string refreshToken)
  {
    var cookieOptions = new CookieOptions
    {
      HttpOnly = true,
      Secure = true, // Káre, při produkci změnit z false na true
      SameSite = SameSiteMode.Lax,
      Expires = DateTime.UtcNow.AddMinutes(60)
    };

    var refreshCookieOptions = new CookieOptions
    {
      HttpOnly = true,
      Secure = true,
      SameSite = SameSiteMode.Lax,
      Expires = DateTime.UtcNow.AddDays(7)
    };

    Response.Cookies.Append("accessToken", accessToken, cookieOptions);
    Response.Cookies.Append("refreshToken", refreshToken, refreshCookieOptions);
  }
}