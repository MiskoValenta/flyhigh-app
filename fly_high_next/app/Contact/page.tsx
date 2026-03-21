"use client";

import React from "react";
import "@/app/globals.css";
import "./Contact.css";
import { IoMailOutline, IoLogoGithub } from "react-icons/io5";

export default function Contact() {
    return (
        <main className="section-container">
            <div className="ContactContainer">

                <div className="ContactFormCard">
                    <h1 className="ContactHeading">Contact</h1>
                    <p className="ContactSubText">
                        Máš nápad, feedback nebo problém?<br />
                        Tady je místo, kde se ozvat.
                    </p>

                    <form className="ContactForm">
                        <div className="FormGroup">
                            <input type="text" placeholder="Name (Jméno)" className="FormInput" />
                        </div>

                        <div className="FormGroup">
                            <input type="email" placeholder="Email" className="FormInput" />
                        </div>

                        <div className="FormGroup">
                            <input type="text" placeholder="Subject (Předmět)" className="FormInput" />
                        </div>

                        <div className="FormGroup">
                            <textarea placeholder="Message (Zpráva)" rows={5} className="FormTextarea"></textarea>
                        </div>

                        <button type="button" className="ContactButton">
                            Send Message
                        </button>
                    </form>
                </div>

                <div className="ContactInfoCard">

                    <div className="ContactInfoItem">
                        <div className="ContactIconBox">
                            <IoMailOutline />
                        </div>
                        <div className="ContactInfoText">
                            <span className="Label">Email:</span>
                            <a href="mailto:d22623@oaopava.cz" className="Value">d22623@oaopava.cz</a>
                        </div>
                    </div>

                    <div className="ContactInfoItem">
                        <div className="ContactIconBox">
                            <IoLogoGithub />
                        </div>
                        <div className="ContactInfoText">
                            <span className="Label">GitHub:</span>
                            <a href="https://github.com/MiskoValenta" target="_blank" rel="noopener noreferrer" className="Value">
                                MiskoValenta
                            </a>
                        </div>
                    </div>

                </div>

            </div>
        </main>
    );
}