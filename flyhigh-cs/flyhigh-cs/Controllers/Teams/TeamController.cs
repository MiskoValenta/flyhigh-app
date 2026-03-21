using Application.DTOs.Teams;
using Application.Services.Teams;
using Domain.Entities.Users;
using Domain.Repositories.Teams;
using Domain.Value_Objects.Teams;
using Domain.Value_Objects.Users;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace API.Controllers.Teams;

[ApiController]
[Route("api/teams")]
public class TeamController : ControllerBase
{
  private readonly ITeamService _teamService;

  public TeamController(ITeamService teamService)
  {
    _teamService = teamService;
  }

  private Guid GetCurrentUserId()
  {
    return User.GetUserId();
  }

  [HttpPost("create")]
  public async Task<IActionResult> CreateTeam([FromBody] CreateTeamDto dto)
  {
    try
    {
      var currentUserId = GetCurrentUserId();
      var newTeamId = await _teamService.CreateTeamAsync(dto, currentUserId);
      return Ok(new { TeamId = newTeamId });
    }
    catch (UnauthorizedAccessException ex) { return Unauthorized(ex.Message); }
    catch (Exception ex) { return BadRequest(ex.Message); }
  }

  [HttpGet]
  public async Task<IActionResult> GetMyTeams(CancellationToken cancellationToken)
  {
    try
    {
      var currentUserId = GetCurrentUserId();
      var teams = await _teamService.GetUserTeamsAsync(currentUserId, cancellationToken);
      return Ok(teams);
    }
    catch (UnauthorizedAccessException ex) { return Unauthorized(ex.Message); }
  }

  [HttpGet("{teamId}")]
  public async Task<IActionResult> GetTeam([FromRoute] Guid teamId)
  {
    try
    {
      var currentUserId = GetCurrentUserId();
      var teamDetail = await _teamService.GetTeamByIdAsync(teamId, currentUserId);
      return Ok(teamDetail);
    }
    catch (UnauthorizedAccessException ex) { return Forbid(ex.Message); }
    catch (KeyNotFoundException ex) { return NotFound(ex.Message); }
    catch (Exception ex) { return BadRequest(ex.Message); }
  }

  [HttpDelete("{teamId}")]
  public async Task<IActionResult> DeleteTeam([FromRoute] Guid teamId)
  {
    try
    {
      var currentUserId = GetCurrentUserId();
      await _teamService.DeleteTeamAsync(teamId, currentUserId);
      return NoContent();
    }
    catch (UnauthorizedAccessException ex) { return Forbid(ex.Message); }
    catch (KeyNotFoundException ex) { return NotFound(ex.Message); }
    catch (Exception ex) { return BadRequest(ex.Message); }
  }

  [HttpPost("{teamId}/members")]
  public async Task<IActionResult> InviteMember([FromRoute] Guid teamId, [FromBody] AddMemberDto dto)
  {
    try
    {
      var currentUserId = GetCurrentUserId();
      await _teamService.InviteMemberAsync(teamId, currentUserId, dto);
      return Ok(new { Message = "Akce s přidáním člena proběhla úspěšně." });
    }
    catch (UnauthorizedAccessException ex) { return Forbid(ex.Message); }
    catch (KeyNotFoundException ex) { return NotFound(ex.Message); }
    catch (Exception ex) { return BadRequest(ex.Message); }
  }

  [HttpPatch("{teamId}/invites/accept")]
  public async Task<IActionResult> AcceptInvitation([FromRoute] Guid teamId)
  {
    try
    {
      var currentUserId = GetCurrentUserId();
      await _teamService.AcceptInvitationAsync(teamId, currentUserId);
      return Ok(new { Message = "Pozvánka byla přijata." });
    }
    catch (KeyNotFoundException ex) { return NotFound(ex.Message); }
    catch (Exception ex) { return BadRequest(ex.Message); }
  }

  [HttpPatch("{teamId}/invites/decline")]
  public async Task<IActionResult> DeclineInvitation([FromRoute] Guid teamId)
  {
    try
    {
      var currentUserId = GetCurrentUserId();
      await _teamService.DeclineInvitationAsync(teamId, currentUserId);
      return Ok(new { Message = "Pozvánka byla odmítnuta." });
    }
    catch (KeyNotFoundException ex) { return NotFound(ex.Message); }
    catch (Exception ex) { return BadRequest(ex.Message); }
  }

  [HttpGet("invites/pending")]
  public async Task<IActionResult> GetPendingInvitations(CancellationToken ct)
  {
    var invitations = await _teamService.GetPendingInvitationsAsync(GetCurrentUserId(), ct);
    return Ok(invitations);
  }

  [HttpDelete("{teamId}/members/{memberId}")]
  public async Task<IActionResult> RemoveMember([FromRoute] Guid teamId, [FromRoute] Guid memberId)
  {
    try
    {
      var currentUserId = GetCurrentUserId();
      await _teamService.RemoveMemberAsync(teamId, currentUserId, memberId);
      return NoContent();
    }
    catch (UnauthorizedAccessException ex) { return Forbid(ex.Message); }
    catch (KeyNotFoundException ex) { return NotFound(ex.Message); }
    catch (Exception ex) { return BadRequest(ex.Message); }
  }

  [HttpPut("{teamId}/members/{memberId}/role")]
  public async Task<IActionResult> ChangeRole([FromRoute] Guid teamId, [FromRoute] Guid memberId, [FromBody] ChangeRoleDto dto)
  {
    try
    {
      var currentUserId = GetCurrentUserId();
      await _teamService.PromoteMemberAsync(teamId, currentUserId, memberId, dto);
      return Ok(new { Message = "Role byla úspěšně změněna." });
    }
    catch (UnauthorizedAccessException ex) { return Forbid(ex.Message); }
    catch (KeyNotFoundException ex) { return NotFound(ex.Message); }
    catch (Exception ex) { return BadRequest(ex.Message); }
  }

  [HttpPut("{id}")]
  [Authorize]
  public async Task<IActionResult> UpdateTeam(Guid id, [FromBody] UpdateTeamDto dto, CancellationToken ct)
  {
    try
    {
      var currentUserId = GetCurrentUserId();

      await _teamService.UpdateTeamAsync(id, dto, currentUserId, ct);
      return Ok(new { message = "Tým byl aktualizován." });
    }
    catch (Exception ex)
    {
      if (ex.Message.Contains("oprávnění")) 
        return Forbid();
      return BadRequest(new { message = ex.Message });
    }
  }
}