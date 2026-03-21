"use client";

import React, { useEffect, useState } from 'react';
import { getMyTeams } from '@/lib/teamApi';
import { getTeamEvents } from '@/lib/eventApi';
import { getCurrentUser } from '@/lib/api';
import { UserProfile } from '@/types/user';
import { TeamEvent } from '@/types/event';
import DashboardEvents from '@/components/DashboardEvents/DashboardEvents';
import './Dashboard.css';

export default function DashboardPage() {
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const [teamsCount, setTeamsCount] = useState<number>(0);
    const [playedMatchesCount, setPlayedMatchesCount] = useState<number>(0);
    const [upcomingEventsCount, setUpcomingEventsCount] = useState<number>(0);
    const [userTeamIds, setUserTeamIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const user = await getCurrentUser();
                setCurrentUser(user);

                const myTeams = await getMyTeams();
                setTeamsCount(myTeams.length);

                const teamIds = myTeams.map(team => team.id);
                setUserTeamIds(teamIds);

                if (teamIds.length > 0) {
                    const allEventsPromises = teamIds.map(id => getTeamEvents(id));
                    const allEventsArrays = await Promise.all(allEventsPromises);
                    const combinedEvents = allEventsArrays.flat();

                    const now = new Date();
                    const upcomingEvents = combinedEvents.filter((evt: TeamEvent) =>
                        evt.eventDate && new Date(evt.eventDate) > now
                    );

                    setUpcomingEventsCount(upcomingEvents.length);
                }
            } catch (error) {
                console.error('Chyba při načítání dat pro dashboard:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const copyToClipboard = async () => {
        if (!currentUser?.id) {
            alert('ID uživatele se ještě nenačetlo nebo neexistuje.');
            return;
        }

        try {
            window.focus();
            await navigator.clipboard.writeText(currentUser.id);
            alert('Tvé ID bylo úspěšně zkopírováno do schránky!');
        } catch (err) {
            console.error('Nepodařilo se kopírovat:', err);
            const textArea = document.createElement("textarea");
            textArea.value = currentUser.id;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                alert('Tvé ID bylo zkopírováno (záložní metoda).');
            } catch (copyErr) {
                alert('Chyba při kopírování. Označ ID ručně.');
            }
            document.body.removeChild(textArea);
        }
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-heading">Přehled</h1>
            <p className="dashboard-subtext">
                {isLoading
                    ? "Načítám profil a data..."
                    : `Vítejte, ${currentUser?.firstName} ${currentUser?.lastName}! Zde je tvůj rychlý přehled.`}
            </p>
            {currentUser?.id && (
                <div className="user-id-card glass-card">
                    <div className="user-id-text-container">
                        <h3 className="user-id-heading">Tvoje uživatelské ID</h3>
                        <p className="user-id-subtext">Dej toto ID svému trenérovi, aby tě mohl přidat do týmu.</p>
                    </div>
                    <div className="user-id-actions">
                        <code className="user-id-code">
                            {currentUser.id}
                        </code>
                        <button className="btn-primary btn-copy" onClick={copyToClipboard}>
                            Kopírovat
                        </button>
                    </div>
                </div>
            )}

            <div className="stats-grid">
                <div className="stat-card glass-card">
                    <div className="stat-value">{isLoading ? '...' : teamsCount}</div>
                    <div className="stat-label">Moje Týmy</div>
                </div>
                <div className="stat-card glass-card">
                    <div className="stat-value">{isLoading ? '...' : playedMatchesCount}</div>
                    <div className="stat-label">Odehrané zápasy</div>
                </div>
                <div className="stat-card glass-card">
                    <div className="stat-value">{isLoading ? '...' : upcomingEventsCount}</div>
                    <div className="stat-label">Nadcházející události</div>
                </div>
            </div>

            <div className="dashboard-info glass-card dashboard-section">
                <h2>Rychlá Akce</h2>
                <div className="action-buttons">
                    <a href="/Dashboard/CreateTeam" className="btn-primary">Vytvořit Tým</a>
                    <a href="/Dashboard/Matches/Create" className="btn-secondary">Naplánovat Zápas</a>
                    <a href="/Dashboard/Events/Create" className="btn-primary btn-success">Vytvořit Událost</a>
                </div>
            </div>

            {!isLoading && currentUser?.id && userTeamIds.length > 0 && (
                <div className="dashboard-section">
                    <DashboardEvents teamIds={userTeamIds} currentUserId={currentUser.id} />
                </div>
            )}
        </div>
    );
}