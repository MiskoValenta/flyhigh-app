using Domain.Entities.Events;
using Domain.Value_Objects.Events;
using Domain.Value_Objects.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Persistence.Configurations;

public class EventParticipantConfiguration : IEntityTypeConfiguration<EventParticipant>
{
  public void Configure(EntityTypeBuilder<EventParticipant> builder)
  {
    builder.HasKey(p => p.Id);
    builder.Property(p => p.Id)
           .HasConversion(id => id.Value, value => new EventParticipantId(value));

    builder.Property(p => p.EventId)
           .HasConversion(id => id.Value, value => new EventId(value))
           .IsRequired();

    builder.Property(p => p.UserId)
           .HasConversion(id => id.Value, value => new UserId(value))
           .IsRequired();

    builder.Property(p => p.Response).HasConversion<int>();
  }
}
