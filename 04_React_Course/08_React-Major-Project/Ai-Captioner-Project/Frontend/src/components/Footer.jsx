import React from "react";
import { Github, Twitter, Instagram, Linkedin, Mail, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";

const T = {
    bg: "#fafafa", surface: "#f5f0eb", dark: "#1a1a1a",
    mid: "#4a4a4a", muted: "#9a9a9a", accent: "#c4956a",
    accentHover: "#b5845a", border: "#e8e0d5",
};

const Footer = () => {
    const navigate = useNavigate();

    const footerLinks = {
        Product: [
            { name: "Image Captioner", path: "/image-captioner" },
            { name: "Features", path: "/#features" },
            { name: "How it Works", path: "/#how" },
            { name: "Pricing", path: "/#pricing" },
        ],
        Company: [
            { name: "About Us", path: "#" },
            { name: "Careers", path: "#" },
            { name: "Blog", path: "#" },
            { name: "Contact", path: "#" },
        ],
        Legal: [
            { name: "Privacy Policy", path: "#" },
            { name: "Terms of Service", path: "#" },
            { name: "Cookie Policy", path: "#" },
        ],
    };

    const socials = [
        { icon: <Github className="w-5 h-5" />, link: "https://github.com/IshaCodes04" },
        { icon: <Twitter className="w-5 h-5" />, link: "https://x.com/isha_singh06" },
        { icon: <Instagram className="w-5 h-5" />, link: "#" },
        { icon: <Linkedin className="w-5 h-5" />, link: "https://www.linkedin.com/in/isha-singh-b00715300/" },
    ];

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="w-full pt-24 pb-12 border-t bg-[#fafafa]" style={{ borderColor: T.border }}>
            <div className="max-w-7xl mx-auto px-6 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
                    
                    {/* Brand Section */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="cursor-pointer transition-transform hover:scale-105 origin-left inline-block" onClick={() => { navigate("/home"); scrollToTop(); }}>
                            <Logo size={40} />
                        </div>
                        
                        <p className="text-lg font-medium leading-[1.6] max-w-md" style={{ color: T.mid }}>
                            Empowering creators with the world's most intelligent <span className="font-bold" style={{ color: T.dark }}>Vision AI</span>. Stop the scroll with AI-powered storytelling.
                        </p>

                        <div className="flex items-center gap-3">
                            {socials.map((social, i) => (
                                <a 
                                    key={i} 
                                    href={social.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="w-11 h-11 rounded-2xl border flex items-center justify-center transition-all hover:-translate-y-1 bg-white hover:bg-[#1a1a1a] hover:text-white shadow-sm"
                                    style={{ borderColor: T.border }}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
                        {Object.entries(footerLinks).map(([title, links]) => (
                            <div key={title} className="space-y-6">
                                <h4 className="text-[11px] font-black uppercase tracking-[0.25em]" style={{ color: T.accent }}>
                                    {title}
                                </h4>
                                <ul className="space-y-4">
                                    {links.map((link) => (
                                        <li key={link.name}>
                                            <a 
                                                href={link.path} 
                                                className="text-[15px] font-semibold transition-all hover:translate-x-1 inline-block" 
                                                style={{ color: T.mid }}
                                                onClick={(e) => {
                                                    if (link.path.startsWith("/#")) {
                                                        e.preventDefault();
                                                        const id = link.path.split("#")[1];
                                                        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                                                    }
                                                }}
                                            >
                                                {link.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>



                {/* Bottom Bar */}
                <div className="pt-10 border-t flex flex-col md:flex-row justify-between items-center gap-8" style={{ borderColor: T.border }}>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <p className="text-[13px] font-bold" style={{ color: T.muted }}>
                            © 2026 SnapScript. Built with Passion by <span style={{ color: T.dark }}>Isha Singh</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: "#059669" }}>Network Status: Optimal</span>
                        </div>
                        <button 
                            onClick={scrollToTop}
                            className="w-10 h-10 rounded-xl border border-[#e8e0d5] flex items-center justify-center hover:bg-white transition-all hover:-translate-y-1 shadow-sm group"
                        >
                            <ArrowRight className="w-5 h-5 -rotate-90 group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
