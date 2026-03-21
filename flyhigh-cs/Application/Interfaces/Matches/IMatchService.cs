using Application.DTOs.Matches;
using Domain.Entities.Matches.MatchEnums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Interfaces.Matches;

public interface IMatchService
{
  Task<Guid> ProposeMatchAsync(CreateMatchDto dto, Guid currentUserId, CancellationToken cancellationToken = default);
  Task<IEnumerable<MatchResponseDto>> GetUserMatchesAsync(Guid currentUserId, CancellationToken cancellationToken = default);
  Task AcceptMatchAsync(Guid matchId, Guid currentUserId, CancellationToken cancellationToken = default);
  Task RejectMatchAsync(Guid matchId, CancellationToken cancellationToken = default);
  Task SetRefereeAsync(Guid matchId, Guid refereeId, Guid currentUserId, CancellationToken cancellationToken = default);
  Task AddPlayerToRosterAsync(Guid matchId, RosterPlayerDto dto, CancellationToken cancellationToken = default);
  Task StartMatchAsync(Guid matchId, Guid currentUserId, CancellationToken cancellationToken = default);
  Task AssignPlayerPositionAsync(Guid matchId, Guid currentUserId, AssignPositionDto dto, CancellationToken cancellationToken = default);
  Task AddPointAsync(Guid matchId, Guid currentUserId, SetSide side, CancellationToken cancellationToken = default);
  Task CancelMatchAsync(Guid matchId, Guid currentUserId, CancelMatchDto dto, CancellationToken cancellationToken = default);
  Task<MatchDetailDto> GetMatchByIdAsync(Guid matchId, Guid currentUserId, CancellationToken cancellationToken = default);
}
