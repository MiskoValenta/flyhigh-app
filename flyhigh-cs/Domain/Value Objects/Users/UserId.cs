using Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Value_Objects.Users;

public record UserId(Guid Value) : StronglyTypedId(Value)
{
  public static UserId New() => new(Guid.NewGuid());
}