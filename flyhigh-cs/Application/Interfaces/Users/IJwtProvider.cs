using Domain.Entities.Users;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Interfaces.Users;

public interface IJwtProvider
{
  string GenerateAccessToken(User user);
  string GenerateRefreshToken();
}
