"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createMatch } from '@/lib/matchApi';
import { getMyTeams } from '@/lib/teamApi';
import { Team } from '@/types/team';
import './CreateMatch.css';

export default function CreateMatchPage() {
    const router = useRouter();
    const [managerTeams, setManagerTeams] = useState<Team[]>([]);
    const [isLoadingTeams, setIsLoadingTeams] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        homeTeamId: '',
        awayTeamId: '',
        location: '',
        scheduledAt: ''
    });

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const teams = await getMyTeams();
                const filtered = teams.filter(t => t.role === 'Owner' || t.role === 'Coach');
                setManagerTeams(filtered);

                if (filtered.length > 0) {
                    setFormData(prev => ({ ...prev, homeTeamId: filtered[0].id }));
                }
            } catch (err) {
                setError('Nepodařilo se načíst seznam vašich týmů.');
            } finally {
                setIsLoadingTeams(false);
            }
        };

        fetchTeams();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const dateIso = new Date(formData.scheduledAt).toISOString();

            await createMatch({
                homeTeamId: formData.homeTeamId,
                awayTeamId: formData.awayTeamId,
                location: formData.location,
                scheduledAt: dateIso
            });

            router.push('/Dashboard/Matches');
        } catch (err: any) {
            setError(err.message || 'Došlo k chybě při komunikaci se serverem.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingTeams) return <div className="loading-state">Načítám vaše týmy...</div>;

    return (
        <div className="dashboard-container create-match-container">
            <h1 className="dashboard-heading">Založit nový zápas</h1>
            <p className="dashboard-subtext">Vyberte svůj tým a zadejte informace o zápasu s hostujícím týmem.</p>

            {managerTeams.length === 0 ? (
                <div className="empty-state glass-card">
                    <p>Nemáte právo zakládat zápasy, protože nejste Vlastníkem nebo Trenérem u žádného týmu.</p>
                    <button className="btn-primary" onClick={() => router.push('/Dashboard/Teams')}>Zpět na týmy</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="create-match-form glass-card">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="homeTeamId">Váš tým (Domácí) *</label>
                        <select
                            id="homeTeamId"
                            name="homeTeamId"
                            value={formData.homeTeamId}
                            onChange={handleChange}
                            required
                        >
                            {managerTeams.map(team => (
                                <option key={team.id} value={team.id}>
                                    {team.teamName} ({team.shortName})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="awayTeamId">ID Hostujícího Týmu (Away) *</label>
                        <input
                            type="text"
                            id="awayTeamId"
                            name="awayTeamId"
                            value={formData.awayTeamId}
                            onChange={handleChange}
                            required
                            placeholder="Zadejte ID soupeře"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="location">Místo konání *</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            placeholder="Např. Sportovní hala Opava"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="scheduledAt">Datum a Čas *</label>
                        <input
                            type="datetime-local"
                            id="scheduledAt"
                            name="scheduledAt"
                            value={formData.scheduledAt}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => router.push('/Dashboard/Matches')}>
                            Zrušit
                        </button>
                        <button type="submit" className="btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Vytvářím...' : 'Vytvořit Zápas'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}