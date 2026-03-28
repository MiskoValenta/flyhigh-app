"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import "@/app/globals.css";
import "./Home.css";
import { VideoJSProps } from '@/types/videoJs';

import videojs from "video.js";
import "video.js/dist/video-js.css";

import {
    IoStatsChart,
    IoPeople,
    IoAnalytics,
    IoClose
} from "react-icons/io5";

import LoginModal from "@/app/Login/LoginModal";

const VideoJS = ({ options }: VideoJSProps) => {
    const videoRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any>(null);

    useEffect(() => {
        if (!playerRef.current) {
            const videoElement = document.createElement("video-js");
            videoElement.classList.add("vjs-big-play-centered", "VideoModalPlayer");

            if (videoRef.current) {
                videoRef.current.appendChild(videoElement);
            }

            playerRef.current = videojs(videoElement, options);
        } else {
            const player = playerRef.current;
            player.autoplay(options.autoplay);
            player.src(options.sources);
        }
    }, [options]);

    useEffect(() => {
        return () => {
            if (playerRef.current && typeof playerRef.current.isDisposed === 'function' && !playerRef.current.isDisposed()) {
                playerRef.current.dispose();
                playerRef.current = null;
            }
        };
    }, []);

    return (
        <div data-vjs-player className="VideoPlayerWrapper">
            <div ref={videoRef} />
        </div>
    );
};
export default function Hero() {
    const [isLoginOpen, setLoginOpen] = useState(false);
    const [isVideoModalOpen, setVideoModalOpen] = useState(false);

    return (
        <>
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
                            <Link href="/Features">
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

            <div className="section-container video-section">
                <div className="video-wrapper" onClick={() => setVideoModalOpen(true)}>
                    <video
                        className="promo-video"
                        autoPlay
                        loop
                        muted
                        playsInline
                    >
                        <source src="/mat-vid-mp4.mp4" type="video/mp4" />
                        Váš prohlížeč nepodporuje přehrávání videa.
                    </video>
                    <div className="video-hover-overlay">
                        <span>Přehrát se zvukem</span>
                    </div>
                </div>
            </div>

            {isVideoModalOpen && (
                <div className="VideoModalOverlay" onClick={() => setVideoModalOpen(false)}>
                    <div className="VideoModalContent" onClick={(e) => e.stopPropagation()}>

                        <button className="VideoModalClose" onClick={() => setVideoModalOpen(false)}>
                            <IoClose />
                        </button>

                        <VideoJS
                            options={{
                                autoplay: true,
                                controls: true,
                                responsive: true,
                                fluid: true,
                                sources: [{
                                    src: '/mat-vid-mp4.mp4',
                                    type: 'video/mp4'
                                }]
                            }}
                        />

                    </div>
                </div>
            )}
        </>
    );
}