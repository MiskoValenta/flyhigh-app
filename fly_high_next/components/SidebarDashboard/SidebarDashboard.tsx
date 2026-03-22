"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from "next/image";
import Logo from "@/public/ballin.svg";
import { usePathname, useRouter } from 'next/navigation';
import { IoMenu, IoClose, IoHomeOutline, IoPeopleOutline, IoBasketballOutline, IoLogOutOutline, IoPersonOutline } from "react-icons/io5";
import { logout } from '@/lib/api';
import './SidebarDashboard.css';

export default function SidebarDashboard() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            router.push('/');
        }
    };

    const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);

    return (
        <>
            <div className="mobile-sidebar-toggle">
                <div className="mobile-logo-container">
                    <Image src={Logo} alt="Fly High Logo" className="mobile-logo-icon dark:invert dark:hue-rotate-180" />
                    <span className="mobile-logo-text">FlyHigh</span>
                </div>
                <button onClick={toggleMobileMenu} className="mobile-toggle-btn">
                    {isMobileOpen ? <IoClose className="mobile-toggle-icon" /> : <IoMenu className="mobile-toggle-icon" />}
                </button>
            </div>

            <aside className={`sidebar-dashboard ${isMobileOpen ? 'open' : ''}`}>
                <div className="sidebar-dashboard-logo">
                    <Link href="/Dashboard" onClick={() => setIsMobileOpen(false)} className="logo-link">
                        <Image src={Logo} alt="Fly High Logo" className="sidebar-logo-icon dark:invert dark:hue-rotate-180" />
                        <span className="sidebar-logo-text">FlyHigh</span>
                    </Link>
                </div>

                <nav className="sidebar-dashboard-nav">
                    <Link href="/Dashboard" className={pathname === '/Dashboard' ? 'active' : ''} onClick={() => setIsMobileOpen(false)}>
                        <IoHomeOutline className="sidebar-icon" /> Přehled
                    </Link>
                    <Link href="/Dashboard/Teams" className={pathname.startsWith('/Dashboard/Teams') ? 'active' : ''} onClick={() => setIsMobileOpen(false)}>
                        <IoPeopleOutline className="sidebar-icon" /> Týmy
                    </Link>
                    <Link href="/Dashboard/Matches" className={pathname.startsWith('/Dashboard/Matches') ? 'active' : ''} onClick={() => setIsMobileOpen(false)}>
                        <IoBasketballOutline className="sidebar-icon" /> Zápasy
                    </Link>
                    <Link href="/Dashboard/Profile" className={pathname.startsWith('/Dashboard/Profile') ? 'active' : ''} onClick={() => setIsMobileOpen(false)}>
                        <IoPersonOutline className="sidebar-icon" /> Profil
                    </Link>
                </nav>

                <div className="sidebar-dashboard-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <IoLogOutOutline className="sidebar-icon" /> Odhlásit se
                    </button>
                </div>
            </aside>

            {isMobileOpen && <div className="sidebar-overlay" onClick={() => setIsMobileOpen(false)}></div>}
        </>
    );
}