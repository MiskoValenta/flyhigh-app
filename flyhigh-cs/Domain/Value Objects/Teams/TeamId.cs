using Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Value_Objects.Teams;

public record TeamId(Guid Value) : StronglyTypedId(Value)
{
  public static TeamId New() => new(Guid.NewGuid());
}