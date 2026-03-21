using Domain.Entities.Matches.MatchEnums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Matches.Rules;

public interface ISetRules
{
  bool IsWinningScore(int currentTeamScore, int opponentScore, SetType type);
}
