using Application.DTOs.Matches;
using Application.Interfaces.Matches;
using Domain.Entities.Matches.MatchEnums;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Matches;

[ApiController]
[Route("api/matches")]
[Authorize]
public class MatchController : ControllerBase
{
  private readonly IMatchService _matchService;

  public MatchController(IMatchService matchService)
  {
    _matchService = matchService;
  }
  private Guid GetCurrentUserId()
  {
    return User.GetUserId();
  }
  [HttpGet]
  public async Task<IActionResult> GetMyMatches(CancellationToken ct)
  {
    var matches = await _matchService.GetUserMatchesAsync(GetCurrentUserId(), ct);
    return Ok(matches);
  }

  [HttpGet("{id}")]
  public async Task<IActionResult> GetMatchById(Guid id, CancellationToken ct)
  {
    try
    {
      var match = await _matchService.GetMatchByIdAsync(id, GetCurrentUserId(), ct);
      return Ok(match);
    }
    catch (Exception ex)
    {
      return BadRequest(new { Message = ex.Message });
    }
  }

  [HttpPost("propose")]
  public async Task<IActionResult> ProposeMatch([FromBody] CreateMatchDto dto, CancellationToken ct)
  {
    var matchId = await _matchService.ProposeMatchAsync(dto, GetCurrentUserId(), ct);
    return Ok(new { MatchId = matchId });
  }

  [HttpPost("{id}/accept")]
  public async Task<IActionResult> AcceptMatch(Guid id, CancellationToken ct)
  {
    await _matchService.AcceptMatchAsync(id, GetCurrentUserId(), ct);
    return NoContent();
  }

  [HttpPost("{id}/reject")]
  public async Task<IActionResult> RejectMatch(Guid id, CancellationToken ct)
  {
    await _matchService.RejectMatchAsync(id, ct);
    return NoContent();
  }

  [HttpPost("{id}/referee/{refereeId}")]
  public async Task<IActionResult> SetReferee(Guid id, Guid refereeId, CancellationToken ct)
  {
    await _matchService.SetRefereeAsync(id, refereeId, GetCurrentUserId(), ct);
    return NoContent();
  }

  [HttpPost("{id}/roster")]
  public async Task<IActionResult> RosterPlayer(Guid id, [FromBody] RosterPlayerDto dto, CancellationToken ct)
  {
    try
    {
      await _matchService.AddPlayerToRosterAsync(id, dto, ct);
      return Ok(new { Message = "Hráč byl přidán na soupisku." });
    }
    catch (Exception ex)
    {
      return BadRequest(new { Message = ex.Message });
    }
  }

    [HttpPost("{id}/start")]
  public async Task<IActionResult> StartMatch(Guid id, CancellationToken ct)
  {
    try
    {
      await _matchService.StartMatchAsync(id, GetCurrentUserId(), ct);
      return Ok(new { Message = "Zápas byl zahájen." });
    }
    catch (Exception ex)
    {
      return BadRequest(new { Message = ex.Message });
    }
  }

  [HttpPost("{id}/positions")]
  public async Task<IActionResult> AssignPosition(Guid id, [FromBody] AssignPositionDto dto, CancellationToken ct)
  {
    await _matchService.AssignPlayerPositionAsync(id, GetCurrentUserId(), dto, ct);
    return NoContent();
  }

  [HttpPost("{id}/point/{side}")]
  public async Task<IActionResult> AddPoint(Guid id, SetSide side, CancellationToken ct)
  {
    await _matchService.AddPointAsync(id, GetCurrentUserId(), side, ct);
    return NoContent();
  }

  [HttpPost("{id}/cancel")]
  public async Task<IActionResult> CancelMatch(Guid id, [FromBody] CancelMatchDto dto, CancellationToken ct)
  {
    await _matchService.CancelMatchAsync(id, GetCurrentUserId(), dto, ct);
    return NoContent();
  }
}
