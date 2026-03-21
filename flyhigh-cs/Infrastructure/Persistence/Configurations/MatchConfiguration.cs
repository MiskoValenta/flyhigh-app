using Domain.Entities.Matches;
using Domain.Value_Objects.Matches;
using Domain.Value_Objects.Teams;
using Domain.Value_Objects.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Persistence.Configurations;

public class MatchConfiguration : IEntityTypeConfiguration<Match>
{
  public void Configure(EntityTypeBuilder<Match> builder)
  {
    builder.ToTable("Matches");

    builder.HasKey(m => m.Id);
    builder.Property(m => m.Id)
        .HasConversion(id => id.Value, value => new MatchId(value));

    builder.Property(m => m.CreatorId)
    .HasConversion(id => id.Value, value => new UserId(value))
    .IsRequired();

    builder.Property(m => m.HomeTeamId)
        .HasConversion(id => id.Value, value => new TeamId(value))
        .IsRequired();

    builder.Property(m => m.AwayTeamId)
        .HasConversion(id => id.Value, value => new TeamId(value))
        .IsRequired();

    builder.Property(m => m.RefereeId)
        .HasConversion(
            id => id.Value,
            value => new UserId(value)
        );

    builder.Property(m => m.Location).IsRequired().HasMaxLength(255);
    builder.Property(m => m.ScheduledAt).IsRequired();
    builder.Property(m => m.Status).IsRequired();
    builder.Property(m => m.Notes).HasMaxLength(1000);

    builder.HasMany(m => m.Sets)
        .WithOne()
        .HasForeignKey("MatchId")
        .OnDelete(DeleteBehavior.Cascade);

    builder.Metadata.FindNavigation(nameof(Match.Sets))!
        .SetPropertyAccessMode(PropertyAccessMode.Field);

    builder.HasMany(m => m.Roster)
        .WithOne()
        .HasForeignKey("MatchId")
        .OnDelete(DeleteBehavior.Cascade);

    builder.Property(m => m.WinnerId)
    .HasConversion(
        id => id == null ? null : (Guid?)id.Value,
        value => value.HasValue ? new TeamId(value.Value) : null)
    .IsRequired(false);

    builder.Metadata.FindNavigation(nameof(Match.Roster))!
        .SetPropertyAccessMode(PropertyAccessMode.Field);

    builder.HasQueryFilter(m => !m.isDeleted);
  }
}