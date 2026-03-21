using Application.Interfaces.Users;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Security;

public class BCryptPasswordHasher : IPasswordHasher
{
  public string Hash(string password)
  {
    return BCrypt.Net.BCrypt.HashPassword(password);
  }

  public bool Verify(string password, string hash)
  {
    return BCrypt.Net.BCrypt.Verify(password, hash);
  }
}
