'use client';

import { useState } from "react";
import "./Navbar.css";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/ballin.svg";
import { ThemeToggle } from "@/app/theme-toggle";
import LoginModal from "@/app/Login/LoginModal";
import Sidebar from "@/components/Sidebar/Sidebar";

export const Navbar = () => {

    const [isLoginOpen, setLoginOpen] = useState(false);
    
    return (
        <>
            <nav className="navbar">
                <div className="container">

                    <div className="navbar-brand">
                        <a href={"/"}>
                            <Image className="brand-logo dark:invert dark:hue-rotate-180" src={Logo} alt="Logo" />
                        </a>
                        <Link className="brand-name" href="/">Fly High</Link>
                    </div>

                    <div className="navbar-menu">
                        <ul>
                            <li><Link href="/Features">Features</Link></li>
                            <li><Link href="/FAQ">FAQ</Link></li>
                            <li><Link href="/Contact">Contact</Link></li>
                        </ul>
                    </div>

                    <div className="navbar-login">
                        <ThemeToggle />

                        <Button
                            variant="default"
                            className="navbar-login-button"
                            onClick={() => setLoginOpen(true)}
                        >
                            Login
                        </Button>
                    </div>

                </div>
            </nav>

            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setLoginOpen(false)}
            />

            <div className="navbar-sidebar">
                <Sidebar />
            </div>
        </>
    );
}