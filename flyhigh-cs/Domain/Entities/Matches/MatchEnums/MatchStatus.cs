using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Matches.MatchEnums;

public enum MatchStatus
{
  Proposed = 0,
  Accepted = 1,
  Rejected = 2,
  Scheduled = 3,
  InProgress = 4,
  Finished = 5,
  Cancelled = 6
}
