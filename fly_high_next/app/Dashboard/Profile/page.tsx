"use client";

import React, { useEffect, useState } from 'react';
import { getCurrentUser, updateProfile, changePassword } from '@/lib/api';
import { UserProfile } from '@/types/user';
import './Profile.css';

export default function ProfilePage() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [profileMsg, setProfileMsg] = useState({ text: '', isError: false });
    const [isProfileLoading, setIsProfileLoading] = useState(false);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordMsg, setPasswordMsg] = useState({ text: '', isError: false });
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const data = await getCurrentUser();
            setUser(data);
            setFirstName(data.firstName || '');
            setLastName(data.lastName || '');
            setEmail(data.email || '');
        } catch (err) {
            console.error("Nepodařilo se načíst profil", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileMsg({ text: '', isError: false });
        setIsProfileLoading(true);

        try {
            await updateProfile({ firstName, lastName, email });
            setProfileMsg({ text: 'Profil byl úspěšně aktualizován.', isError: false });
        } catch (err: any) {
            setProfileMsg({ text: err.message, isError: true });
        } finally {
            setIsProfileLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMsg({ text: '', isError: false });

        if (newPassword !== confirmNewPassword) {
            setPasswordMsg({ text: 'Nová hesla se neshodují.', isError: true });
            return;
        }

        setIsPasswordLoading(true);
        try {
            await changePassword({ oldPassword, newPassword });
            setPasswordMsg({ text: 'Heslo bylo úspěšně změněno.', isError: false });
            setOldPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (err: any) {
            setPasswordMsg({ text: err.message, isError: true });
        } finally {
            setIsPasswordLoading(false);
        }
    };

    if (isLoading) return <div className="profile-container"><p>Načítám profil...</p></div>;
    if (!user) return <div className="profile-container"><p className="error-alert-profile">Profil nebyl nalezen.</p></div>;

    return (
        <div className="profile-container">
            <div className="glass-card glass-card-addition profile-card">
                <h2 className="profile-title">Osobní údaje</h2>

                {profileMsg.text && (
                    <div className={profileMsg.isError ? "error-alert-profile" : "success-alert-profile"}>
                        {profileMsg.text}
                    </div>
                )}

                <form className="profile-form" onSubmit={handleUpdateProfile}>
                    <div className="form-row-profile">
                        <div className="form-group-profile">
                            <label>Křestní jméno</label>
                            <input type="text" className="auth-input-profile" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                        </div>
                        <div className="form-group-profile">
                            <label>Příjmení</label>
                            <input type="text" className="auth-input-profile" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                        </div>
                    </div>

                    <div className="form-group-profile">
                        <label>E-mailová adresa</label>
                        <input type="email" className="auth-input-profile" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    <div className="profile-btn-container">
                        <button type="submit" className="btn-primary" disabled={isProfileLoading}>
                            {isProfileLoading ? 'Ukládám...' : 'Uložit změny'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="glass-card glass-card-addition profile-card">
                <h2 className="profile-title">Změna hesla</h2>

                {passwordMsg.text && (
                    <div className={passwordMsg.isError ? "error-alert-profile" : "success-alert-profile"}>
                        {passwordMsg.text}
                    </div>
                )}

                <form className="profile-form" onSubmit={handleChangePassword}>
                    <div className="form-group-profile">
                        <label>Aktuální heslo</label>
                        <input type="password" className="auth-input-profile" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
                    </div>

                    <div className="form-row-profile">
                        <div className="form-group-profile">
                            <label>Nové heslo</label>
                            <input type="password" className="auth-input-profile" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
                        </div>
                        <div className="form-group-profile">
                            <label>Potvrzení nového hesla</label>
                            <input type="password" className="auth-input-profile" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required minLength={6} />
                        </div>
                    </div>

                    <div className="profile-btn-container">
                        <button type="submit" className="btn-primary" disabled={isPasswordLoading}>
                            {isPasswordLoading ? 'Měním heslo...' : 'Změnit heslo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}