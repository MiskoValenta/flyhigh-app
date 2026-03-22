"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getMatchById, addToRoster, startMatch, cancelMatch } from '@/lib/matchApi';
import { getTeamById, getMyTeams } from '@/lib/teamApi';
import { getCurrentUser } from '@/lib/api';
import { UserProfile } from '@/types/user';
import { Match, AddRosterEntryDto } from '@/types/match';
import { TeamDetail } from "@/types/team";
import { IoLocation, IoFlash, IoEye } from "react-icons/io5";
import './MatchDetail.css';

export default function MatchDetailPage() {
    const params = useParams();
    const router = useRouter();
    const matchId = params.matchId as string;

    const [match, setMatch] = useState<Match | null>(null);
    const [homeTeam, setHomeTeam] = useState<TeamDetail | null>(null);
    const [awayTeam, setAwayTeam] = useState<TeamDetail | null>(null);
    const [managedTeamIds, setManagedTeamIds] = useState<string[]>([]);

    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [homeMemberId, setHomeMemberId] = useState('');
    const [homeJersey, setHomeJersey] = useState('');
    const [awayMemberId, setAwayMemberId] = useState('');
    const [awayJersey, setAwayJersey] = useState('');

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const user = await getCurrentUser();
            setCurrentUser(user);

            const myTeams = await getMyTeams();
            const managers = myTeams.filter(t => t.role === 'Owner' || t.role === 'Coach').map(t => t.id);
            setManagedTeamIds(managers);

            const matchData: Match = await getMatchById(matchId);
            setMatch(matchData);

            if (matchData) {
                const homeT = await getTeamById(matchData.homeTeamId);
                const awayT = await getTeamById(matchData.awayTeamId);
                setHomeTeam(homeT);
                setAwayTeam(awayT);
            }
        } catch (err: any) {
            setError('Nepodařilo se načíst detail zápasu.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (matchId) fetchData();
    }, [matchId]);

    const handleAddHomeRoster = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!match) return;

        const payload: AddRosterEntryDto = {
            teamId: match.homeTeamId,
            teamMemberId: homeMemberId,
            jerseyNumber: parseInt(homeJersey)
        };

        try {
            await addToRoster(matchId, payload);
            setHomeMemberId(''); setHomeJersey('');
            fetchData();
        } catch (err: any) { alert(err.message); }
    };

    const handleAddAwayRoster = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!match) return;

        const payload: AddRosterEntryDto = {
            teamId: match.awayTeamId,
            teamMemberId: awayMemberId,
            jerseyNumber: parseInt(awayJersey)
        };

        try {
            await addToRoster(matchId, payload);
            setAwayMemberId(''); setAwayJersey('');
            fetchData();
        } catch (err: any) { alert(err.message); }
    };

    const handleStartMatch = async () => {
        if (!confirm('Opravdu chcete zahájit zápas? Od této chvíle nelze měnit soupisky.')) return;
        try {
            await startMatch(matchId);
            router.push(`/Dashboard/Matches/${matchId}/Live`);
        } catch (err: any) { alert(err.message); }
    };

    const handleCancelMatch = async () => {
        const reasonText = prompt("Zadejte důvod předčasného ukončení nebo zrušení zápasu:");
        if (!reasonText) return;
        try {
            await cancelMatch(matchId, { reason: reasonText });
            fetchData();
        } catch (err: any) { alert(err.message); }
    };

    if (isLoading)
        return <div className="match-detail-container"><p>Načítám detail zápasu...</p></div>;

    if (error)
        return <div className="match-detail-container"><p className="error-alert">{error}</p></div>;

    if (!match || !currentUser)
        return null;

    const isHomeManager = managedTeamIds.includes(match.homeTeamId);
    const isAwayManager = managedTeamIds.includes(match.awayTeamId);

    const isCreator = match.creatorId === currentUser.id;

    const roster: AddRosterEntryDto[] = match.roster || [];
    const homeRoster = roster.filter(r => r.teamId === match.homeTeamId);
    const awayRoster = roster.filter(r => r.teamId === match.awayTeamId);

    const getPlayerName = (id: string, team: any) => {
        const member = team.members.find((m: any) => m.userId === id);
        return `${member.firstName} ${member.lastName}`;
    }

    return (
        <div className="match-detail-container">
            <div className="glass-card match-header-card">
                <div className="match-status-row">
                    <span><IoLocation className='icon-left' /> {match.location}</span>
                    <span className="match-date">
                        {new Date(match.scheduledAt).toLocaleString('cs-CZ')}
                    </span>
                    <span className="event-badge badge-match">{match.status}</span>
                </div>

                <div className="match-teams-huge">
                    <div className="team-name-huge home">{match.homeTeamName || 'Domácí'}</div>
                    <div className="vs-badge">VS</div>
                    <div className="team-name-huge away">{match.awayTeamName || 'Hosté'}</div>
                </div>

                {isCreator && (
                    <div className="creator-actions-row flex-wrap-center">
                        {match.status === 'Accepted' && (
                            <button className="btn-primary start-match-btn" onClick={handleStartMatch}>
                                Zahájit zápas (Odpískat začátek)
                            </button>
                        )}

                        {match.status === 'InProgress' && (
                            <button className="btn-primary btn-success manage-match-btn"
                                onClick={() => router.push(`/Dashboard/Matches/${match.id}/Live`)}>
                                <IoFlash className='icon-left' /> Spravovat probíhající zápas
                            </button>
                        )}

                        {(match.status === 'Accepted' || match.status === 'Proposed' || match.status === 'InProgress') && (
                            <button className="btn-danger manage-match-btn" onClick={handleCancelMatch}>
                                Zrušit / Ukončit předčasně
                            </button>
                        )}
                    </div>
                )}

                {!isCreator && match.status === 'InProgress' && (
                    <button className="btn-primary manage-match-btn"
                        onClick={() => router.push(`/Dashboard/Matches/${match.id}/Live`)}>
                        <IoEye className="icon-left" /> Sledovat zápas živě
                    </button>
                )}
            </div>

            <div className="rosters-grid">
                <div className={`glass-card roster-card ${isHomeManager ? 'active-home' : ''}`}>
                    <div className="roster-card-header">
                        <h3 className="roster-title-home">Soupiska: Domácí</h3>
                    </div>
                    <div className="roster-list">
                        {homeRoster.length === 0 ? <p className="waiting-text">Zatím nebyli nominováni hráči.</p> :
                            homeRoster.map((player, idx) => (
                                <div key={idx} className="roster-item">
                                    <span className="player-name">{getPlayerName(player.teamMemberId, homeTeam)}</span>
                                    <span className="jersey-number">{player.jerseyNumber}</span>
                                </div>
                            ))
                        }
                    </div>

                    {isHomeManager && (match.status === 'Proposed' || match.status === 'Accepted') && homeTeam && (
                        <form className="add-roster-form" onSubmit={handleAddHomeRoster}>
                            <select className="roster-select" value={homeMemberId} onChange={(e) => setHomeMemberId(e.target.value)} required>
                                <option value="" disabled>Vyber hráče z týmu</option>
                                {homeTeam.members?.map((m: any) => (
                                    <option key={m.userId} value={m.userId}>{m.firstName} {m.lastName}</option>
                                ))}
                            </select>
                            <input className="roster-input" type="number" placeholder="Dres" min="1" max="99"
                                value={homeJersey} onChange={(e) => setHomeJersey(e.target.value)} required />
                            <button type="submit" className="btn-primary">+</button>
                        </form>
                    )}
                </div>

                <div className={`glass-card roster-card ${isAwayManager ? 'active-away' : ''}`}>
                    <div className="roster-card-header">
                        <h3 className="roster-title-away">Soupiska: Hosté</h3>
                    </div>
                    <div className="roster-list">
                        {awayRoster.length === 0 ? <p className="waiting-text">Zatím nebyli nominováni hráči.</p> :
                            awayRoster.map((player, idx) => (
                                <div key={idx} className="roster-item">
                                    <span className="player-name">{getPlayerName(player.teamMemberId, awayTeam)}</span>
                                    <span className="jersey-number away-jersey">{player.jerseyNumber}</span>
                                </div>
                            ))
                        }
                    </div>

                    {isAwayManager && (match.status === 'Proposed' || match.status === 'Accepted') && awayTeam && (
                        <form className="add-roster-form" onSubmit={handleAddAwayRoster}>
                            <select className="roster-select" value={awayMemberId} onChange={(e) => setAwayMemberId(e.target.value)} required>
                                <option value="" disabled>Vyber hráče z týmu</option>
                                {awayTeam.members?.map((m: any) => (
                                    <option key={m.userId} value={m.userId}>{m.firstName} {m.lastName}</option>
                                ))}
                            </select>
                            <input className="roster-input" type="number" placeholder="Dres" min="1" max="99"
                                value={awayJersey} onChange={(e) => setAwayJersey(e.target.value)} required />
                            <button type="submit" className="btn-primary btn-away-add">+</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}