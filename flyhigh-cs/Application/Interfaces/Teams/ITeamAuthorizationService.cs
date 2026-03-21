using Domain.Entities.Matches;
using Domain.Entities.Teams;
using Domain.Entities.Teams.TeamEnums;
using Domain.Value_Objects.Users;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Interfaces.Teams;

public interface ITeamAuthorizationService
{
  Task<bool> HasRoleInTeamAsync(Guid userId, Guid teamId, params TeamRole[] requiredRoles);
}
