using Domain.Common;
using Domain.Value_Objects.Users;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Users;

public class User : AuditableEntity<UserId>
{
  public string FirstName { get; private set; }
  public string LastName { get; private set; }
  public string Email { get; private set; }
  public string PasswordHash { get; private set; }
  public string? RefreshToken { get; private set; }
  public DateTime? RefreshTokenExpiryTime { get; private set; }

  private User() { }

  private User(
    UserId id,
    string firstName,
    string lastName,
    string email,
    string passwordHash) : base(id)
  {
    FirstName = firstName;
    LastName = lastName;
    Email = email;
    PasswordHash = passwordHash;
  }

  public static User Create(
    string firstName,
    string lastName,
    string email,
    string passwordHash)
  {
    var newId = UserId.New();

    return new User(
      newId,
      firstName,
      lastName,
      email,
      passwordHash);
  }

  public void UpdateRefreshToken(string token, DateTime expiryTime)
  {
    RefreshToken = token;
    RefreshTokenExpiryTime = expiryTime;
  }

  public void UpdatePassword(string newPassword)
  {
    PasswordHash = newPassword;
    MarkAsModified();
  }

  public void UpdateProfile(string firstName, string lastName, string email)
  {
    FirstName = firstName;
    LastName = lastName;
    Email = email.Trim().ToLower();
  }
}
