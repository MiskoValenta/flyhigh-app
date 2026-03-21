using Domain.Entities.Events;
using Domain.Value_Objects.Events;
using Domain.Value_Objects.Teams;
using Domain.Value_Objects.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Persistence.Configurations;

public class EventConfiguration : IEntityTypeConfiguration<Event>
{
  public void Configure(EntityTypeBuilder<Event> builder)
  {
    builder.HasKey(e => e.Id);
    builder.Property(e => e.Id)
           .HasConversion(id => id.Value, value => new EventId(value));

    builder.Property(e => e.TeamId)
           .HasConversion(id => id.Value, value => new TeamId(value))
           .IsRequired();

    builder.Property(e => e.CreatorId)
           .HasConversion(id => id.Value, value => new UserId(value))
           .IsRequired();

    builder.Property(e => e.Title).IsRequired().HasMaxLength(200);
    builder.Property(e => e.Description).HasMaxLength(1000);
    builder.Property(e => e.Type).HasConversion<int>();

    builder.HasMany(e => e.Participants)
           .WithOne()
           .HasForeignKey(p => p.EventId)
           .OnDelete(DeleteBehavior.Cascade);
  }
}
