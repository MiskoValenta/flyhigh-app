using Domain.Common;
using Domain.Entities.Events.EventEnums;
using Domain.Value_Objects.Events;
using Domain.Value_Objects.Users;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Events;

public class EventParticipant : Entity<EventParticipantId>
{
  public EventId EventId { get; private set; }
  public UserId UserId { get; private set; }
  public EventResponse Response { get; private set; }

  private EventParticipant() { }

  internal EventParticipant(EventParticipantId id, EventId eventId, UserId userId) : base(id)
  {
    EventId = eventId;
    UserId = userId;
    Response = EventResponse.Unknown;
  }

  internal void UpdateResponse(EventResponse newResponse)
  {
    Response = newResponse;
  }
}
