using Domain.Entities.Teams;
using Domain.Value_Objects.Teams;
using Domain.Value_Objects.Users;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Repositories.Teams;

public interface ITeamRepository
{
  Task<Team?> GetByIdAsync(TeamId id, CancellationToken cancellationToken = default);
  Task<Team?> GetTeamWithActiveMembersAsync(TeamId id, CancellationToken cancellationToken = default);
  Task<Team?> GetTeamByNameAsync(string teamName, CancellationToken cancellationToken = default);
  Task<IEnumerable<Team>> GetPendingInvitationsAsync(UserId userId, CancellationToken cancellationToken = default);
  Task<List<Team>> GetUserTeamsAsync(UserId userId, CancellationToken cancellationToken = default);
  Task<bool> ExistsByIdAsync(TeamId id, CancellationToken cancellationToken = default);
  Task AddAsync(Team team, CancellationToken cancellationToken = default);
  Task UpdateAsync(Team team, CancellationToken cancellationToken = default);
  Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
