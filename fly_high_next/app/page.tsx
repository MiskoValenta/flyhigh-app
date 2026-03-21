"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import "@/app/globals.css";
import "./Home.css";

import {
    IoStatsChart,
    IoPeople,
    IoAnalytics,
} from "react-icons/io5";
import LoginModal from "@/app/Login/LoginModal";

export default function Hero() {

    const [isLoginOpen, setLoginOpen] = useState(false);

    return (
        <div className="section-container">

            <div className="HeroBackground">
                <div className="FloatingElement Card-1">
                    <div className="MiniCardHeader">
                        <div className="MiniDot"></div>
                        <div className="MiniLine"></div>
                    </div>
                    <div className="MiniChart">
                        <IoStatsChart className="FloatingIcon" />
                        <div className="ChartLine"></div>
                    </div>
                </div>

                <div className="FloatingElement Card-2">
                    <div className="MiniCardHeader">
                        <IoPeople className="FloatingIconSmall" />
                        <div className="MiniLineShort"></div>
                    </div>
                    <div className="MiniRows">
                        <div className="MiniRow"></div>
                        <div className="MiniRow"></div>
                    </div>
                </div>

                <div className="FloatingElement Card-3">
                    <IoAnalytics className="FloatingIconBig" />
                    <div className="MiniGraphCurve"></div>
                </div>

                <div className="FloatingOrb Orb-1"></div>
                <div className="FloatingOrb Orb-2"></div>
                <div className="FloatingGrid"></div>
            </div>

            <div className="HeroContent">
                <div className="HeroGlassCard">
                    <h1 className="HeroTitle">
                        Volejbalový management pro moderní týmy
                    </h1>

                    <p className="HeroSubtitle">
                        Konec papírování a chaosu v chatu. Fly High spojuje správu týmu,
                        statistiky zápasů a tréninkové plány do jedné jednoduché aplikace.
                    </p>

                    <div className="HeroButtons">
                        <Link href="/About">
                            <Button className="HeroBtn Primary">
                                Zjistit více
                            </Button>
                        </Link>

                        <Button className="HeroBtn Secondary" onClick={() => setLoginOpen(true)}>
                            Vstoupit do aplikace
                        </Button>
                    </div>
                </div>
            </div>

            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setLoginOpen(false)}
            />

        </div>
    );
}