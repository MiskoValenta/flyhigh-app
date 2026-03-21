using Domain.Common;
using Domain.Value_Objects.Matches;
using Domain.Value_Objects.Teams;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Matches;

public class MatchRosterEntry : Entity<MatchRosterEntryId>
{
  public MatchId MatchId { get; private set; }
  public TeamMemberId TeamMemberId { get; private set; }
  public TeamId TeamId { get; private set; }
  public int JerseyNumber { get; private set; }

  private MatchRosterEntry() { }

  private MatchRosterEntry(
      MatchRosterEntryId id,
      MatchId matchId,
      TeamMemberId teamMemberId,
      TeamId teamId,
      int jerseyNumber) : base(id)
  {
    MatchId = matchId;
    TeamMemberId = teamMemberId;
    TeamId = teamId;
    JerseyNumber = jerseyNumber;
  }

  public static MatchRosterEntry Create(
      MatchId matchId,
      TeamMemberId teamMemberId,
      TeamId teamId,
      int jerseyNumber)
  {
    var newId = MatchRosterEntryId.New();

    return new MatchRosterEntry(
        newId,
        matchId,
        teamMemberId,
        teamId,
        jerseyNumber
    );
  }
}
