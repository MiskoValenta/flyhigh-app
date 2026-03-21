using Application.DTOs.Events;
using Application.Interfaces.Events;
using Domain.Entities.Users;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers.Events;

[ApiController]
[Route("api/events")]
[Authorize]
public class EventController : ControllerBase
{
  private readonly IEventService _eventService;

  public EventController(IEventService eventService)
  {
    _eventService = eventService;
  }

  private Guid GetCurrentUserId()
  {
    return User.GetUserId();
  }

  [HttpPost]
  public async Task<IActionResult> CreateEvent([FromBody] CreateEventDto dto, CancellationToken ct)
  {
    try
    {
      var eventId = await _eventService.CreateEventAsync(dto, GetCurrentUserId(), ct);
      return Ok(new { EventId = eventId });
    }
    catch (UnauthorizedAccessException ex) 
    { 
      return Forbid(ex.Message); 
    }
    catch (Exception ex) 
    { 
      return BadRequest(new { message = ex.Message }); 
    }
  }

  [HttpGet("team/{teamId}")]
  public async Task<IActionResult> GetTeamEvents([FromRoute] Guid teamId, CancellationToken ct)
  {
    try
    {
      var events = await _eventService.GetTeamEventsAsync(teamId, GetCurrentUserId(), ct);
      return Ok(events);
    }
    catch (UnauthorizedAccessException ex) 
    { 
      return Forbid(ex.Message); 
    }
    catch (Exception ex) 
    { 
      return BadRequest(new { message = ex.Message });
    }
  }

  [HttpGet("{eventId}")]
  public async Task<IActionResult> GetEvent([FromRoute] Guid eventId, CancellationToken ct)
  {
    try
    {
      var teamEvent = await _eventService.GetEventByIdAsync(eventId, GetCurrentUserId(), ct);
      return Ok(teamEvent);
    }
    catch (KeyNotFoundException ex) 
    { 
      return NotFound(ex.Message); 
    }
    catch (UnauthorizedAccessException ex) 
    { 
      return Forbid(ex.Message); 
    }
    catch (Exception ex) 
    { 
      return BadRequest(new { message = ex.Message }); 
    }
  }

  [HttpPatch("{eventId}/respond")]
  [HttpPost("{eventId}/respond")]
  public async Task<IActionResult> RespondToEvent([FromRoute] Guid eventId, [FromBody] RespondToEventDto dto)
  {
    try
    {
      var currentUserId = User.GetUserId();
      await _eventService.RespondToEventAsync(eventId, currentUserId, dto);
      return Ok(new { Message = "Odpověď byla uložena." });
    }
    catch (Exception ex)
    {
      return BadRequest(new { Message = ex.Message });
    }
  }

  [HttpDelete("{eventId}")]
  public async Task<IActionResult> DeleteEvent([FromRoute] Guid eventId, CancellationToken ct)
  {
    try
    {
      await _eventService.DeleteEventAsync(eventId, GetCurrentUserId(), ct);
      return NoContent();
    }
    catch (UnauthorizedAccessException ex) 
    {
      return Forbid(ex.Message); 
    }
    catch (KeyNotFoundException ex) 
    {
      return NotFound(ex.Message); 
    }
    catch (Exception ex) 
    { 
      return BadRequest(new { message = ex.Message }); 
    }
  }
}
