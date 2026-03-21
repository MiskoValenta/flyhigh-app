using Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Events.EventExceptions;

public class EventInvalidException : DomainException
{
  public EventInvalidException(string message) : base(message)
  {
  }
}
