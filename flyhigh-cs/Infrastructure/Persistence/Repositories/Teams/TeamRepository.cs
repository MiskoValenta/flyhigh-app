using Domain.Entities.Teams;
using Domain.Entities.Teams.TeamEnums;
using Domain.Repositories.Teams;
using Domain.Value_Objects.Teams;
using Domain.Value_Objects.Users;
using Infrastructure.Persistence.Repositories.Users;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Persistence.Repositories.Teams;

public class TeamRepository : ITeamRepository
{
  private readonly FlyHighDbContext _context;

  public TeamRepository(FlyHighDbContext context)
  {
    _context = context;
  }

  public async Task<Team?> GetByIdAsync(TeamId id, CancellationToken cancellationToken = default)
  {
    return await _context.Teams
        .Include(t => t.Members)
        .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
  }

  public async Task<Team?> GetTeamWithActiveMembersAsync(TeamId id, CancellationToken cancellationToken = default)
  {
    return await _context.Teams
        .Include(t => t.Members.Where(m => m.IsActive))
        .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
  }

  public async Task<Team?> GetTeamByNameAsync(string teamName, CancellationToken cancellationToken = default)
  {
    return await _context.Teams
        .Include(t => t.Members)
        .FirstOrDefaultAsync(t => t.TeamName == teamName, cancellationToken);
  }

  public async Task<IEnumerable<Team>> GetPendingInvitationsAsync(UserId userId, CancellationToken cancellationToken = default)
  {
    return await _context.Set<Team>()
        .Include(t => t.Members)
        .Where(t => t.Members.Any(m =>
            m.UserId == userId &&
            m.Status == TeamMemberStatus.Pending))
        .ToListAsync(cancellationToken);
  }

  public async Task<List<Team>> GetUserTeamsAsync(UserId userId, CancellationToken cancellationToken = default)
  {
    return await _context.Teams
        .Include(t => t.Members)
        .Where(t => t.Members.Any(m => m.UserId == userId))
        .ToListAsync(cancellationToken);
  }

  public async Task<bool> ExistsByIdAsync(TeamId id, CancellationToken cancellationToken = default)
  {
    return await _context.Teams.AnyAsync(t => t.Id == id, cancellationToken);
  }

  public async Task AddAsync(Team team, CancellationToken cancellationToken = default)
  {
    await _context.Teams.AddAsync(team, cancellationToken);
  }

  public Task UpdateAsync(Team team, CancellationToken cancellationToken = default)
  {
    _context.Teams.Update(team);
    return Task.CompletedTask;
  }

  public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
  {
    await _context.SaveChangesAsync(cancellationToken);
  }
}