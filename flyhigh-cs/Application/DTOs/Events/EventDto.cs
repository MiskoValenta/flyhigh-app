using Domain.Entities.Events.EventEnums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.DTOs.Events;

public record EventDto(
    Guid Id,
    Guid TeamId,
    Guid CreatorId,
    string Title,
    string? Description,
    EventType Type,
    DateTime? EventDate,
    string? Location,
    DateTime CreatedAt,
    List<EventParticipantDto> Participants,
    string MyResponse,
    int AcceptedCount,
    int DeclinedCount
);

public record EventParticipantDto(
    Guid UserId,
    EventResponse Response
);

public record CreateEventDto(
    Guid TeamId,
    string Title,
    string Description,
    EventType Type,
    DateTime? EventDate,
    string Location,
    List<Guid> InvitedUserIds
);

public record RespondToEventDto(
    EventResponse Response
);