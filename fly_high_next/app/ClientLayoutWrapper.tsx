// app/ClientLayoutWrapper.tsx
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar/Navbar";
import { Footer } from "@/components/Footer/Footer";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith("/Dashboard");

    return (
        <div className="app-root">
            {!isDashboard && <Navbar />}
            <main className={isDashboard ? "dashboard-main-content" : "site-main"}>
                {children}
            </main>
            {!isDashboard && <Footer />}
        </div>
    );
}