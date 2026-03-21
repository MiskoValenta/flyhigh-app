using Domain.Common;
using Domain.Entities.Matches.MatchEnums;
using Domain.Entities.Matches.Rules;
using Domain.Value_Objects.Matches;
using Domain.Value_Objects.Teams;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Matches;

public class MatchSet : AuditableEntity<MatchSetId>
{
  private readonly List<MatchPlayerPosition> _playerPositions = new();

  public int SetNumber { get; private set; }
  public SetType Type { get; private set; }

  public int HomeScore { get; private set; }
  public int AwayScore { get; private set; }

  public bool IsFinished { get; private set; }
  public SetWinner Winner { get; private set; }

  public IReadOnlyCollection<MatchPlayerPosition> PlayerPositions => _playerPositions.AsReadOnly();

  private MatchSet() { }

  private MatchSet(
      MatchSetId id,
      int setNumber,
      SetType type
  ) : base(id)
  {
    SetNumber = setNumber;
    Type = type;

    HomeScore = 0;
    AwayScore = 0;

    IsFinished = false;
    Winner = SetWinner.None;
  }

  public static MatchSet Create(
    int setNumber, 
    SetType type)
  {
    var newId = MatchSetId.New();

    return new MatchSet(
      newId, 
      setNumber, 
      type);
  }

  public void AddPoint(SetSide side, ISetRules rules)
  {
    EnsureNotFinished();

    if (side == SetSide.Home)
      HomeScore++;
    else
      AwayScore++;

    TryFinish(rules);
    MarkAsModified();
  }

  public void AssignPlayerPosition(TeamMemberId teamMemberId, PlayerPosition position)
  {
    EnsureNotFinished();

    var existingPosition = _playerPositions.FirstOrDefault(p => p.TeamMemberId == teamMemberId);
    if (existingPosition != null)
    {
      existingPosition.UpdatePosition(position);
    }
    else
    {
      _playerPositions.Add(MatchPlayerPosition.Create(teamMemberId, position));
    }

    MarkAsModified();
  }

  private void EnsureNotFinished()
  {
    if (IsFinished)
      throw new InvalidOperationException("This set is already finished.");
  }

  private void TryFinish(ISetRules rules)
  {
    if (rules.IsWinningScore(HomeScore, AwayScore, Type))
    {
      Finish(SetWinner.Home);
      return;
    }

    if (rules.IsWinningScore(AwayScore, HomeScore, Type))
    {
      Finish(SetWinner.Away);
      return;
    }
  }

  private void Finish(SetWinner winner)
  {
    IsFinished = true;
    Winner = winner;
    MarkAsModified();
  }
}
