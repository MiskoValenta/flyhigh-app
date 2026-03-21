using Domain.Entities.Events;
using Domain.Value_Objects.Events;
using Domain.Value_Objects.Teams;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Repositories.Events;

public interface IEventRepository
{
  Task<Event?> GetByIdAsync(EventId id, CancellationToken cancellationToken = default);
  Task<IEnumerable<Event>> GetTeamEventsAsync(TeamId teamId, CancellationToken cancellationToken = default);
  Task AddAsync(Event teamEvent, CancellationToken cancellationToken = default);
  void Remove(Event teamEvent);
  Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
