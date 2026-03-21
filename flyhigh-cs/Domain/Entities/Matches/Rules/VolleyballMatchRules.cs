using Domain.Entities.Matches.MatchEnums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Matches.Rules;

public class VolleyballMatchRules : IMatchRules
{
  public bool IsMatchFinished(IReadOnlyCollection<MatchSet> sets)
  {
    int homeWins = sets.Count(s => s.Winner == SetWinner.Home);
    int awayWins = sets.Count(s => s.Winner == SetWinner.Away);

    return homeWins == 3 || awayWins == 3;
  }
}
