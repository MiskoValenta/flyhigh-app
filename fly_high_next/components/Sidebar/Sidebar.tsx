"use client";

import React, { useState, useEffect } from "react";
import "@/app/globals.css";
import "./Sidebar.css";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/ballin.svg";
import { ThemeToggle } from "@/app/theme-toggle";
import { Button } from "@/components/ui/button";
import LoginModal from "@/app/Login/LoginModal";

import { IoMenu, IoClose, IoHomeOutline, IoInformationCircleOutline, IoHelpCircleOutline, IoMailOutline, IoListOutline } from "react-icons/io5";

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoginOpen, setLoginOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => { document.body.style.overflow = "auto"; };
    }, [isOpen]);

    const closeSidebar = () => setIsOpen(false);

    return (
        <>
            <button
                className="SidebarTrigger"
                onClick={() => setIsOpen(true)}
                aria-label="Open Menu"
            >
                <IoMenu />
            </button>

            <div
                className={`SidebarOverlay ${isOpen ? "open" : ""}`}
                onClick={closeSidebar}
            />

            <aside className={`SidebarContainer ${isOpen ? "open" : ""}`}>

                <div className="SidebarHeader">
                    <div className="SidebarBrand" onClick={closeSidebar}>
                        <Link href="/" className="BrandLink">
                            <Image src={Logo} alt="Fly High Logo" className="SidebarLogo dark:invert dark:hue-rotate-180" width={32} height={32} />
                            <span className="BrandName">Fly High</span>
                        </Link>
                    </div>

                    <button className="SidebarCloseBtn" onClick={closeSidebar}>
                        <IoClose />
                    </button>
                </div>

                <nav className="SidebarNav">
                    <ul className="NavList">
                        <li>
                            <Link href="/Features" className="NavLink" onClick={closeSidebar}>
                                <IoListOutline className="NavIcon" /> Features
                            </Link>
                        </li>
                        <li>
                            <Link href="/FAQ" className="NavLink" onClick={closeSidebar}>
                                <IoHelpCircleOutline className="NavIcon" /> FAQ
                            </Link>
                        </li>
                        <li>
                            <Link href="/Contact" className="NavLink" onClick={closeSidebar}>
                                <IoMailOutline className="NavIcon" /> Contact
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="SidebarFooter">

                    <div className="FooterItem">
                        <span className="FooterLabel">Theme</span>
                        <ThemeToggle />
                    </div>

                    <div className="FooterItem">
                        <Button
                            variant="default"
                            className="SidebarLoginBtn"
                            onClick={() => {
                                closeSidebar();
                                setLoginOpen(true);
                            }}
                        >
                            Login
                        </Button>
                    </div>

                </div>
            </aside>

            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setLoginOpen(false)}
            />
        </>
    );
}