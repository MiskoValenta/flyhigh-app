using Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Teams.Exceptions;

public class TeamInvalidException : DomainException
{
  public TeamInvalidException(string message) : base(message)
  {
  }
}

public class TeamNameEmptyException : DomainException
{
  public TeamNameEmptyException()
      : base("Název týmu nesmí být prázdný.")
  {
  }
}

public class MemberPendingInvitation : DomainException
{
  public MemberPendingInvitation()
      : base("Název týmu nesmí být prázdný.")
  {
  }
}

public class TeamShortNameEmptyException : DomainException
{
  public TeamShortNameEmptyException()
      : base("Zkratka týmu nesmí být prázdná.")
  {
  }
}

public class TeamMemberNotFoundException : DomainException
{
  public TeamMemberNotFoundException(Guid userId)
      : base($"Uživatel s ID {userId} není členem tohoto týmu.")
  {
  }
}

public class TeamMemberAlreadyExistsException : DomainException
{
  public TeamMemberAlreadyExistsException(Guid userId)
      : base($"Hráč s ID {userId} už v tomto týmu je!")
  {
  }
}

public class CannotRemoveLastCoachException : DomainException
{
  public CannotRemoveLastCoachException()
      : base("Nelze odebrat posledního trenéra. Tým musí mít alespoň jednoho.")
  {
  }
}

public class CannotDowngradeLastCoachException : DomainException
{
  public CannotDowngradeLastCoachException()
      : base("Tým musí mít vždy alespoň jednoho trenéra. Roli tohoto uživatele nelze změnit na hráče.")
  {
  }
}

public class MemberAlreadyHasRoleException : DomainException
{
  public MemberAlreadyHasRoleException()
      : base("Tento člen už tuto roli má.")
  {
  }
}

public class CannotDeleteTeamException : DomainException
{
  public CannotDeleteTeamException()
    : base("Tým nemůže být smazán, jestli se v něm nachází další uživatelé.")
  {
  }
}

public class InvalidRoleChange : DomainException
{
  public InvalidRoleChange()
    : base("Hráč není v týmu")
  {
  }
}
