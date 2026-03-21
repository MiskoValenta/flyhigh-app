using Domain.Entities.Events;
using Domain.Repositories.Events;
using Domain.Value_Objects.Events;
using Domain.Value_Objects.Teams;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Persistence.Repositories.Events;

public class EventRepository : IEventRepository
{
  private readonly FlyHighDbContext _context;

  public EventRepository(FlyHighDbContext context)
  {
    _context = context;
  }

  public async Task AddAsync(Event teamEvent, CancellationToken cancellationToken = default)
  {
    await _context.Set<Event>().AddAsync(teamEvent, cancellationToken);
  }

  public async Task<Event?> GetByIdAsync(EventId id, CancellationToken cancellationToken = default)
  {
    return await _context.Set<Event>()
        .Include(e => e.Participants)
        .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
  }
  public async Task<IEnumerable<Event>> GetTeamEventsAsync(TeamId teamId, CancellationToken cancellationToken = default)
  {
    return await _context.Set<Event>()
        .Include(e => e.Participants)
        .Where(e => e.TeamId == teamId)
        .ToListAsync(cancellationToken);
  }

  public void Remove(Event teamEvent)
  {
    _context.Set<Event>().Remove(teamEvent);
  }
  public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
  {
    await _context.SaveChangesAsync(cancellationToken);
  }
}