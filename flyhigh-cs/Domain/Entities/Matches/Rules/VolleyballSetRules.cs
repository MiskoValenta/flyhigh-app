using Domain.Entities.Matches.MatchEnums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Matches.Rules;

public class VolleyballSetRules : ISetRules
{
  public bool IsWinningScore(int currentTeamScore, int opponentScore, SetType type)
  {
    int pointsToWin = type == SetType.TieBreak ? 15 : 25;

    return currentTeamScore >= pointsToWin && (currentTeamScore - opponentScore) >= 2;
  }
}
