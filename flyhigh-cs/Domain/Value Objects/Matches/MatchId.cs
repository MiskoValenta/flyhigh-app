using Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Value_Objects.Matches;

public record MatchId(Guid Value) : StronglyTypedId(Value)
{
  public static MatchId New() => new(Guid.NewGuid());
}
