"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTeam } from '@/lib/teamApi';
import './CreateTeam.css';

export default function CreateTeamPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        teamName: '',
        shortName: '',
        description: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await createTeam(formData);
            router.push('/Dashboard/Teams');

        } catch (err: any) {
            setError(err.message || 'Došlo k chybě při komunikaci se serverem.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="dashboard-container create-team-container">
            <h1 className="dashboard-heading">Vytvořit Nový Tým</h1>
            <p className="dashboard-subtext">Založte si svůj vlastní tým a pozvěte spoluhráče.</p>

            <form onSubmit={handleSubmit} className="create-team-form glass-card">
                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label htmlFor="teamName">Název Týmu *</label>
                    <input
                        type="text"
                        id="teamName"
                        name="teamName"
                        value={formData.teamName}
                        onChange={handleChange}
                        required
                        placeholder="Zadejte název týmu"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="shortName">Zkratka Týmu (max 5 znaků) *</label>
                    <input
                        type="text"
                        id="shortName"
                        name="shortName"
                        value={formData.shortName}
                        onChange={handleChange}
                        maxLength={5}
                        required
                        placeholder="Zkratka (např. FLY)"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Popis (volitelné)</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Napište něco o svém týmu..."
                    />
                </div>

                <div className="form-actions">
                    <button type="button" className="btn-secondary" onClick={() => router.push('/Dashboard/Teams')}>
                        Zrušit
                    </button>
                    <button type="submit" className="btn-primary" disabled={isLoading}>
                        {isLoading ? 'Vytvářím...' : 'Vytvořit Tým'}
                    </button>
                </div>
            </form>
        </div>
    );
}