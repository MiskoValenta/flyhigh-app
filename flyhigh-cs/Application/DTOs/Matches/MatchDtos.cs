using Domain.Entities.Matches.MatchEnums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.DTOs.Matches;

public class CreateMatchDto
{
  public Guid HomeTeamId { get; set; }
  public Guid AwayTeamId { get; set; }
  public DateTime ScheduledAt { get; set; }
  public string Location { get; set; } = string.Empty;
}

public class AssignPositionDto
{
  public int SetNumber { get; set; }
  public Guid TeamMemberId { get; set; }
  public PlayerPosition Position { get; set; }
}

public record MatchDetailDto(
    Guid Id,
    Guid CreatorId,
    Guid HomeTeamId,
    string HomeTeamName,
    Guid AwayTeamId,
    string AwayTeamName,
    string Location,
    DateTime ScheduledAt,
    string Status,
    List<RosterPlayerDto> Roster,
    List<MatchSetDto> Sets,
    Guid? WinnerId
);

public record RosterPlayerDto(
    Guid TeamMemberId,
    Guid TeamId,
    int JerseyNumber
);

public class CancelMatchDto
{
  public string Reason { get; set; } = string.Empty;
}

public record MatchResponseDto(
    Guid Id,
    Guid HomeTeamId,
    string HomeTeamName,
    Guid AwayTeamId,
    string AwayTeamName,
    string Location,
    DateTime ScheduledAt,
    string Status
);

public record MatchSetDto(
    int SetNumber,
    string Type,
    int HomeScore,
    int AwayScore,
    bool IsFinished,
    string Winner
);
