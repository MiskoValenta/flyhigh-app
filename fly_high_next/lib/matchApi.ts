import { fetchWithAuth } from './apiClient';
import {
    CreateMatchDto,
    AssignPositionDto,
    AddRosterEntryDto,
    CancelMatchDto,
    ProposeMatchResponse,
    SetSide,
    Match
} from '@/types/match';

const BASE_URL = '/matches';

export const getMatchById = async (matchId: string): Promise<any> => {
    const res = await fetchWithAuth(`${BASE_URL}/${matchId}`);
    if (!res.ok) throw new Error('Nepodařilo se načíst detail zápasu.');
    return res.json();
};

export const getMyMatches = async (): Promise<Match[]> => {
    const res = await fetchWithAuth(`${BASE_URL}`, {
        method: 'GET',
    }
    );
    if (!res.ok) {
        return [];
    }
    return res.json();
};

export const createMatch = async (data: CreateMatchDto): Promise<{ matchId: string }> => {
    const res = await fetchWithAuth(`${BASE_URL}/propose`, {
        method: 'POST',
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Nepodařilo se vytvořit zápas.');
    }
    return res.json();
};

export const proposeMatch = async (data: CreateMatchDto): Promise<ProposeMatchResponse> => {
    const res = await fetchWithAuth(`${BASE_URL}/propose`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Nepodařilo se navrhnout zápas.');
    }
    return res.json();
};

export const acceptMatch = async (matchId: string): Promise<void> => {
    const res = await fetchWithAuth(`${BASE_URL}/${matchId}/accept`, {
        method: 'POST',
    });
    if (!res.ok) throw new Error('Nepodařilo se přijmout zápas.');
};

export const rejectMatch = async (matchId: string): Promise<void> => {
    const res = await fetchWithAuth(`${BASE_URL}/${matchId}/reject`, {
        method: 'POST',
    });
    if (!res.ok) throw new Error('Nepodařilo se odmítnout zápas.');
};

export const setReferee = async (matchId: string, refereeId: string): Promise<void> => {
    const res = await fetchWithAuth(`${BASE_URL}/${matchId}/referee/${refereeId}`, {
        method: 'POST',
    });
    if (!res.ok) throw new Error('Nepodařilo se nastavit rozhodčího.');
};

export const addToRoster = async (matchId: string, data: AddRosterEntryDto): Promise<void> => {
    const res = await fetchWithAuth(`${BASE_URL}/${matchId}/roster`, {
        method: 'POST',
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Nepodařilo se přidat hráče na soupisku.');
};

export const startMatch = async (matchId: string): Promise<void> => {
    const res = await fetchWithAuth(`${BASE_URL}/${matchId}/start`, {
        method: 'POST'
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Detail chyby z backendu:", errorData);
        const errorMessage = errorData.message || errorData.Message || errorData.title || JSON.stringify(errorData);

        throw new Error(errorMessage || 'Nepodařilo se spustit zápas.');
    }
};

export const assignPosition = async (matchId: string, data: AssignPositionDto): Promise<void> => {
    const res = await fetchWithAuth(`${BASE_URL}/${matchId}/positions`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Nepodařilo se přiřadit pozici.');
    }
};

export const addMatchPoint = async (matchId: string, side: 'Home' | 'Away'): Promise<void> => {
    const res = await fetchWithAuth(`${BASE_URL}/${matchId}/point/${side}`, {
        method: 'POST'
    });
    if (!res.ok) throw new Error('Chyba při zápisu bodu.');
};

export const cancelMatch = async (matchId: string, data: CancelMatchDto): Promise<void> => {
    const res = await fetchWithAuth(`${BASE_URL}/${matchId}/cancel`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Nepodařilo se zrušit zápas.');
    }
};