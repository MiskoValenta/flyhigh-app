"use client";

import React, { useState } from "react";
import "./LoginModal.css";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/lib/api";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [isRegister, setIsRegister] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    if (!isOpen) return null;

    const toggleMode = () => {
        setIsRegister(!isRegister);
        setIsForgotPassword(false);
        setError("");
        setSuccessMessage("");
    };

    const toggleForgotPassword = () => {
        setIsForgotPassword(true);
        setIsRegister(false);
        setError("");
        setSuccessMessage("");
    };

    const backToLogin = () => {
        setIsForgotPassword(false);
        setIsRegister(false);
        setError("");
        setSuccessMessage("");
    };

    const handleCardClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const safeEmail = email.trim().toLowerCase();

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email: safeEmail, password }),
            });

            if (res.ok) {
                router.push("/Dashboard");
                onClose();
            } else {
                const data = await res.json();
                setError(data.message || "Chyba při přihlášení. Zkontrolujte údaje.");
            }
        } catch (err) {
            setError("Chyba serveru. Zkuste to prosím později.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Hesla se neshodují");
            return;
        }

        setIsLoading(true);

        const safeEmail = email.trim().toLowerCase();
        const safeFirstName = firstName.trim();
        const safeLastName = lastName.trim();

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    firstName: safeFirstName,
                    lastName: safeLastName,
                    email: safeEmail,
                    password
                }),
            });

            if (res.ok) {
                router.push("/Dashboard");
                onClose();
            } else {
                const data = await res.json();
                setError(data.message || "Registrace selhala. Tento email už pravděpodobně někdo využívá.");
            }
        } catch (err) {
            setError("Chyba serveru. Zkuste to prosím později.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setIsLoading(true);

        const safeEmail = email.trim().toLowerCase();

        try {
            await forgotPassword(safeEmail);
            setSuccessMessage("Pokud e-mail existuje v naší databázi, odeslali jsme na něj nové heslo.");
            setTimeout(() => {
                backToLogin();
            }, 5000);
        } catch (err: any) {
            setError(err.message || "Došlo k chybě při obnově hesla.");
        } finally {
            setIsLoading(false);
        }
    };

    const getHeadingText = () => {
        if (isForgotPassword) return "Obnova hesla";
        if (isRegister) return "Registrace";
        return "Přihlášení";
    };

    const getSubText = () => {
        if (isForgotPassword) return "Zadejte svůj e-mail a my vám zašleme nové dočasné heslo.";
        if (isRegister) return "Vytvořte si účet a spravujte svůj tým efektivně.";
        return "Vítejte zpět! Přihlašte se ke svému účtu.";
    };

    return (
        <div className="LoginOverlay" onClick={onClose}>
            <div className="LoginCard" onClick={handleCardClick}>

                <button className="CloseButton" onClick={onClose}>
                    <IoClose />
                </button>

                <h2 className="LoginHeading">{getHeadingText()}</h2>
                <p className="LoginSubText">{getSubText()}</p>

                {error && <div className="LoginError">{error}</div>}
                {successMessage && <div className="LoginError" style={{ backgroundColor: "rgba(74, 222, 128, 0.1)", color: "#4ade80", border: "1px solid rgba(74, 222, 128, 0.4)" }}>{successMessage}</div>}

                <form
                    className="LoginForm"
                    onSubmit={isForgotPassword ? handleForgotPasswordSubmit : (isRegister ? handleRegister : handleLogin)}
                >
                    {isRegister && !isForgotPassword && (
                        <>
                            <div className="InputGroup">
                                <input
                                    type="text"
                                    placeholder="Křestní jméno"
                                    className="LoginInput"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="InputGroup">
                                <input
                                    type="text"
                                    placeholder="Příjmení"
                                    className="LoginInput"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div className="InputGroup">
                        <input
                            type="email"
                            placeholder="Email"
                            className="LoginInput"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {!isForgotPassword && (
                        <div className="InputGroup">
                            <input
                                type="password"
                                placeholder="Heslo"
                                className="LoginInput"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    {isRegister && !isForgotPassword && (
                        <div className="InputGroup">
                            <input
                                type="password"
                                placeholder="Potvrzení hesla"
                                className="LoginInput"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    {!isRegister && !isForgotPassword && (
                        <div style={{ textAlign: "right", marginTop: "-0.5rem", marginBottom: "1rem" }}>
                            <button type="button" className="ForgotPasswordLink" onClick={toggleForgotPassword} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                                Zapomněli jste heslo?
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="LoginSubmitBtn"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? (isForgotPassword ? "Odesílám..." : (isRegister ? "Registruji..." : "Přihlašuji..."))
                            : (isForgotPassword ? "Odeslat nové heslo" : (isRegister ? "Zaregistrovat se" : "Přihlásit se"))
                        }
                    </button>
                </form>

                <div className="LoginFooter">
                    {isForgotPassword ? (
                        <div className="SwitchMode">
                            <button type="button" onClick={backToLogin} className="SwitchModeBtn">
                                ← Zpět na přihlášení
                            </button>
                        </div>
                    ) : (
                        <div className="SwitchMode">
                            <span>{isRegister ? "Máte již účet?" : "Nemáte účet?"}</span>
                            <button type="button" onClick={toggleMode} className="SwitchModeBtn">
                                {isRegister ? "Přihlaste se" : "Registrujte se"}
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}