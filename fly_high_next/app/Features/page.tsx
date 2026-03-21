"use client";

import React from "react";
import "@/app/globals.css";
import "./Features.css";

import {
    IoPeopleOutline,
    IoClipboardOutline,
    IoStatsChartOutline,
    IoCalendarOutline,
    IoCloudDoneOutline,
    IoSchoolOutline,
    IoPersonOutline,
    IoAmericanFootballOutline,
    IoCodeSlashOutline,
    IoServerOutline,
    IoConstructOutline
} from "react-icons/io5";

export default function Features() {
    return (
        <main>
            <div className="section-container">
                <div className="FeaturesWrapper">

                    <div className="FeaturesHeroCard">
                        <h1 className="FeaturesTitle">What this app can actually do</h1>
                        <p className="FeaturesSubtitle">
                            Přehled nástrojů pro hráče, trenéry a týmy bez zbytečné složitosti.<br />
                            Krátká pravda, žádná poezie.
                        </p>
                    </div>

                    <div className="FeaturesGrid">

                        <div className="FeatureCard">
                            <div className="FeatureIconBox">
                                <IoPeopleOutline />
                            </div>
                            <div className="FeatureContent">
                                <h3>Team Management</h3>
                                <p>
                                    Efektivní správa soupisky. Jasně definované role a jednoduchý systém pozvánek.
                                </p>
                            </div>
                        </div>

                        <div className="FeatureCard">
                            <div className="FeatureIconBox">
                                <IoClipboardOutline />
                            </div>
                            <div className="FeatureContent">
                                <h3>Match Tracking</h3>
                                <p>
                                    Zapisování zápasů v reálném čase. Sledujte průběžné skóre a základní analytiku ihned po odpískání.
                                </p>
                            </div>
                        </div>

                        <div className="FeatureCard">
                            <div className="FeatureIconBox">
                                <IoStatsChartOutline />
                            </div>
                            <div className="FeatureContent">
                                <h3>Player Statistics</h3>
                                <p>
                                    Sledujte vývoj v čase a identifikujte silné a slabé stránky každého hráče na základě dat.
                                </p>
                            </div>
                        </div>

                        <div className="FeatureCard">
                            <div className="FeatureIconBox">
                                <IoCalendarOutline />
                            </div>
                            <div className="FeatureContent">
                                <h3>Training Overview</h3>
                                <p>
                                    Kompletní přehled tréninků a docházky. Plánování nadcházejících akcí na jednom místě.
                                </p>
                            </div>
                        </div>

                        <div className="FeatureCard SpanFull">
                            <div className="FeatureIconBox">
                                <IoCloudDoneOutline />
                            </div>
                            <div className="FeatureContent">
                                <h3>Cloud & Sync</h3>
                                <p>
                                    Vaše data jsou v bezpečí a přístupná odkudkoliv. Začněte na počítači, pokračujte na tabletu.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="section-container" style={{ paddingTop: 0, minHeight: 'auto' }}>
                <div className="FeaturesWrapper">

                    <div className="BottomGrid">

                        <div className="InfoBarCard">
                            <h3>For Who It's Built</h3>
                            <div className="InfoListVertical">
                                <div className="InfoItem">
                                    <IoPersonOutline className="InfoIcon" /> <span>Players</span>
                                </div>
                                <div className="InfoItem">
                                    <IoClipboardOutline className="InfoIcon" /> <span>Coaches</span>
                                </div>
                                <div className="InfoItem">
                                    <IoSchoolOutline className="InfoIcon" /> <span>School Teams</span>
                                </div>
                                <div className="InfoItem">
                                    <IoAmericanFootballOutline className="InfoIcon" /> <span>Amateur Clubs</span>
                                </div>
                            </div>
                        </div>

                        <div className="InfoBarCard">
                            <h3>Tech Behind App</h3>
                            <div className="InfoListVertical">
                                <div className="InfoItem">
                                    <IoCodeSlashOutline className="InfoIcon" />
                                    <span>Frontend: <strong>Next.js & React</strong></span>
                                </div>
                                <div className="InfoItem">
                                    <IoConstructOutline className="InfoIcon" />
                                    <span>Backend: <strong>C# / .NET</strong></span>
                                </div>
                                <div className="InfoItem">
                                    <IoServerOutline className="InfoIcon" />
                                    <span>Database: <strong>PostgreSQL</strong></span>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </main>
    );
}