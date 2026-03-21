using Domain.Common;
using Domain.Entities.Matches.Exceptions;
using Domain.Entities.Matches.MatchEnums;
using Domain.Entities.Matches.Rules;
using Domain.Value_Objects.Matches;
using Domain.Value_Objects.Teams;
using Domain.Value_Objects.Users;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Matches;

public class Match : AuditableEntity<MatchId>
{
  private readonly List<MatchSet> _sets = new();
  private readonly List<MatchRosterEntry> _roster = new();

  public UserId CreatorId { get; private set; }
  public TeamId HomeTeamId { get; private set; }
  public TeamId AwayTeamId { get; private set; }
  public string Location { get; private set; }

  public DateTime ScheduledAt { get; private set; }
  public UserId? RefereeId { get; private set; }
  public string? Notes { get; private set; }
  public MatchStatus Status { get; private set; }
  public TeamId? WinnerId { get; private set; }

  public IReadOnlyCollection<MatchSet> Sets => _sets.AsReadOnly();
  public IReadOnlyCollection<MatchRosterEntry> Roster => _roster.AsReadOnly();

  private Match() { }

  private Match(
      MatchId id,
      UserId creatorId,
      TeamId homeTeamId,
      TeamId awayTeamId,
      DateTime scheduledAt,
      string location) : base(id)
  {

    if (string.IsNullOrWhiteSpace(location)) 
      throw new ArgumentException("Location cannot be empty", nameof(location));

    CreatorId = creatorId;
    HomeTeamId = homeTeamId;
    AwayTeamId = awayTeamId;
    ScheduledAt = scheduledAt;
    Location = location;

    Status = MatchStatus.Proposed;
  }

  public static Match CreateInvitation(
      UserId creatorId,
      TeamId homeTeamId,
      TeamId awayTeamId,
      DateTime scheduledAt,
      string location)
  {
    if (homeTeamId == awayTeamId)
      throw new MatchInvalidException("Home and Away teams must be different.");

    var newId = MatchId.New();

    return new Match(
        newId,
        creatorId,
        homeTeamId,
        awayTeamId,
        scheduledAt,
        location);
  }

  public void AcceptInvitation()
  {
    if (Status != MatchStatus.Proposed)
      throw new MatchInvalidException("Only proposed match can be accepted.");

    Status = MatchStatus.Accepted;
    MarkAsModified();
    
  }

  public void RejectInvitation()
  {
    if (Status != MatchStatus.Proposed)
      throw new InvalidOperationException("Only proposed match can be rejected.");

    Status = MatchStatus.Rejected;
    MarkAsModified();
  }

  public void SetReferee(UserId refereeId)
  {
    if (Status == MatchStatus.Finished || Status == MatchStatus.Cancelled)
      throw new MatchInvalidException("Cannot set referee for finished or cancelled match.");

    RefereeId = refereeId;
    MarkAsModified();
  }

  public void AddToRoster(TeamMemberId teamMemberId, TeamId teamId, int jerseyNumber)
  {
    if (Status == MatchStatus.Finished || Status == MatchStatus.Cancelled)
      throw new MatchInvalidException("Cannot modify roster for finished or cancelled match.");

    if (teamId != HomeTeamId && teamId != AwayTeamId)
      throw new MatchInvalidException("Team does not play in this match.");

    if (_roster.Any(x => x.TeamMemberId == teamMemberId))
      throw new MatchInvalidException("Player is already on the roster.");

    if (_roster.Any(x => x.TeamId == teamId && x.JerseyNumber == jerseyNumber))
      throw new InvalidOperationException($"Jersey number {jerseyNumber} is already taken in this team.");

    _roster.Add(MatchRosterEntry.Create(
      Id, teamMemberId, 
      teamId, 
      jerseyNumber));

    MarkAsModified();
  }

  public void StartMatch(ISetRules setRules)
  {
    if (Status != MatchStatus.Accepted && Status != MatchStatus.Scheduled)
      throw new MatchInvalidException("Match must be accepted or scheduled to start.");

    ValidateRoster();
    Status = MatchStatus.InProgress;

    _sets.Add(MatchSet.Create(1, SetType.Normal));
    MarkAsModified();
  }

  public void AssignPlayerPositionForSet(int setNumber, TeamMemberId teamMemberId, PlayerPosition position)
  {
    if (Status != MatchStatus.InProgress && Status != MatchStatus.Scheduled && Status != MatchStatus.Accepted)
      throw new MatchInvalidException("Positions can only be assigned before or during the match.");

    var set = _sets.SingleOrDefault(s => s.SetNumber == setNumber);
    if (set == null)
      throw new InvalidOperationException($"Set {setNumber} does not exist.");

    if (!_roster.Any(r => r.TeamMemberId == teamMemberId))
      throw new MatchInvalidException("Player must be added to roster before assigning a position.");

    set.AssignPlayerPosition(teamMemberId, position);
    MarkAsModified();
  }

  public void AddPoint(SetSide side, ISetRules setRules, IMatchRules matchRules)
  {
    if (Status != MatchStatus.InProgress)
      throw new MatchInvalidException("Match is not in progress.");

    var currentSet = _sets.OrderBy(s => s.SetNumber).Last();
    currentSet.AddPoint(side, setRules);

    if (currentSet.IsFinished)
    {
      HandleFinishedSet(setRules, matchRules);
    }
    MarkAsModified();
  }

  private void HandleFinishedSet(ISetRules setRules, IMatchRules matchRules)
  {
    if (matchRules.IsMatchFinished(_sets))
    {
      Status = MatchStatus.Finished;

      int homeWins = _sets.Count(s => s.Winner == SetWinner.Home);
      int awayWins = _sets.Count(s => s.Winner == SetWinner.Away);

      WinnerId = homeWins > awayWins ? HomeTeamId : AwayTeamId;

      return;
    }

    int currentHomeWins = _sets.Count(s => s.Winner == SetWinner.Home);
    int currentAwayWins = _sets.Count(s => s.Winner == SetWinner.Away);

    bool isTieBreak = currentHomeWins == 2 && currentAwayWins == 2;

    _sets.Add(MatchSet.Create(
        _sets.Count + 1,
        isTieBreak ? SetType.TieBreak : SetType.Normal
    ));
  }

  public void CancelMatch(string cancellationReason)
  {
    if (Status == MatchStatus.Finished || Status == MatchStatus.Rejected)
      throw new MatchInvalidException("Cannot cancel match that is already finished or rejected.");

    Status = MatchStatus.Cancelled;
    Notes = string.IsNullOrWhiteSpace(Notes)
        ? cancellationReason
        : $"{Notes} | Cancel Reason: {cancellationReason}";

    MarkAsDeleted();
  }

  private void ValidateRoster()
  {
    int homeCount = _roster.Count(x => x.TeamId == HomeTeamId);
    int awayCount = _roster.Count(x => x.TeamId == AwayTeamId);

    if (homeCount < 6 || awayCount < 6)
      throw new MatchInvalidException("Both teams must have at least 6 players on the roster to start the match.");
  }
}
