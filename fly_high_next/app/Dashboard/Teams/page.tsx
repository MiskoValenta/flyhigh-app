"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMyTeams, getPendingInvites, acceptTeamInvite, declineTeamInvite } from '@/lib/teamApi';
import { Team, TeamRole } from '@/types/team';
import './Teams.css';
import { stringify } from "querystring";

export default function TeamsPage() {
    const router = useRouter();
    const [teams, setTeams] = useState<Team[]>([]);
    const [invitations, setInvitations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [myTeams, myInvitations] = await Promise.all([
                getMyTeams(),
                getPendingInvites()
            ]);
            setTeams(myTeams);
            setInvitations(myInvitations);
        } catch (err) {
            setError('Nepodařilo se načíst data o týmech.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAccept = async (teamId: string) => {
        try {
            await acceptTeamInvite(teamId);
            fetchData();
        } catch (err: any) {
            alert(err.message || 'Nepodařilo se přijmout pozvánku.');
        }
    };

    const handleReject = async (teamId: string) => {
        if (!confirm('Opravdu chcete odmítnout tuto pozvánku?')) return;
        try {
            await declineTeamInvite(teamId);
            fetchData();
        } catch (err: any) {
            alert(err.message || 'Nepodařilo se odmítnout pozvánku.');
        }
    };

    const getRoleBadge = (role: TeamRole | 'Pending' | string) => {
        switch (role) {
            case 'Owner':
                return { label: 'Majitel', className: 'role-owner' };

            case 'Coach':
                return { label: 'Trenér', className: 'role-coach' };

            case 'Pending':
                return { label: 'Pozvánka', className: 'role-coach' };

            default:
                return { label: 'Hráč', className: 'role-player' };
        }
    };

    if (isLoading) {
        return (
            <div className="teams-container">
                <div className="glass-card">
                    <p>Načítám tvé týmy...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="teams-container">
                <p className="error-alert">{error}</p>
            </div>
        );
    }

    return (
        <div className="teams-container">
            <div className="teams-header-row">
                <h1 className="dashboard-heading">Moje Týmy</h1>

                <div className="header-actions">
                    <button
                        className="btn-primary"
                        onClick={() => router.push('/Dashboard/CreateTeam')}
                    >
                        + Vytvořit tým
                    </button>
                </div>
            </div>

            {invitations.length > 0 && (
                <div className="invitations-section">
                    <h2 className="dashboard-heading section-title proposed">Nové pozvánky</h2>
                    <div className="teams-grid">
                        {invitations.map((inv) => {
                            const teamId = inv.teamId || inv.TeamId;
                            const teamName = inv.teamName || inv.TeamName;
                            const roleInfo = getRoleBadge("Pending");
                            const invitingRole = inv.invitingRole || inv.InvitingRole;

                            return (
                                <div key={`inv-${teamId}`} className="glass-card team-card unclickable-card">
                                    <div className="team-header">
                                        <h2 className="team-name">{teamName}</h2>
                                        <span className={`team-role-badge ${roleInfo.className}`}>
                                            {roleInfo.label}
                                        </span>
                                    </div>

                                    <div className="team-details">
                                        <p className="waiting-text">
                                            Byli jste pozváni do tohoto týmu jako {invitingRole}.
                                        </p>
                                    </div>

                                    <div className="invitation-actions">
                                        <button
                                            className="btn-invite btn-accept-invite"
                                            onClick={() => handleAccept(teamId)}
                                        >
                                            Přijmout
                                        </button>
                                        <button
                                            className="btn-invite btn-reject-invite"
                                            onClick={() => handleReject(teamId)}
                                        >
                                            Odmítnout
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {teams.length === 0 && invitations.length === 0 ? (
                <div className="glass-card teams-empty-state">
                    <h3>Zatím nejsi v žádném týmu</h3>
                    <p>Vytvoř si vlastní tým, nebo požádej trenéra o kód pro připojení k již existujícímu.</p>
                </div>
            ) : teams.length > 0 && (
                <div className="teams-grid">
                    {teams.map((team) => {
                        const teamId = team.id;
                        const roleInfo = getRoleBadge(team.role || 'Member');

                        return (
                            <div
                                key={teamId}
                                className="glass-card team-card"
                                onClick={() => router.push(`/Dashboard/Teams/${teamId}`)}
                            >
                                <div className="team-header">
                                    <h2 className="team-name">{team.teamName}</h2>
                                    <span className={`team-role-badge ${roleInfo.className}`}>
                                        {roleInfo.label}
                                    </span>
                                </div>

                                <div className="team-details">
                                    {team.joinCode && (
                                        <div className="detail-row">
                                            <span>Kód týmu:</span>
                                            <span className="team-code">{team.joinCode}</span>
                                        </div>
                                    )}
                                    <div className="detail-row">
                                        <span>Založeno:</span>
                                        <span>
                                            {new Date(team.createdAt || Date.now()).toLocaleDateString('cs-CZ')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}