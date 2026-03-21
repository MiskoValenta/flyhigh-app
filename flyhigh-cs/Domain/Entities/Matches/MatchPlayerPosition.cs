using Domain.Common;
using Domain.Entities.Matches.MatchEnums;
using Domain.Value_Objects.Matches;
using Domain.Value_Objects.Teams;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Matches;

public class MatchPlayerPosition : Entity<MatchPlayerPositionId>
{
  public TeamMemberId TeamMemberId { get; private set; }
  public PlayerPosition Position { get; private set; }

  private MatchPlayerPosition() { }

  private MatchPlayerPosition(
    MatchPlayerPositionId id, 
    TeamMemberId teamMemberId, 
    PlayerPosition position) : base(id)
  {
    TeamMemberId = teamMemberId;
    Position = position;
  }

  public static MatchPlayerPosition Create(
    TeamMemberId teamMemberId, 
    PlayerPosition position)
  {
    var newId = MatchPlayerPositionId.New();

    return new MatchPlayerPosition(
      newId, 
      teamMemberId, 
      position);
  }

  internal void UpdatePosition(PlayerPosition newPosition)
  {
    Position = newPosition;
  }

}
