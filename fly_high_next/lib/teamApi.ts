import { fetchWithAuth } from './apiClient';
import { Team, TeamDetail, CreateTeamDto, UpdateTeamDto } from '@/types/team';

const TEAM_URL = '/teams';

export const getMyTeams = async (): Promise<Team[]> => {
    const res = await fetchWithAuth(`${TEAM_URL}`);
    if (!res.ok) throw new Error('Nepodařilo se načíst týmy.');
    const data = await res.json();

    return data.map((t: any) => ({
        id: t.id || t.Id,
        teamName: t.teamName || t.TeamName,
        shortName: t.shortName || t.ShortName,
        role: t.role || t.Role,
        status: t.status || t.Status
    }));
};

export const getTeamById = async (teamId: string): Promise<TeamDetail> => {
    const res = await fetchWithAuth(`${TEAM_URL}/${teamId}`);
    if (!res.ok) throw new Error('Nepodařilo se načíst detail týmu.');
    const data = await res.json();

    return {
        id: data.id || data.Id,
        teamName: data.teamName || data.TeamName || data.name || data.Name,
        shortName: data.shortName || data.ShortName || '',
        description: data.description || data.Description || '',
        currentUserRole: data.currentUserRole || data.CurrentUserRole || '',
        members: data.members || data.Members || []
    };
}
export const createTeam = async (data: CreateTeamDto): Promise<{ teamId: string }> => {
    const res = await fetchWithAuth(`${TEAM_URL}/create`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Nepodařilo se vytvořit tým.');
    }
    return res.json();
};

export const addTeamMember = async (teamId: string, userId: string, role: string | number) => {
    const res = await fetchWithAuth(`${TEAM_URL}/${teamId}/members`, {
        method: 'POST',
        body: JSON.stringify({
            targetId: userId,
            setRole: role,
            pedningStatus: "Pending"
        }),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Nepodařilo se přidat člena.');
    }

    const text = await res.text();
    return text ? JSON.parse(text) : {};
};

export const removeTeamMember = async (teamId: string, userId: string): Promise<void> => {
    const res = await fetchWithAuth(`${TEAM_URL}/${teamId}/members/${userId}`, {
        method: 'DELETE',
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Nepodařilo se odebrat člena.');
    }
};

export const changeTeamMemberRole = async (teamId: string, memberId: string, newRole: string | number) => {
    const res = await fetchWithAuth(`${TEAM_URL}/${teamId}/members/${memberId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ newRole: newRole })
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || 'Nepodařilo se změnit roli.');
    }

    const text = await res.text();
    return text ? JSON.parse(text) : {};
};

export const getPendingInvites = async (): Promise<any[]> => {
    const res = await fetchWithAuth(`${TEAM_URL}/invites/pending`, {
        method: 'GET',
    });
    if (!res.ok) {
        return [];
    }
    return res.json();
};

export const acceptTeamInvite = async (teamId: string): Promise<any> => {
    const res = await fetchWithAuth(`${TEAM_URL}/${teamId}/invites/accept`, {
        method: 'PATCH',
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || 'Nepodařilo se přijmout pozvánku.');
    }
    return res.json();
};

export const declineTeamInvite = async (teamId: string): Promise<any> => {
    const res = await fetchWithAuth(`${TEAM_URL}/${teamId}/invites/decline`, {
        method: 'PATCH',
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || 'Nepodařilo se odmítnout pozvánku.');
    }
    return res.json();
};

export const updateTeam = async (teamId: string, data: UpdateTeamDto): Promise<void> => {
    const res = await fetchWithAuth(`/teams/${teamId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Nepodařilo se aktualizovat údaje o týmu.');
    }
};

export const deleteTeam = async (teamId: string) => {
    const res = await fetchWithAuth(`/Team/${teamId}`, { method: 'DELETE' });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Nepodařilo se smazat tým.');
    }

    return true;
};