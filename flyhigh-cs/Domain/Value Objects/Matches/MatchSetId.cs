using Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Value_Objects.Matches;

public record MatchSetId(Guid Value) : StronglyTypedId(Value)
{
  public static MatchSetId New() => new(Guid.NewGuid());
}
