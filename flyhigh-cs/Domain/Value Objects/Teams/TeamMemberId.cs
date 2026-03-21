using Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Value_Objects.Teams;

public record TeamMemberId(Guid Value) : StronglyTypedId(Value)
{
  public static TeamMemberId New() => new(Guid.NewGuid());
}
