using Domain.Common;
using Domain.Entities.Events.EventEnums;
using Domain.Entities.Events.EventExceptions;
using Domain.Value_Objects.Events;
using Domain.Value_Objects.Teams;
using Domain.Value_Objects.Users;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Events;

public class Event : AuditableEntity<EventId>
{
  public TeamId TeamId { get; private set; }
  public UserId CreatorId { get; private set; }
  public string Title { get; private set; }
  public string? Description { get; private set; }
  public EventType Type { get; private set; }
  public DateTime? EventDate { get; private set; }
  public string? Location { get; private set; }
  public DateTime CreatedAt { get; private set; }

  private readonly List<EventParticipant> _participants = new();
  public IReadOnlyCollection<EventParticipant> Participants => _participants.AsReadOnly();

  private Event() { }

  public Event(EventId id, TeamId teamId, UserId creatorId, string title, string? description, EventType type, DateTime? eventDate, string? location) : base(id)
  {
    TeamId = teamId;
    CreatorId = creatorId;
    Title = title;
    Description = description;
    Type = type;
    EventDate = eventDate;
    Location = location;
    CreatedAt = DateTime.UtcNow;
  }

  public void AddParticipant(UserId userId)
  {
    if (_participants.Any(p => p.UserId == userId))
      throw new EventInvalidException("Uživatel je již účastníkem této události.");

    var participant = new EventParticipant(new EventParticipantId(Guid.NewGuid()), Id, userId);
    _participants.Add(participant);
  }

  public void RespondToEvent(UserId userId, EventResponse response)
  {
    if (Type == EventType.Announcement)
      throw new EventInvalidException("Na oznámení nelze odpovídat.");

    var participant = _participants.FirstOrDefault(p => p.UserId == userId)
        ?? throw new EventInvalidException("Uživatel není součástí této události.");

    participant.UpdateResponse(response);
  }
}
