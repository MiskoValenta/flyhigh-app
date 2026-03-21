using Domain.Entities.Teams;
using Domain.Value_Objects.Teams;
using Domain.Value_Objects.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Persistence.Configurations;

internal sealed class TeamMemberConfiguration
  : IEntityTypeConfiguration<TeamMember>
{
  public void Configure(EntityTypeBuilder<TeamMember> builder)
  {
    builder.ToTable("TeamMembers");

    builder.HasKey(tm => tm.Id);

    builder.Property(tm => tm.Id)
        .HasConversion(id => id.Value, value => new TeamMemberId(value));

    builder.Property(tm => tm.TeamId)
        .HasConversion(id => id.Value, value => new TeamId(value));

    builder.Property(tm => tm.UserId)
        .HasConversion(id => id.Value, value => new UserId(value));

    builder.Property(tm => tm.Role)
    .HasConversion<string>()
    .IsRequired();

    builder.Property(tm => tm.Status)
        .HasConversion<string>()
        .IsRequired();

    builder.Property(tm => tm.InvitedAt).IsRequired(false);
    builder.Property(tm => tm.JoinedAt).IsRequired(false);
  }
}
