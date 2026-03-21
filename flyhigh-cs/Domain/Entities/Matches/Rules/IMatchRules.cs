using Domain.Value_Objects.Matches;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Matches.Rules;

public interface IMatchRules
{
  bool IsMatchFinished(IReadOnlyCollection<MatchSet> sets);
}
