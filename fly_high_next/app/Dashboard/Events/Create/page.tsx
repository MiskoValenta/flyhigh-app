"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMyTeams } from '@/lib/teamApi';
import { eventApi } from '@/lib/eventApi';
import { getCurrentUser, isManagerRole } from '@/lib/api';
import { EventType } from '@/types/event';
import './CreateEvent.css';

export default function CreateEventPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [managerTeams, setManagerTeams] = useState<any[]>([]);

    const [teamId, setTeamId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [location, setLocation] = useState('');
    const [type, setType] = useState<EventType>(EventType.Match);

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                await getCurrentUser();
                const allTeams = await getMyTeams();
                const managed = allTeams.filter(t => isManagerRole(t.role));

                setManagerTeams(managed);
                if (managed.length > 0) setTeamId(managed[0].id || managed[0].id);
            } catch (err: any) {
                setError('Nepodařilo se načíst data pro vytvoření události.');
            } finally {
                setIsLoading(false);
            }
        };
        init();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await eventApi.createEvent({
                teamId,
                title,
                description,
                type: type,
                eventDate: eventDate ? new Date(eventDate).toISOString() : undefined,
                location,
                invitedUserIds: []
            });

            alert('Událost byla úspěšně vytvořena!');
            router.push(`/Dashboard/Teams/${teamId}`);
        } catch (err: any) {
            setError(err.message || 'Došlo k chybě při vytváření události.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="create-event-container"><div className="glass-card"><p>Načítám...</p></div></div>;

    if (managerTeams.length === 0) {
        return (
            <div className="create-event-container">
                <div className="glass-card status-card">
                    <h2 className="status-heading">Přístup odepřen</h2>
                    <p className="status-text">Pro vytvoření události musíte být trenérem nebo majitelem týmu.</p>
                    <button className="btn-secondary" onClick={() => router.push('/Dashboard')}>Zpět</button>
                </div>
            </div>
        );
    }

    return (
        <div className="createevent">
            <div className="create-event-header">
                <h1 className="create-event-heading">Nová událost</h1>
                <p className="create-event-subtext">Naplánuj zápas, anketu nebo oznámení pro svůj tým.</p>
            </div>

            <div className="glass-card">
                {error && <div className="error-alert">{error}</div>}

                <form onSubmit={handleSubmit} className="event-form">
                    <div className="form-group">
                        <label className="form-label" htmlFor="teamId">Tým</label>
                        <select className="form-control" id="teamId" value={teamId} onChange={(e) => setTeamId(e.target.value)} required>
                            {managerTeams.map(t => (
                                <option key={t.id || t.Id} value={t.id || t.Id}>{t.teamName || t.TeamName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label" htmlFor="type">Typ události</label>
                            <select className="form-control" id="type" value={type} onChange={(e) => setType(e.target.value as EventType)} required>
                                <option value={EventType.Announcement}>Oznámení</option>
                                <option value={EventType.Poll}>Anketa</option>
                                <option value={EventType.Match}>Zápas</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="title">Název</label>
                            <input className="form-control" type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Např. Důležitý zápas" required />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label" htmlFor="eventDate">Datum a čas</label>
                            <input className="form-control" type="datetime-local" id="eventDate" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="location">Místo</label>
                            <input className="form-control" type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Např. Sportovní hala Opava" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="description">Popis (volitelné)</label>
                        <textarea className="form-control" id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => router.back()}>Zrušit</button>
                        <button type="submit" className="btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Vytvářím...' : 'Vytvořit událost'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}