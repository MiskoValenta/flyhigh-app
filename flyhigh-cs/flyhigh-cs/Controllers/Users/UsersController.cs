using Application.DTOs.Users;
using Application.Services.Users;
using Domain.Entities.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers.Users;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
  private readonly IUserService _userService;

  public UsersController(IUserService userService)
  {
    _userService = userService;
  }

  private Guid GetCurrentUserId()
  {
    return Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
  }

  [HttpPut("profile")]
  public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto, CancellationToken ct)
  {
    try
    {
      await _userService.UpdateProfileAsync(GetCurrentUserId(), dto, ct);
      return Ok(new { message = "Profil aktualizován." });
    }
    catch (Exception ex)
    {
      return BadRequest(new { message = ex.Message });
    }
  }

  [HttpPut("change-password")]
  public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto, CancellationToken ct)
  {
    try
    {
      await _userService.ChangePasswordAsync(GetCurrentUserId(), dto, ct);
      return Ok(new { message = "Heslo bylo změněno." });
    }
    catch (Exception ex)
    {
      return BadRequest(new { message = ex.Message });
    }
  }
}
