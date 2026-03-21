using Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Value_Objects.Matches;

public record MatchPlayerPositionId(Guid Value) : StronglyTypedId(Value)
{
  public static MatchPlayerPositionId New() => new(Guid.NewGuid()); 
}
