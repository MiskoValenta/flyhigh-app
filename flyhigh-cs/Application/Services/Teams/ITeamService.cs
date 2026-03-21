using Application.DTOs.Teams;
using Domain.Entities.Teams.TeamEnums;
using Domain.Value_Objects.Teams;
using Domain.Value_Objects.Users;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Services.Teams;

public interface ITeamService
{
  Task<Guid> CreateTeamAsync(CreateTeamDto dto, Guid currentUserId);
  Task<List<TeamResponseDto>> GetUserTeamsAsync(Guid currentUserId, CancellationToken cancellationToken = default);
  Task<TeamDetailDto> GetTeamByIdAsync(Guid teamId, Guid currentUserId);
  Task<IEnumerable<PendingInvitationDto>> GetPendingInvitationsAsync(Guid currentUserId, CancellationToken cancellationToken = default);
  Task DeleteTeamAsync(Guid teamId, Guid actorId);

  Task InviteMemberAsync(Guid teamId, Guid actorId, AddMemberDto dto);
  Task AcceptInvitationAsync(Guid teamId, Guid currentUserId);
  Task DeclineInvitationAsync(Guid teamId, Guid currentUserId);

  Task RemoveMemberAsync(Guid teamId, Guid actorId, Guid targetMemberId);
  Task PromoteMemberAsync(Guid teamId, Guid actorId, Guid targetMemberId, ChangeRoleDto dto);
  Task UpdateTeamAsync(Guid id, UpdateTeamDto dto, Guid currentUserId, CancellationToken ct);
}
