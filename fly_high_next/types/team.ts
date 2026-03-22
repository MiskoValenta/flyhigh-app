export enum TeamRole {
    Owner = "Owner",
    Coach = "Coach",
    Member = "Member"
}

export enum TeamMemberStatus {
    Pending = "Pending",
    Active = "Active",
    Declined = "Declined"
}

export interface TeamResponseDto {
    id: string;
    TeamName: string;
    ShortName: string;
    role: TeamRole;
    status: TeamMemberStatus;
}

export interface TeamMember {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string | number;
    isActive: boolean;
}

export interface TeamDetail {
    id: string;
    teamName: string;
    shortName: string;
    description?: string;
    currentUserRole: string;
    members: TeamMember[];
}

export interface Team {
    id: string;
    teamName: string;
    shortName: string;
    role?: string;
    status?: string;
    joinCode?: string;
    createdAt?: string | Date;
}

export interface CreateTeamDto {
    teamName: string;
    shortName: string;
    description?: string;

}

export interface UpdateTeamDto {
    teamName: string;
    abbreviation: string;
    description: string;
}