using Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Matches.Exceptions;

public class MatchInvalidException : DomainException
{
  public MatchInvalidException(string message) : base(message)
  {
  }
}