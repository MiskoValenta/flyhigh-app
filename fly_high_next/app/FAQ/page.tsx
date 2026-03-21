"use client";

import React, { useState } from "react";
import "@/app/globals.css";
import "./FAQ.css";

import { IoChevronDown, IoChevronUp } from "react-icons/io5";

type FaqItem = {
    question: string;
    answer: string;
};

type FaqCategory = {
    title: string;
    items: FaqItem[];
};

const faqData: FaqCategory[] = [
    {
        title: "General",
        items: [
            {
                question: "What is this app for?",
                answer: "Fly High slouží ke kompletní správě volejbalových týmů – od docházky přes zápasy až po statistiky."
            },
            {
                question: "Is it free?",
                answer: "Ano, v rámci maturitního projektu a testovacího provozu je aplikace zdarma."
            },
            {
                question: "Do I need an account?",
                answer: "Ano, pro správu týmu a ukládání statistik je nutná registrace."
            }
        ]
    },
    {
        title: "For Players & Coaches",
        items: [
            {
                question: "Can I track my own stats?",
                answer: "Samozřejmě. Každý hráč má svůj profil s historií výkonů."
            },
            {
                question: "Can I join more teams?",
                answer: "Ano, jeden účet může být členem více týmů (např. školní tým a klub)."
            },
            {
                question: "Can I export stats?",
                answer: "Tato funkce je momentálně ve vývoji pro budoucí verze (export do PDF/CSV)."
            }
        ]
    },
    {
        title: "Technical",
        items: [
            {
                question: "Is my data safe?",
                answer: "Používáme standardní šifrování hesel a bezpečné databázové postupy."
            },
            {
                question: "Is there a mobile app?",
                answer: "Fly High je plně responzivní webová aplikace (PWA), takže funguje skvěle v prohlížeči na mobilu i tabletu. Nativní aplikace pro iOS/Android je v plánu do budoucna."
            }
        ]
    },
    {
        title: "School / Maturita Project",
        items: [
            {
                question: "Is this a real project?",
                answer: "Ano, ačkoliv jde o maturitní práci, aplikace je plně funkční a připravená k použití reálnými uživateli."
            },
            {
                question: "How long did development take?",
                answer: "Vývoj probíhal několik měsíců, od prvotního návrhu architektury až po finální ladění UI."
            }
        ]
    }
];

const AccordionItem = ({ item }: { item: FaqItem }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`AccordionWrapper ${isOpen ? "open" : ""}`}>
            <button
                className="AccordionHeader"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <span className="QuestionText">{item.question}</span>
                <span className="AccordionIcon">
                    {isOpen ? <IoChevronUp /> : <IoChevronDown />}
                </span>
            </button>
            <div className="AccordionContent">
                <div className="AccordionInner">
                    {item.answer}
                </div>
            </div>
        </div>
    );
};

export default function FAQ() {
    return (
        <main>
            <div className="section-container" style={{ minHeight: '60vh' }}>
                <div className="FaqHero">
                    <h1 className="FaqTitle">Questions people usually ask</h1>
                    <p className="FaqSubtitle">
                        Vše, co vás zajímá o fungování, technologiích a účelu aplikace.
                    </p>
                </div>
            </div>

            {faqData.map((category, index) => (
                <div key={index} className="section-container">
                    <div className="FaqCategoryCard">

                        <div className="CategoryHeader">
                            <h2>{category.title}</h2>
                        </div>

                        <div className="CategoryItems">
                            {category.items.map((item, i) => (
                                <AccordionItem key={i} item={item} />
                            ))}
                        </div>

                    </div>
                </div>
            ))}

        </main>
    );
}