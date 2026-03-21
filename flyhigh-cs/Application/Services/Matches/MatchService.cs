using Application.Common.Interfaces;
using Application.DTOs.Events;
using Application.DTOs.Matches;
using Application.Interfaces.Events;
using Application.Interfaces.Matches;
using Application.Interfaces.Teams;
using Domain.Entities.Matches;
using Domain.Entities.Matches.Exceptions;
using Domain.Entities.Matches.MatchEnums;
using Domain.Entities.Matches.Rules;
using Domain.Repositories.Matches;
using Domain.Repositories.Teams;
using Domain.Repositories.Users;
using Domain.Value_Objects.Matches;
using Domain.Value_Objects.Teams;
using Domain.Value_Objects.Users;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Services.Matches;

public class MatchService : IMatchService
{
  private readonly IMatchRepository _matchRepository;
  private readonly IUnitOfWork _unitOfWork;
  private readonly ISetRules _setRules;
  private readonly IMatchRules _matchRules;
  private readonly IEventService _eventService;
  private readonly ITeamRepository _teamRepository;

  public MatchService(
      IMatchRepository matchRepository,
      IUnitOfWork unitOfWork,
      ISetRules setRules,
      IMatchRules matchRules,
      IEventService eventService,
      ITeamRepository teamRepository)
  {
    _matchRepository = matchRepository;
    _unitOfWork = unitOfWork;
    _setRules = setRules;
    _matchRules = matchRules;
    _eventService = eventService;
    _teamRepository = teamRepository;
  }
  private void EnsureIsMatchCreator(Match match, Guid currentUserId)
  {
    if (match.CreatorId.Value != currentUserId)
    {
      throw new UnauthorizedAccessException("Tuto akci může provést pouze zakladatel zápasu.");
    }
  }

  public async Task<Guid> ProposeMatchAsync(CreateMatchDto dto, Guid currentUserId, CancellationToken cancellationToken = default)
  {
    var match = Match.CreateInvitation(
        new UserId(currentUserId),
        new TeamId(dto.HomeTeamId),
        new TeamId(dto.AwayTeamId),
        dto.ScheduledAt,
        dto.Location
    );

    await _matchRepository.AddAsync(match, cancellationToken);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    var awayTeam = await _teamRepository.GetByIdAsync(new TeamId(dto.AwayTeamId), cancellationToken);
    var awayTeamName = awayTeam?.TeamName ?? "Neznámý tým";

    var eventDto = new CreateEventDto(
        dto.HomeTeamId,
        $"Zápas: vs {awayTeamName}",
        $"Zápas s týmem {awayTeamName} na hřišti {dto.Location}.",
        Domain.Entities.Events.EventEnums.EventType.Match,
        dto.ScheduledAt,
        dto.Location,
        new List<Guid>()
    );

    await _eventService.CreateEventAsync(eventDto, currentUserId, cancellationToken);

    return match.Id.Value;
  }

  public async Task AcceptMatchAsync(Guid matchId, Guid currentUserId, CancellationToken cancellationToken = default)
  {
    var match = await GetMatchOrThrowAsync(matchId, cancellationToken);

    match.AcceptInvitation();
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    var eventDto = new CreateEventDto(
        match.AwayTeamId.Value,
        "Přijatý Zápas",
        $"Hrajeme zápas proti týmu {match.HomeTeamId.Value} v {match.Location}.",
        Domain.Entities.Events.EventEnums.EventType.Match,
        match.ScheduledAt,
        match.Location,
        new List<Guid>()
    );

    await _eventService.CreateEventAsync(eventDto, currentUserId, cancellationToken);
  }

  public async Task<MatchDetailDto> GetMatchByIdAsync(Guid matchId, Guid currentUserId, CancellationToken cancellationToken = default)
  {
    var match = await GetMatchOrThrowAsync(matchId, cancellationToken);

    var homeTeam = await _teamRepository.GetByIdAsync(match.HomeTeamId, cancellationToken);
    var awayTeam = await _teamRepository.GetByIdAsync(match.AwayTeamId, cancellationToken);

    var rosterDtos = match.Roster.Select(r => new RosterPlayerDto(
    r.TeamMemberId.Value,
    r.TeamId.Value,
    r.JerseyNumber
    )).ToList();

    var setDtos = match.Sets.Select(s => new MatchSetDto(
        s.SetNumber,
        s.Type.ToString(),
        s.HomeScore,
        s.AwayScore,
        s.IsFinished,
        s.Winner.ToString()
    )).OrderBy(s => s.SetNumber).ToList();

    return new MatchDetailDto(
        match.Id.Value,
        match.CreatorId.Value,
        match.HomeTeamId.Value,
        homeTeam?.TeamName ?? "Neznámý tým",
        match.AwayTeamId.Value,
        awayTeam?.TeamName ?? "Neznámý tým",
        match.Location,
        match.ScheduledAt,
        match.Status.ToString(),
        rosterDtos,
        setDtos,
        match.WinnerId?.Value
    );
  }

