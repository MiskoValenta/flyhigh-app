using Domain.Value_Objects.Users;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;

namespace Infrastructure.Security;

public static class ClaimsPrincipalExtensions
{
  public static Guid GetUserId(this ClaimsPrincipal user)
  {
    var userIdString = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    if (string.IsNullOrEmpty(userIdString))
    {
      throw new UnauthorizedAccessException("Uživatel není autorizován nebo token neobsahuje ID.");
    }

    return Guid.Parse(userIdString);
  }
}
