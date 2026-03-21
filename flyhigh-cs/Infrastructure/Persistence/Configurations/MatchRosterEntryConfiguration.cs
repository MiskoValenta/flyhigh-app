using Domain.Entities.Matches;
using Domain.Value_Objects.Matches;
using Domain.Value_Objects.Teams;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Persistence.Configurations;

public class MatchRosterEntryConfiguration : IEntityTypeConfiguration<MatchRosterEntry>
{
  public void Configure(EntityTypeBuilder<MatchRosterEntry> builder)
  {
    builder.ToTable("MatchRosterEntries");

    builder.HasKey(r => r.Id);
    builder.Property(r => r.Id)
        .HasConversion(id => id.Value, value => new MatchRosterEntryId(value));

    builder.Property(r => r.MatchId)
        .HasConversion(id => id.Value, value => new MatchId(value))
        .IsRequired();

    builder.Property(r => r.TeamMemberId)
        .HasConversion(id => id.Value, value => new TeamMemberId(value))
        .IsRequired();

    builder.Property(r => r.TeamId)
        .HasConversion(id => id.Value, value => new TeamId(value))
        .IsRequired();

    builder.Property(r => r.JerseyNumber).IsRequired();
  }
}
