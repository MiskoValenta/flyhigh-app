import { IoLogoInstagram, IoLogoChrome } from "react-icons/io";
import { IoLogoFacebook } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import "./Footer.css";
import Logo from "@/public/ballin.svg";

export const Footer = () => {

    const current_year = new Date().getFullYear();

    return (
        <footer>
            <div className="footer-container">
                <div className="footer-brand">
                    <Image src={Logo} alt="Fly High Logo" className="footer-brand-logo"></Image>
                    <h1 className="footer-brand-name">FLy High</h1>
                </div>
                <div className="footer-menu">
                    <p>Copyright © {current_year}</p>
                    <p><a href="/FAQ">Maturitní Práce</a></p>
                    <p><a href="mailto:d22623@oaopava.cz">d22623@oaopava.cz</a></p>
                </div>
                <div className="footer-socials">
                    <Link href="/"><IoLogoInstagram></IoLogoInstagram></Link>
                    <Link href="/"><IoLogoFacebook></IoLogoFacebook></Link>
                    <Link href="/"><IoLogoChrome></IoLogoChrome></Link>

                </div>
            </div>
        </footer>
    )
}