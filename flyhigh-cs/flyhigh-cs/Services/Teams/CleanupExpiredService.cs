using Domain.Entities.Teams;
using Domain.Entities.Teams.TeamEnums;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace API.Services.Teams;

public class CleanupExpiredInvitesService : BackgroundService
{
  private readonly IServiceProvider _serviceProvider;
  private readonly ILogger<CleanupExpiredInvitesService> _logger;

  public CleanupExpiredInvitesService(IServiceProvider serviceProvider, ILogger<CleanupExpiredInvitesService> logger)
  {
    _serviceProvider = serviceProvider;
    _logger = logger;
  }

  protected override async Task ExecuteAsync(CancellationToken stoppingToken)
  {
    _logger.LogInformation("Úloha na čištění starých pozvánek byla spuštěna.");

    while (!stoppingToken.IsCancellationRequested)
    {
      try
      {
        using var scope = _serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<FlyHighDbContext>();

        var expirationDate = DateTime.UtcNow.AddDays(-14);

        var expiredInvites = await dbContext.Set<TeamMember>()
            .Where(tm => (tm.Status == TeamMemberStatus.Pending || tm.Status == TeamMemberStatus.Declined)
                      && tm.InvitedAt <= expirationDate
                      && tm.JoinedAt == null)
            .ToListAsync(stoppingToken);

        if (expiredInvites.Any())
        {
          dbContext.Set<TeamMember>().RemoveRange(expiredInvites);
          await dbContext.SaveChangesAsync(stoppingToken);
          _logger.LogInformation($"Úspěšně smazáno {expiredInvites.Count} expirovaných pozvánek.");
        }
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Chyba při čištění pozvánek.");
      }

      await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
    }
  }
}