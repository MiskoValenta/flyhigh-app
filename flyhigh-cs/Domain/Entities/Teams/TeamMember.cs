using Domain.Entities.Teams.TeamEnums;
using Domain.Value_Objects.Teams;
using Domain.Value_Objects.Users;
using System;
using System.Collections.Generic;
using System.Text;
using Domain.Common;
using Domain.Entities.Teams.Exceptions;

namespace Domain.Entities.Teams;

public class TeamMember : AuditableEntity<TeamMemberId>
{
  public UserId UserId { get; private set; }
  public TeamId TeamId { get; private set; }
  public TeamRole Role { get; private set; }
  public bool IsActive { get; private set; } = true;
  public DateTime? LeftAt { get; private set; }
  public TeamMemberStatus Status { get; private set; }
  public DateTime? InvitedAt { get; private set; }
  public DateTime? JoinedAt { get; private set; }

  internal TeamMember(
    TeamMemberId id,
    UserId userId,
    TeamId teamId,
    TeamRole role,
    TeamMemberStatus status,
    DateTime? invitedAt,
    DateTime? joinedAt) : base(id)
  {
    UserId = userId;
    TeamId = teamId;
    Role = role;
    Status = status;
    InvitedAt = invitedAt;
    JoinedAt = joinedAt;
  }

  private TeamMember() { }

  internal static TeamMember Create(
    UserId userId,
    TeamId teamId,
    TeamRole role,
    TeamMemberStatus status)
  {
    var newId = TeamMemberId.New();

    return new TeamMember(
      newId,
      userId,
      teamId,
      role,
      status,
      DateTime.UtcNow,
      null);
  }

  internal static TeamMember CreateActiveOwner(UserId userId, TeamId teamId)
  {
    var newId = TeamMemberId.New();

    return new TeamMember(
      newId,
      userId,
      teamId,
      TeamRole.Owner,
      TeamMemberStatus.Active,
      null,
      DateTime.UtcNow);
  }

  public void ChangeRole(TeamRole newRole)
  {
    Role = newRole;
    MarkAsModified();
  }

  public void Deactivate()
  {
    IsActive = false;
    LeftAt = DateTime.UtcNow;
    MarkAsModified();
  }

  internal void ChangeStatus(TeamMemberStatus newStatus)
  {
    Status = newStatus;
    if (newStatus == TeamMemberStatus.Active)
    {
      JoinedAt = DateTime.UtcNow;
      IsActive = true;
      LeftAt = null;
    }
    MarkAsModified();
  }

  internal void Reinvite(TeamRole newRole)
  {
    Role = newRole;
    Status = TeamMemberStatus.Pending;
    InvitedAt = DateTime.UtcNow;
    MarkAsModified();
  }
}