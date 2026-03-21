using Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Value_Objects.Events;

public record EventId(Guid Value) : StronglyTypedId(Value)
{
  public static EventId New() => new(Guid.NewGuid());
}
