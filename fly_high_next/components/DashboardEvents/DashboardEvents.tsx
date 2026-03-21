"use client";

import React, { useEffect, useState } from 'react';
import { getTeamEvents, respondToEvent, deleteEvent } from '@/lib/eventApi';
import { TeamEvent, EventResponse, EventType } from '@/types/event';
import './DashboardEvents.css';

interface DashboardEventsProps {
    teamIds: string[];
    currentUserId?: string;
}

export default function DashboardEvents({ teamIds, currentUserId }: DashboardEventsProps) {
    const [events, setEvents] = useState<TeamEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            if (!teamIds || teamIds.length === 0) {
                setLoading(false);
                return;
            }
            try {
                const allEventsPromises = teamIds.map(id => getTeamEvents(id));
                const allEventsArrays = await Promise.all(allEventsPromises);

                const combined = allEventsArrays.flat().sort((a: TeamEvent, b: TeamEvent) => {
                    const dateA = a.eventDate ? new Date(a.eventDate).getTime() : 0;
                    const dateB = b.eventDate ? new Date(b.eventDate).getTime() : 0;
                    return dateA - dateB;
                });

                setEvents(combined);
            } catch (err: any) {
                setError('Nepodařilo se načíst události.');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [teamIds]);

    const handleRespond = async (eventId: string, response: EventResponse | string) => {
        try {
            await respondToEvent(eventId, response);
            setEvents(prev => prev.map(ev => {
                if (ev.id === eventId) {
                    let newAccepted = ev.acceptedCount || 0;
                    let newDeclined = ev.declinedCount || 0;

                    if (ev.myResponse === EventResponse.Accepted) newAccepted--;
                    if (ev.myResponse === EventResponse.Declined) newDeclined--;

                    if (response === EventResponse.Accepted) newAccepted++;
                    if (response === EventResponse.Declined) newDeclined++;

                    return {
                        ...ev,
                        myResponse: response,
                        acceptedCount: newAccepted,
                        declinedCount: newDeclined
                    };
                }
                return ev;
            }));
        } catch (err: any) {
            alert(err.message || 'Odpověď se nepodařilo uložit.');
        }
    };

    const handleDelete = async (eventId: string) => {
        if (!confirm('Opravdu chcete tuto událost nenávratně smazat?')) return;
        try {
            await deleteEvent(eventId);
            setEvents(prev => prev.filter(ev => ev.id !== eventId));
        } catch (err: any) {
            alert(err.message || 'Událost se nepodařilo smazat.');
        }
    };

    if (loading) return <div className="events-status-box">Načítám události...</div>;
    if (error) return <div className="events-status-box error">{error}</div>;
    if (events.length === 0) return <div className="events-status-box">Zatím nebyly naplánovány žádné události.</div>;

    return (
        <div className="dashboard-events-container">
            {events.map((ev) => {
                let typeLabel = "Oznámení";
                let typeClass = "badge-announcement";

                if (ev.type === EventType.Match || ev.type === 'Match') {
                    typeLabel = "Zápas"; typeClass = "badge-match";
                } else if (ev.type === EventType.Poll || ev.type === 'Poll') {
                    typeLabel = "Anketa"; typeClass = "badge-poll";
                }

                const isVoted = ev.myResponse === EventResponse.Accepted || ev.myResponse === EventResponse.Declined;
                const isCreator = currentUserId && (ev.creatorId === currentUserId || (ev as any).CreatorId === currentUserId);

                const isAnnouncement = ev.type === EventType.Announcement || ev.type === 'Announcement';
                const canVote = !isAnnouncement;

                return (
                    <div key={ev.id} className="glass-card event-card">
                        <div className="event-card-header">
                            <div className="event-title-row">
                                <h3 className="event-title">{ev.title}</h3>
                                <span className={`event-badge ${typeClass}`}>
                                    {typeLabel}
                                </span>
                            </div>

                            <div className="event-header-right">
                                {ev.eventDate && (
                                    <div className="event-date">
                                        {new Date(ev.eventDate).toLocaleString('cs-CZ', {
                                            day: '2-digit', month: '2-digit', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </div>
                                )}

                                {isCreator && (
                                    <button
                                        className="btn-delete-event"
                                        onClick={() => handleDelete(ev.id)}
                                        title="Smazat událost"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>

                        {ev.description && <p className="event-description">{ev.description}</p>}
                        {ev.location && <div className="event-location">📍 {ev.location}</div>}

                        {canVote && (
                            <div className="event-footer">
                                <div className="event-actions">
                                    <button
                                        className={`btn-event btn-accept ${ev.myResponse === EventResponse.Accepted ? 'active' : ''}`}
                                        onClick={() => handleRespond(ev.id, EventResponse.Accepted)}
                                    >
                                        Ano
                                    </button>
                                    <button
                                        className={`btn-event btn-decline ${ev.myResponse === EventResponse.Declined ? 'active' : ''}`}
                                        onClick={() => handleRespond(ev.id, EventResponse.Declined)}
                                    >
                                        Ne
                                    </button>
                                </div>

                                {isVoted && (
                                    <div className="event-votes">
                                        <div className="vote-count vote-yes">
                                            <span className="vote-dot yes"></span> {ev.acceptedCount || 0} Ano
                                        </div>
                                        <div className="vote-count vote-no">
                                            <span className="vote-dot no"></span> {ev.declinedCount || 0} Ne
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}