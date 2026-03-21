import { fetchWithAuth } from './apiClient';
import { TeamEvent, EventResponse } from '@/types/event';

const BASE_URL = '/events';

export const eventApi = {
    createEvent: async (data: any) => {
        const res = await fetchWithAuth(`${BASE_URL}`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'Nepodařilo se vytvořit událost.');
        }
        const text = await res.text();
        return text ? JSON.parse(text) : {};
    }
}

export const getTeamEvents = async (teamId: string): Promise<TeamEvent[]> => {
    const res = await fetchWithAuth(`${BASE_URL}/team/${teamId}`, {
        method: 'GET',
    });
    if (!res.ok) {
        return [];
    }
    return res.json();
}

export const getEventById = async (eventId: string): Promise<TeamEvent> => {
    const res = await fetchWithAuth(`${BASE_URL}/${eventId}`, {
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error('Nepodařilo se načíst detail události.');
    }
    return res.json();
}

export const respondToEvent = async (eventId: string, response: EventResponse | string): Promise<void> => {
    const res = await fetchWithAuth(`${BASE_URL}/${eventId}/respond`, {
        method: 'POST',
        body: JSON.stringify({ response })
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Nepodařilo se uložit odpověď.');
    }
};

export const deleteEvent = async (eventId: string): Promise<void> => {
    const res = await fetchWithAuth(`${BASE_URL}/${eventId}`, {
        method: 'DELETE',
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Nepodařilo se smazat událost.');
    }
};