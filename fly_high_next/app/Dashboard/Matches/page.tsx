"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMyMatches, acceptMatch, rejectMatch, cancelMatch } from '@/lib/matchApi';
import { getMyTeams } from '@/lib/teamApi';
import { Match } from '@/types/match';
import { IoLocation } from "react-icons/io5";
import './Matches.css';

export default function MatchesPage() {
    const router = useRouter();
    const [matches, setMatches] = useState<Match[]>([]);
    const [managedTeamIds, setManagedTeamIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const teams = await getMyTeams();
            const managerIds = teams
                .filter(t => t.role === 'Owner' || t.role === 'Coach')
                .map(t => t.id || (t as any).Id);
            setManagedTeamIds(managerIds);

            const matchData = await getMyMatches();
            setMatches(matchData);
        } catch (err) {
            setError('Nepodařilo se načíst data o zápasech.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAccept = async (matchId: string) => {
        try {
            await acceptMatch(matchId);
            await fetchData();
            alert('Zápas byl úspěšně přijat! (Byla vytvořena anketa pro váš tým)');
        } catch (err: any) {
            alert(err.message || 'Nepodařilo se přijmout zápas.');
        }
    };

    const handleReject = async (matchId: string) => {
        if (!confirm('Opravdu chcete tento zápas odmítnout?')) return;
        try {
            await rejectMatch(matchId);
            await fetchData();
        } catch (err: any) {
            alert(err.message || 'Nepodařilo se odmítnout zápas.');
        }
    };

    const handleCancel = async (matchId: string) => {
        if (!confirm('Opravdu chcete zrušit tento návrh zápasu?')) return;
        try {
            await cancelMatch(matchId, { reason: 'Zrušeno tvůrcem.' });
            await fetchData();
        } catch (err: any) {
            alert(err.message || 'Nepodařilo se zrušit návrh zápasu.');
        }
    };

    if (isLoading)
        return <div className="matches-container"><div className="glass-card"><p>Načítám zápasy...</p></div></div>;

    if (error)
        return <div className="matches-container"><p className="error-alert">{error}</p></div>;

    const proposedMatches = matches.filter(m => m.status === 'Proposed');
    const activeMatches = matches.filter(m => m.status !== 'Proposed' && m.status !== 'Rejected' && m.status !== 'Cancelled');

    return (
        <div className="matches-container">
            <div className="matches-header-row">
                <h1 className="dashboard-heading">Zápasy</h1>
                <button className="btn-primary" onClick={() => router.push('/Dashboard/Matches/Create')}>
                    + Nový zápas
                </button>
            </div>

            {proposedMatches.length > 0 && (
                <div className="matches-section">
                    <h2 className="section-title proposed">Nové výzvy k zápasu</h2>
                    <div className="matches-grid">
                        {proposedMatches.map(match => {
                            const canManageAway = managedTeamIds.includes(match.awayTeamId);
                            const canManageHome = managedTeamIds.includes(match.homeTeamId);

                            return (
                                <div key={match.id} className="glass-card match-card">
                                    <div className="match-header">
                                        <span className="match-date">
                                            {new Date(match.scheduledAt).toLocaleDateString('cs-CZ')} - {new Date(match.scheduledAt).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <span className="match-status-badge status-proposed">Navrženo</span>
                                    </div>

                                    <div className="match-teams">
                                        <div className="team-name team-home">{match.homeTeamName}</div>
                                        <div className="vs-text">VS</div>
                                        <div className="team-name team-away">{match.awayTeamName}</div>
                                    </div>

                                    <div className="match-location">
                                        <IoLocation className='icon-left' /> {match.location}
                                    </div>

                                    {canManageAway ? (
                                        <div className="match-actions">
                                            <button className="btn-match btn-accept-match" onClick={() => handleAccept(match.id)}>
                                                Přijmout
                                            </button>
                                            <button className="btn-match btn-reject-match" onClick={() => handleReject(match.id)}>
                                                Odmítnout
                                            </button>
                                        </div>
                                    ) : canManageHome ? (
                                        <div className="match-actions">
                                            <p className="waiting-text">Čeká se na odpověď hostů...</p>
                                            <button className="btn-match btn-reject-match" onClick={() => handleCancel(match.id)}>
                                                Zrušit návrh
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="matches-section">
                <h2 className="section-title">Domluvené zápasy</h2>
                {activeMatches.length === 0 ? (
                    <div className="glass-card matches-empty-state">
                        <p>Zatím nemáte žádné aktivní zápasy.</p>
                    </div>
                ) : (
                    <div className="matches-grid">
                        {activeMatches.map(match => (
                            <div
                                key={match.id}
                                className="glass-card match-card clickable"
                                onClick={() => router.push(`/Dashboard/Matches/${match.id}`)}
                            >
                                <div className="match-header">
                                    <span className="match-date">
                                        {new Date(match.scheduledAt).toLocaleDateString('cs-CZ')}
                                    </span>
                                    <span className={`match-status-badge status-${match.status.toLowerCase()}`}>
                                        {match.status === 'Accepted' ? 'Přijato' : match.status}
                                    </span>
                                </div>

                                <div className="match-teams">
                                    <div className="team-name">{match.homeTeamName}</div>
                                    <div className="vs-text">VS</div>
                                    <div className="team-name">{match.awayTeamName}</div>
                                </div>

                                <div className="match-location">📍 {match.location}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}