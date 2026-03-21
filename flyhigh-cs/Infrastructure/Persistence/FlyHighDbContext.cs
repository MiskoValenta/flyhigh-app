using Application.Common.Interfaces;
using Domain.Entities.Events;
using Domain.Entities.Matches;
using Domain.Entities.Teams;
using Domain.Entities.Users;
using Infrastructure.Persistence.Configurations;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Persistence;

public class FlyHighDbContext : DbContext, IUnitOfWork
{
  public FlyHighDbContext(DbContextOptions<FlyHighDbContext> options) : base(options) { }

  public DbSet<User> Users => Set<User>();
  public DbSet<Team> Teams => Set<Team>();
  public DbSet<TeamMember> TeamMembers => Set<TeamMember>();
  public DbSet<Event> Events => Set<Event>();
  public DbSet<EventParticipant> EventParticipants => Set<EventParticipant>();
  public DbSet<Match> Matches => Set<Match>();
  public DbSet<MatchRosterEntry> MatchRosterEntries => Set<MatchRosterEntry>();
  public DbSet<MatchSet> MatchSets => Set<MatchSet>();
  public DbSet<MatchPlayerPosition> MatchPlayerPositions => Set<MatchPlayerPosition>();

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.ApplyConfigurationsFromAssembly(
        typeof(FlyHighDbContext).Assembly);
    base.OnModelCreating(modelBuilder);
  }
}
