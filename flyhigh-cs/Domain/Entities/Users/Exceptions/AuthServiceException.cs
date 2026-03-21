using Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Users.Exceptions;

public class AuthServiceException : DomainException
{
  public AuthServiceException(string message) : base(message)
  {

  }
}
public class AuthEmailException : DomainException
{
  public AuthEmailException()
    : base("Uživatel s tímto E-mailem již existuje.")
  {

  }
}

public class AuthBadCredentials : DomainException
{
  public AuthBadCredentials()
    : base("Neplatné přihlašovací údaje.")
  {

  }
}

public class AuthInvalidRefreshToken : DomainException
{
  public AuthInvalidRefreshToken()
    : base("Neplatný Refresh token.")
  {

  }
}

public class AuthExpiredRefreshToken : DomainException
{
  public AuthExpiredRefreshToken()
    : base("Refresh token vypršel.")
  {

  }
}