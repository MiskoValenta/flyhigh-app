using Domain.Entities.Teams;
using Domain.Value_Objects.Teams;
using Domain.Value_Objects.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Persistence.Configurations;

internal sealed class TeamConfiguration
  : IEntityTypeConfiguration<Team>
{
  public void Configure(EntityTypeBuilder<Team> builder)
  {
    builder.ToTable("Teams");

    builder.HasKey(t => t.Id);

    builder.Property(t => t.Id)
        .HasConversion(id => id.Value, value => new TeamId(value));

    builder.Property(t => t.OwnerId)
        .HasConversion(id => id.Value, value => new UserId(value));

    builder.Property(t => t.TeamName)
      .IsRequired()
      .HasMaxLength(100);
    
    builder.Property(t => t.ShortName)
      .IsRequired()
      .HasMaxLength(10);
    
    builder.Property(t => t.Description)
      .HasMaxLength(500);

    builder.Metadata.FindNavigation(nameof(Team.Members))!
        .SetPropertyAccessMode(PropertyAccessMode.Field);

    builder.HasQueryFilter(t => !t.isDeleted);
  }
}

