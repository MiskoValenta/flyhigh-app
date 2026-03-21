using Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Value_Objects.Events;

public record EventParticipantId(Guid Value) : StronglyTypedId(Value)
{
  public static EventParticipantId New() => new(Guid.NewGuid());
}
