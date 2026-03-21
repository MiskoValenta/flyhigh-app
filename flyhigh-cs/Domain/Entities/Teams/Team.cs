 using Domain.Common;
using Domain.Entities.Teams.Exceptions;
using Domain.Entities.Teams.TeamEnums;
using Domain.Entities.Users;
using Domain.Value_Objects.Teams;
using Domain.Value_Objects.Users;
using System;
using System.Collections.Generic;
using System.Net.NetworkInformation;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using System.Text;

namespace Domain.Entities.Teams;

public class Team : AuditableEntity<TeamId>
{
  private readonly List<TeamMember> _members = new();
  public IReadOnlyCollection<TeamMember> Members => _members.AsReadOnly();

  public UserId OwnerId { get; private set; }
  public string TeamName { get; private set; }
  public string ShortName { get; private set; }
  public string? Description { get; private set; }

  private Team() { }

  private Team(
    TeamId id,
    UserId ownerId,
    string teamName,
    string shortName,
    string? description) : base(id)
  {
    OwnerId = ownerId;
    TeamName = teamName;
    ShortName = shortName;
    Description = description;
  }

  public static Team Create(
    UserId ownerId,
    string teamName,
    string shortName,
    string? description)
  {
    if (string.IsNullOrWhiteSpace(teamName))
      throw new TeamNameEmptyException();

    if (string.IsNullOrWhiteSpace(shortName))
      throw new TeamShortNameEmptyException();

    var newId = TeamId.New();

    var team = new Team(
      newId,
      ownerId,
      teamName,
      shortName,
      description);

    team._members.Add(TeamMember.CreateActiveOwner(ownerId, team.Id));

    return team;
  }

  public bool IsMember(UserId userId) 
  { 
    return _members.Any(m => m.UserId == userId && m.Status == TeamMemberStatus.Active);
  }

  public TeamRole? GetRole(UserId userId) 
  { 
    return _members.FirstOrDefault(m => m.UserId == userId && m.Status == TeamMemberStatus.Active)?.Role;
  }

  public bool IsCoach(UserId userId) 
  {
    return GetRole(userId) == TeamRole.Coach;
  }

  public int CoachesCount()
  {
    return _members.Count(m => m.Role == TeamRole.Coach && m.Status == TeamMemberStatus.Active);
  }

  public TeamMember GetMember(UserId userId)
  {
    var member = _members.FirstOrDefault(m => m.UserId == userId);
    if (member is null) throw new TeamMemberNotFoundException(userId.Value);
    return member;
  }

  public void InviteMember(UserId userId, TeamRole role)
  {
    var existingMember = _members.FirstOrDefault(m => m.UserId == userId);

    if (existingMember != null)
    {
      if (existingMember.Status == TeamMemberStatus.Pending)
        throw new TeamInvalidException("Uživatel už má nevyřízenou pozvánku.");

      if (existingMember.IsActive && existingMember.Status == TeamMemberStatus.Active)
        throw new TeamInvalidException("Uživatel už je aktivním členem týmu.");

      existingMember.Reinvite(role);
      return;
    }

    var member = TeamMember.Create(userId, Id, role, TeamMemberStatus.Pending);
    _members.Add(member);
    MarkAsModified();
  }

  public void AcceptInvitation(UserId userId)
  {
    var member = GetMember(userId);
    if (member.Status != TeamMemberStatus.Pending)
      throw new TeamInvalidException("Pozvánka neexistuje nebo už byla vyřízena.");

    if (member.InvitedAt.HasValue && (DateTime.UtcNow - member.InvitedAt.Value).TotalDays > 14)
      throw new TeamInvalidException("Pozvánka vypršela.");

    member.ChangeStatus(TeamMemberStatus.Active);
    MarkAsModified();
  }

  public void DeclineInvitation(UserId userId)
  {
    var member = GetMember(userId);
    if (member.Status != TeamMemberStatus.Pending)
      throw new TeamInvalidException("Pozvánka neexistuje nebo už byla vyřízena.");

    member.ChangeStatus(TeamMemberStatus.Declined);
    MarkAsModified();
  }

  public void RemoveMember(UserId userId)
  {
    var member = GetMember(userId);

    if (member.Role == TeamRole.Owner)
      throw new TeamInvalidException("Majitele týmu nelze z týmu odebrat.");

    member.Deactivate();
    MarkAsModified();
  }

  public void ChangeMemberRole(UserId userId, TeamRole newRole)
  {
    var member = GetMember(userId);
    if (member.Role == newRole) throw new InvalidOperationException("Člen už tuto roli má.");

    if (member.Role == TeamRole.Owner)
      throw new TeamInvalidException("Majiteli týmu nelze změnit roli.");

    if (member.Status != TeamMemberStatus.Active)
      throw new InvalidRoleChange();

    member.ChangeRole(newRole);
    MarkAsModified();
  }

  public void DeleteTeam()
  {
    if (_members.Count(m => m.Status == TeamMemberStatus.Active) > 1)
      throw new CannotDeleteTeamException();
    MarkAsDeleted();
  }
  public void UpdateDetails(string teamName, string shortName, string description)
  {
    TeamName = teamName;
    ShortName = shortName;
    Description = description;
  }
}

