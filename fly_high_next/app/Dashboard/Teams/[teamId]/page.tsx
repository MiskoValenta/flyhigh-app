"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getTeamById, addTeamMember, removeTeamMember, changeTeamMemberRole, updateTeam, deleteTeam } from '@/lib/teamApi';
import { getCurrentUser, isManagerRole } from '@/lib/api';
import { TeamDetail, TeamRole, TeamMember, UpdateTeamDto } from '@/types/team';
import { UserProfile } from '@/types/user';
import DashboardEvents from '@/components/DashboardEvents/DashboardEvents';
import { IoPencil } from 'react-icons/io5';
import './TeamDetail.css';

export default function TeamDetailPage() {
    const params = useParams();
    const router = useRouter();
    const teamId = params.teamId as string;

    const [team, setTeam] = useState<TeamDetail | null>(null);
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [newMemberId, setNewMemberId] = useState('');
    const [newMemberRole, setNewMemberRole] = useState<TeamRole>(TeamRole.Member);
    const [actionLoading, setActionLoading] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editAbbrev, setEditAbbrev] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [editLoading, setEditLoading] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                const user = await getCurrentUser();
                setCurrentUser(user);
                await fetchTeam();
            } catch (err: any) {
                setError('Nepodařilo se načíst uživatele nebo detail týmu.');
                setLoading(false);
            }
        };
        init();
    }, [teamId]);

    const fetchTeam = async () => {
        try {
            const data = await getTeamById(teamId);
            setTeam(data);

            setEditName(data.teamName || '');
            setEditAbbrev(data.shortName || '');
            setEditDesc(data.description || '');

        } catch (err: any) {
            setError(err.message || 'Nepodařilo se načíst detail týmu.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        setEditLoading(true);
        try {
            const payload: UpdateTeamDto = {
                teamName: editName,
                abbreviation: editAbbrev,
                description: editDesc
            };
            await updateTeam(teamId, payload);
            setIsEditing(false);
            await fetchTeam();
        } catch (err: any) {
            alert(err.message || 'Nepodařilo se uložit změny.');
        } finally {
            setEditLoading(false);
        }
    };

    const handleDeleteTeam = async () => {
        if (!confirm('Opravdu chcete tento tým trvale smazat? Tuto akci nelze vzít zpět.')) return;
        setActionLoading(true);
        try {
            await deleteTeam(teamId);
            alert('Tým byl úspěšně smazán.');
            router.push('/Dashboard/Teams');
        } catch (err: any) {
            alert(err.message || 'Chyba při mazání týmu.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMemberId.trim()) return;
        setActionLoading(true);
        try {
            await addTeamMember(teamId, newMemberId, newMemberRole);
            setNewMemberId('');
            await fetchTeam();
            alert('Člen úspěšně přidán do týmu!');
        } catch (err: any) {
            alert(err.message || 'Chyba při přidávání člena.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRemoveMember = async (userId: string) => {
        if (!confirm('Opravdu chcete tohoto hráče odebrat z týmu?')) return;
        setActionLoading(true);
        try {
            await removeTeamMember(teamId, userId);
            await fetchTeam();
        } catch (err: any) {
            alert(err.message || 'Chyba při odebírání člena.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleLeaveTeam = async () => {
        if (!currentUser) return;
        if (!confirm('Opravdu chcete opustit tento tým? Tuto akci nelze vzít zpět.')) return;
        setActionLoading(true);
        try {
            await removeTeamMember(teamId, currentUser.id);
            alert('Úspěšně jste opustili tým.');
            router.push('/Dashboard/Teams');
        } catch (err: any) {
            alert(err.message || 'Chyba při opouštění týmu.');
        } finally {
            setActionLoading(false);
        }
    };

    const copyTeamId = () => {
        navigator.clipboard.writeText(teamId);
        alert('ID Týmu bylo zkopírováno do schránky!');
    };

    const handleChangeRole = async (memberId: string, newRole: string) => {
        setActionLoading(true);
        try {
            await changeTeamMemberRole(teamId, memberId, newRole);
            await fetchTeam();
        } catch (err: any) {
            alert(err.message || 'Chyba při změně role.');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="team-detail-container"><div className="dashboard-loading-screen">Načítání detailu týmu...</div></div>;
    if (error) return <div className="team-detail-container"><p className="error-alert">{error}</p></div>;
    if (!team || !currentUser) return null;

    const myMemberInfo = team.members.find((m: TeamMember) => m.userId === currentUser.id);
    const myRole = myMemberInfo ? myMemberInfo.role : null;
    const isManager = myMemberInfo && isManagerRole(myRole as string | number);

    const getRoleStyling = (role: string | number) => {
        if (role === 'Owner' || role === 0)
            return { name: 'Majitel', cssClass: 'role-owner' };

        if (role === 'Coach' || role === 1)
            return { name: 'Trenér', cssClass: 'role-coach' };

        return { name: 'Člen', cssClass: 'role-member' };
    };

    return (
        <div className="team-detail-container">

            <div className="team-detail-header glass-card">
                {isEditing ? (
                    <form className="edit-team-form" onSubmit={handleUpdateTeam}>
                        <div className="form-group-col">
                            <label className="form-label">Název týmu</label>
                            <input
                                type="text"
                                className="form-control"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group-col">
                            <label className="form-label">Zkratka týmu</label>
                            <input
                                type="text"
                                className="form-control"
                                value={editAbbrev}
                                onChange={(e) => setEditAbbrev(e.target.value)}
                                maxLength={5}
                            />
                        </div>
                        <div className="form-group-col">
                            <label className="form-label">Popis týmu</label>
                            <textarea
                                className="form-control"
                                value={editDesc}
                                onChange={(e) => setEditDesc(e.target.value)}
                                rows={3}
                            />
                        </div>

                        <div className="team-actions flex-start-actions">
                            <button type="submit" className="btn-primary" disabled={editLoading}>
                                {editLoading ? 'Ukládám...' : 'Uložit změny'}
                            </button>
                            <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>
                                Zrušit
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        <div className="header-info">
                            <h1 className="dashboard-heading team-title-nomargin">{team.teamName}</h1>
                            {team.shortName && (
                                <span className="badge-role">{team.shortName}</span>
                            )}
                        </div>
                        <p className="team-description">{team.description || 'Spravuj svůj tým, kontroluj soupisku a plánuj události.'}</p>

                        <div className="team-actions-container">
                            <div className="actions-primary-row">
                                <button className="btn-secondary btn-nowrap" onClick={handleLeaveTeam} disabled={actionLoading}>
                                    Opustit tým
                                </button>
                                {isManager && (
                                    <button className="btn-primary btn-nowrap" onClick={copyTeamId}>
                                        Zkopírovat Team ID
                                    </button>
                                )}
                            </div>

                            <div className="actions-secondary-row">
                                {isManager && (
                                    <button className="btn-secondary btn-nowrap" onClick={() => setIsEditing(true)}>
                                        <IoPencil className="icon-left" /> Upravit informace
                                    </button>
                                )}
                                {(myRole === 'Owner' || myRole === 0) && team.members.length === 1 && (
                                    <button className="btn-danger btn-nowrap" onClick={handleDeleteTeam} disabled={actionLoading}>
                                        Smazat tým
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* SOUPISKA TÝMU */}
            <div className="team-members-section glass-card">
                <h2>Soupiska týmu</h2>
                {team.members.length === 0 ? (
                    <p className="team-description">Zatím zde nejsou žádní členové.</p>
                ) : (
                    <div className="members-list">
                        {team.members.map((member: TeamMember) => {
                            const fullName = (member.firstName || member.lastName)
                                ? `${member.firstName} ${member.lastName}`
                                : member.email;

                            const isMe = member.userId === currentUser.id;
                            const mRole = member.role;

                            const isTargetOwner = mRole === 'Owner' || mRole === 0;
                            const isTargetCoach = mRole === 'Coach' || mRole === 1;
                            const roleData = getRoleStyling(mRole);

                            let canChangeRole = false;
                            if (myRole === 'Owner' || myRole === 0) {
                                canChangeRole = !isTargetOwner && !isMe;
                            } else if (myRole === 'Coach' || myRole === 1) {
                                canChangeRole = !isTargetOwner && !isTargetCoach && !isMe;
                            }

                            return (
                                <div key={member.userId} className="member-item">
                                    <div className="member-info">
                                        <div className="member-email">
                                            {fullName} {isMe && <span className="member-status inactive">(Ty)</span>}
                                        </div>

                                        {canChangeRole ? (
                                            <select
                                                className={`role-select ${roleData.cssClass}`}
                                                value={mRole}
                                                onChange={(e) => handleChangeRole(member.userId, e.target.value)}
                                                disabled={actionLoading}
                                            >
                                                <option value="Member">Člen</option>
                                                <option value="Coach">Trenér</option>
                                            </select>
                                        ) : (
                                            <div className={`member-role ${roleData.cssClass}`}>
                                                {roleData.name}
                                            </div>
                                        )}
                                    </div>

                                    {isManager && !isTargetOwner && !isMe && (
                                        <button
                                            className="btn-danger-small"
                                            onClick={() => handleRemoveMember(member.userId)}
                                            disabled={actionLoading}
                                        >
                                            Odebrat
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {isManager && (
                <div className="glass-card">
                    <h2 className="section-subtitle">Přidat nového člena</h2>
                    <form onSubmit={handleAddMember} className="add-member-form">
                        <div className="form-group-col">
                            <label className="form-label">Uživatelské ID hráče</label>
                            <input
                                type="text"
                                placeholder="Vložte sem zkopírované ID hráče..."
                                value={newMemberId}
                                onChange={(e) => setNewMemberId(e.target.value)}
                                required
                                className="form-control"
                            />
                        </div>
                        <div className="form-group-col">
                            <label className="form-label">Přiřadit roli</label>
                            <select
                                value={newMemberRole}
                                onChange={(e) => setNewMemberRole(e.target.value as TeamRole)}
                                className="form-control"
                            >
                                <option value={TeamRole.Member}>Člen (Hráč)</option>
                                <option value={TeamRole.Coach}>Trenér</option>
                            </select>
                        </div>
                        <button type="submit" className="btn-primary btn-add-member" disabled={actionLoading}>
                            {actionLoading ? 'Přidávám...' : 'Přidat do týmu'}
                        </button>
                    </form>
                </div>
            )}

            <div className="team-events-section">
                <h2 className="section-subtitle">Plánované události týmu</h2>
                <DashboardEvents teamIds={[teamId]} currentUserId={currentUser.id} />
            </div>
        </div>
    );
}