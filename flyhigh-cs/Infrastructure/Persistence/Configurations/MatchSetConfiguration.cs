using Domain.Entities.Matches;
using Domain.Value_Objects.Matches;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Persistence.Configurations;

public class MatchSetConfiguration : IEntityTypeConfiguration<MatchSet>
{
  public void Configure(EntityTypeBuilder<MatchSet> builder)
  {
    builder.ToTable("MatchSets");

    builder.HasKey(s => s.Id);
    builder.Property(s => s.Id)
        .HasConversion(id => id.Value, value => new MatchSetId(value));

    builder.Property(s => s.SetNumber).IsRequired();
    builder.Property(s => s.Type).IsRequired();
    builder.Property(s => s.HomeScore).IsRequired();
    builder.Property(s => s.AwayScore).IsRequired();
    builder.Property(s => s.IsFinished).IsRequired();
    builder.Property(s => s.Winner).IsRequired();

    builder.HasMany(s => s.PlayerPositions)
        .WithOne()
        .HasForeignKey("MatchSetId")
        .OnDelete(DeleteBehavior.Cascade);

    builder.Metadata.FindNavigation(nameof(MatchSet.PlayerPositions))!
        .SetPropertyAccessMode(PropertyAccessMode.Field);
  }
}