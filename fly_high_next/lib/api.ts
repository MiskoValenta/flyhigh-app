import { fetchWithAuth } from './apiClient';
import { UserProfile } from '@/types/user';

const isClient = typeof window !== 'undefined';

export const BASE_URL = isClient
    ? '/api'
    : `${process.env.INTERNAL_BACKEND_URL || 'http://flyhigh_backend:5000'}/api`;

export const login = async (credentials: any) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Chyba při přihlášení. Zkontrolujte údaje.");
    }

    return res.json().catch(() => ({}));
};

export const logout = async () => {
    const res = await fetchWithAuth('/Auth/logout', { method: 'POST' });

    if (!res.ok) {
        throw new Error("Nepodařilo se odhlásit ze serveru.");
    }

    return res;
};

export const register = async (userData: any) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userData),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Registrace selhala. Tento email už pravděpodobně někdo využívá.");
    }

    return res.json().catch(() => ({}));
};

export const getCurrentUser = async (): Promise<UserProfile> => {
    const res = await fetchWithAuth('/auth/me', {
        method: 'GET'
    });

    if (!res.ok) {
        throw new Error('Nepodařilo se načíst profil uživatele.');
    }

    return res.json();
};

export const isManagerRole = (role: any): boolean => {
    if (role === null || role === undefined)
        return false;

    const r = role.toString().toLowerCase();

    return r === 'owner' || r === '0' || r === 'coach' || r === '1';
};

export const forgotPassword = async (email: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Nepodařilo se odeslat žádost o obnovu hesla.');
    }
};

export const updateProfile = async (data: { firstName: string; lastName: string; email: string }): Promise<void> => {
    const res = await fetchWithAuth('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Nepodařilo se aktualizovat profil.');
    }
};

export const changePassword = async (data: { oldPassword: string; newPassword: string }): Promise<void> => {
    const res = await fetchWithAuth('/users/change-password', {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Nepodařilo se změnit heslo. Zkontrolujte původní heslo.');
    }
};