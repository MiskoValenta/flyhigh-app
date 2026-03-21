export enum SetSide {
    Home = "Home",
    Away = "Away"
}

export enum PlayerPosition {
    Setter = "Setter",
    OutsideHitter = "OutsideHitter",
    Opposite = "Opposite",
    MiddleBlocker = "MiddleBlocker",
    Libero = "Libero",
    DefensiveSpecialist = "DefensiveSpecialist"
}

export interface CreateMatchDto {
    homeTeamId: string;
    awayTeamId: string;
    location: string;
    scheduledAt: string;
}

export interface AssignPositionDto {
    setNumber: number;
    teamMemberId: string;
    position: PlayerPosition | number;
}

export interface AddRosterEntryDto {
    teamMemberId: string;
    teamId: string;
    jerseyNumber: number;
}

export interface CancelMatchDto {
    reason: string;
}

export interface ProposeMatchResponse {
    matchId: string;
}

export interface MatchSet {
    setNumber: number;
    type: string;
    homeScore: number;
    awayScore: number;
    isFinished: boolean;
    winner: string;
}

export interface Match {
    id: string;
    creatorId: string;
    homeTeamId: string;
    homeTeamName?: string;
    awayTeamId: string;
    awayTeamName?: string;
    location: string;
    scheduledAt: string;
    status: string;
    roster?: AddRosterEntryDto[];
    sets?: MatchSet[];
}