  public async Task SetRefereeAsync(Guid matchId, Guid refereeId, Guid currentUserId, CancellationToken cancellationToken = default)
  {
    var match = await GetMatchOrThrowAsync(matchId, cancellationToken);
    EnsureIsMatchCreator(match, currentUserId);

    match.SetReferee(new UserId(refereeId));
    await _unitOfWork.SaveChangesAsync(cancellationToken);
  }

  public async Task AddPlayerToRosterAsync(Guid matchId, RosterPlayerDto dto, CancellationToken cancellationToken = default)
  {
    var match = await GetMatchOrThrowAsync(matchId, cancellationToken);
    match.AddToRoster(new TeamMemberId(dto.TeamMemberId), new TeamId(dto.TeamId), dto.JerseyNumber);
    await _unitOfWork.SaveChangesAsync(cancellationToken);
  }

  public async Task StartMatchAsync(Guid matchId, Guid currentUserId, CancellationToken cancellationToken = default)
  {
    var match = await GetMatchOrThrowAsync(matchId, cancellationToken);
    EnsureIsMatchCreator(match, currentUserId);

    match.StartMatch(_setRules);
    await _unitOfWork.SaveChangesAsync(cancellationToken);
  }

  public async Task AssignPlayerPositionAsync(Guid matchId, Guid currentUserId, AssignPositionDto dto, CancellationToken cancellationToken = default)
  {
    var match = await GetMatchOrThrowAsync(matchId, cancellationToken);
    EnsureIsMatchCreator(match, currentUserId);

    match.AssignPlayerPositionForSet(dto.SetNumber, new TeamMemberId(dto.TeamMemberId), dto.Position);
    await _unitOfWork.SaveChangesAsync(cancellationToken);
  }

  public async Task AddPointAsync(Guid matchId, Guid currentUserId, SetSide side, CancellationToken cancellationToken = default)
  {
    var match = await GetMatchOrThrowAsync(matchId, cancellationToken);
    EnsureIsMatchCreator(match, currentUserId);

    match.AddPoint(side, _setRules, _matchRules);
    await _unitOfWork.SaveChangesAsync(cancellationToken);
  }

  public async Task CancelMatchAsync(Guid matchId, Guid currentUserId, CancelMatchDto dto, CancellationToken cancellationToken = default)
  {
    var match = await GetMatchOrThrowAsync(matchId, cancellationToken);
    EnsureIsMatchCreator(match, currentUserId);

    match.CancelMatch(dto.Reason);
    await _unitOfWork.SaveChangesAsync(cancellationToken);
  }

  public async Task RejectMatchAsync(Guid matchId, CancellationToken cancellationToken = default)
  {
    var match = await GetMatchOrThrowAsync(matchId, cancellationToken);
    match.RejectInvitation();
    await _unitOfWork.SaveChangesAsync(cancellationToken);
  }

  public async Task<IEnumerable<MatchResponseDto>> GetUserMatchesAsync(Guid currentUserId, CancellationToken cancellationToken = default)
  {
    var teams = await _teamRepository.GetUserTeamsAsync(new UserId(currentUserId), cancellationToken);
    var teamIds = teams.Select(t => t.Id).ToList();

    if (!teamIds.Any()) return new List<MatchResponseDto>();

    var matches = await _matchRepository.GetMatchesByTeamIdsAsync(teamIds, cancellationToken);
    var result = new List<MatchResponseDto>();

    foreach (var m in matches)
    {
      var homeTeam = await _teamRepository.GetByIdAsync(m.HomeTeamId, cancellationToken);
      var awayTeam = await _teamRepository.GetByIdAsync(m.AwayTeamId, cancellationToken);

      result.Add(new MatchResponseDto(
          m.Id.Value,
          m.HomeTeamId.Value,
          homeTeam?.TeamName ?? "Neznámý tým",
          m.AwayTeamId.Value,
          awayTeam?.TeamName ?? "Neznámý tým",
          m.Location,
          m.ScheduledAt,
          m.Status.ToString()
      ));
    }

    return result;
  }

  private async Task<Match> GetMatchOrThrowAsync(Guid matchId, CancellationToken cancellationToken)
  {
    var match = await _matchRepository.GetByIdAsync(new MatchId(matchId), cancellationToken);
    if (match == null)
      throw new MatchInvalidException("Match not found");
    return match;
  }
}
