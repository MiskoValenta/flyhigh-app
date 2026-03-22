"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getMatchById, addMatchPoint } from '@/lib/matchApi';
import { getCurrentUser } from '@/lib/api';
import { Match, MatchSet } from '@/types/match';
import { UserProfile } from '@/types/user';
import { IoLocation } from "react-icons/io5";
import './Live.css';

export default function LiveMatchPage() {
    const params = useParams();
    const router = useRouter();
    const matchId = params.matchId as string;

    const [match, setMatch] = useState<Match | null>(null);
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchData = async (showLoading = false) => {
        if (showLoading) setIsLoading(true);
        try {
            const user = await getCurrentUser();
            setCurrentUser(user);

            const matchData: Match = await getMatchById(matchId);
            setMatch(matchData);
        } catch (err: any) {
            setError('Nepodařilo se načíst data zápasu.');
        } finally {
            if (showLoading) setIsLoading(false);
        }
    };

    useEffect(() => {
        if (matchId) fetchData(true);
    }, [matchId]);

    useEffect(() => {
        if (!matchId) return;
        const interval = setInterval(() => {
            fetchData(false);
        }, 5000);
        return () => clearInterval(interval);
    }, [matchId]);

    const handleAddPoint = async (side: 'Home' | 'Away') => {
        if (!match || isActionLoading) return;
        setIsActionLoading(true);
        try {
            await addMatchPoint(match.id, side);
            await fetchData(false);
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsActionLoading(false);
        }
    };

    if (isLoading && !match) return <div className="live-container"><p>Načítám Live Scoreboard...</p></div>;
    if (error) return <div className="live-container"><p className="error-alert">{error}</p></div>;
    if (!match || !currentUser) return null;

    const isCreator = match.creatorId === currentUser.id;
    const matchStatus = match.status;
    const sets: MatchSet[] = match.sets || [];

    const currentSet = sets.find(s => !s.isFinished) || sets[sets.length - 1];

    return (
        <div className="live-container">
            <button className="btn-secondary" style={{ alignSelf: 'flex-start' }} onClick={() => router.push(`/Dashboard/Matches/${matchId}`)}>
                ← Zpět na detail zápasu
            </button>

            <div className="glass-card scoreboard-card">
                <div className="live-header">
                    {matchStatus === 'InProgress' && <span className="live-badge">● LIVE</span>}
                    {matchStatus === 'Finished' && <span className="event-badge badge-success">ZÁPAS UKONČEN</span>}
                    {matchStatus === 'Cancelled' && <span className="event-badge badge-danger">ZÁPAS ZRUŠEN</span>}
                    <span className="text-gray-500"> <IoLocation className="icon-left" /> {match.location}</span>
                </div>

                <div className="main-score-display">
                    <div className="team-score-block">
                        <div className="team-name-live home">{match.homeTeamName || 'Domácí'}</div>
                        <div className="score-number">{currentSet?.homeScore ?? 0}</div>

                        {isCreator && matchStatus === 'InProgress' && (
                            <button
                                className="btn-score btn-score-home"
                                onClick={() => handleAddPoint('Home')}
                                disabled={isActionLoading}
                            >
                                +1 BOD
                            </button>
                        )}
                    </div>

                    <div className="score-divider">:</div>

                    <div className="team-score-block">
                        <div className="team-name-live away">{match.awayTeamName || 'Hosté'}</div>
                        <div className="score-number">{currentSet?.awayScore ?? 0}</div>

                        {isCreator && matchStatus === 'InProgress' && (
                            <button
                                className="btn-score btn-score-away"
                                onClick={() => handleAddPoint('Away')}
                                disabled={isActionLoading}
                            >
                                +1 BOD
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {sets.length > 0 && (
                <div className="glass-card sets-history-card">
                    <h3 className="sets-title">Průběh setů</h3>
                    <div className="sets-row">
                        {sets.map((set, idx) => {
                            const isActive = !set.isFinished;
                            let winnerClass = '';
                            if (set.isFinished) {
                                winnerClass = set.winner === 'Home' ? 'set-winner-home' : 'set-winner-away';
                            }

                            return (
                                <div key={idx} className={`set-box ${isActive ? 'active-set' : ''}`}>
                                    <span className="set-label">
                                        Set {set.setNumber} {set.type === 'TieBreak' ? '(TB)' : ''}
                                    </span>
                                    <span className={`set-score ${winnerClass}`}>
                                        {set.homeScore} : {set.awayScore}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}