using Domain.Entities.Matches;
using Domain.Value_Objects.Matches;
using Domain.Value_Objects.Teams;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Persistence.Configurations;

public class MatchPlayerPositionConfiguration : IEntityTypeConfiguration<MatchPlayerPosition>
{
  public void Configure(EntityTypeBuilder<MatchPlayerPosition> builder)
  {
    builder.ToTable("MatchPlayerPositions");

    builder.HasKey(p => p.Id);
    builder.Property(p => p.Id)
        .HasConversion(id => id.Value, value => new MatchPlayerPositionId(value));

    builder.Property(p => p.TeamMemberId)
        .HasConversion(id => id.Value, value => new TeamMemberId(value))
        .IsRequired();

    builder.Property(p => p.Position).IsRequired();
  }
}
