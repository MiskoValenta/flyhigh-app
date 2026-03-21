"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SidebarDashboard from "@/components/SidebarDashboard/SidebarDashboard";
import { fetchWithAuth } from "@/lib/apiClient";
import "./DashboardLayout.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetchWithAuth("/Auth/me");

                if (res.ok) {
                    setIsAuthenticated(true);
                } else {
                    router.push("/");
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                router.push("/");
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    if (isLoading) {
        return <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', color: 'white' }}>Načítám prostředí...</div>;
    }

    if (!isAuthenticated) return null;

    return (
        <div className="dashboard-layout-container">
            <SidebarDashboard />
            <div className="dashboard-content-area">
                {children}
            </div>
        </div>
    );
}