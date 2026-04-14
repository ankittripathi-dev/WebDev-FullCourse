import React, { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import Footer from "../components/Footer";

const T = {
  bg: "#fafafa", surface: "#f5f0eb", dark: "#1a1a1a",
  mid: "#4a4a4a", muted: "#9a9a9a", accent: "#c4956a",
  accentHover: "#b5845a", border: "#e8e0d5"
};

const Pricing = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navLinks = [
    { name: "Features", path: "/features" },
    { name: "How It Works", path: "/how" },
    { name: "Pricing", path: "/pricing" }
  ];

  return (
    <div className="min-h-screen text-[#1a1a1a] overflow-x-hidden bg-[#fafafa]" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <nav className={`fixed top-0 left-0 w-full z-[120] transition-all duration-500 ${scrolled ? "py-3 bg-white/95 backdrop-blur-xl shadow-sm" : "py-5 bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex justify-between items-center text-[#1a1a1a]">
          <div className="flex items-center gap-12">
            <div className="cursor-pointer transition-transform hover:scale-105 active:scale-95" onClick={() => navigate("/home")}>
              <Logo />
            </div>
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((l) => (
                <button key={l.name} onClick={() => navigate(l.path)} className="text-[12px] font-bold uppercase tracking-[0.25em] transition-all hover:text-[#c4956a]">{l.name}</button>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center gap-5">
            <button onClick={() => navigate("/login")} className="px-6 py-2.5 rounded-xl font-bold text-[12px] uppercase tracking-wider hover:bg-[#1a1a1a] hover:text-white transition-all border border-[#e8e0d5]">Login</button>
            <button onClick={() => navigate("/signup")} className="px-7 py-2.5 rounded-xl font-black text-[12px] uppercase tracking-widest text-white shadow-lg" style={{ background: T.accent }}>Sign Up Free</button>
          </div>
          <button className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <div className={`w-6 h-0.5 bg-black transition-all ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}></div>
            <div className={`w-6 h-0.5 bg-black transition-all ${mobileMenuOpen ? "opacity-0" : ""}`}></div>
            <div className={`w-6 h-0.5 bg-black transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[300] transition-all duration-500 md:hidden flex flex-col items-center justify-center gap-8 px-8 text-center ${mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className="absolute inset-0 bg-white/95 backdrop-blur-2xl -z-10"></div>
        <button className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center bg-[#f5f0eb] rounded-2xl" onClick={() => setMobileMenuOpen(false)}>
          <Logo textVisible={false} size={30} />
        </button>
        <div className="flex flex-col gap-6 w-full">
          {navLinks.map((l) => (
            <button key={l.name} onClick={() => { navigate(l.path); setMobileMenuOpen(false); }} className="text-4xl font-black tracking-tighter hover:text-[#c4956a] transition-colors">{l.name}</button>
          ))}
        </div>
        <div className="w-full h-px bg-[#e8e0d5] my-4"></div>
        <div className="flex flex-col gap-4 w-full">
          <button onClick={() => { navigate("/login"); setMobileMenuOpen(false); }} className="w-full py-5 rounded-2xl font-black text-xl uppercase tracking-widest border-2 border-[#e8e0d5] bg-white text-[#1a1a1a]">Login</button>
          <button onClick={() => { navigate("/signup"); setMobileMenuOpen(false); }} className="w-full py-5 rounded-2xl font-black text-xl uppercase tracking-widest text-white shadow-xl" style={{ background: T.accent }}>Sign Up Free</button>
        </div>
      </div>

      <section className="pt-40 pb-32 px-8 bg-white min-h-[80vh] flex items-center">
        <div className="max-w-6xl mx-auto w-full">
          <div className="rounded-[40px] md:rounded-[64px] p-10 md:p-24 text-center relative overflow-hidden bg-[#1a1a1a] text-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: `radial-gradient(circle at 100% 0%, ${T.accent} 0%, transparent 50%), radial-gradient(circle at 0% 100%, ${T.accent} 0%, transparent 50%)` }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-[0.03]" style={{ backgroundImage: `radial-gradient(white 1px, transparent 1px)`, backgroundSize: '24px 24px' }}></div>
            <div className="relative z-10">
              <p className="text-xs font-black uppercase tracking-[0.4em] mb-10" style={{ color: T.accent }}>Pricing Simplified</p>
              <h2 className="text-[42px] md:text-[72px] font-black leading-[0.9] mb-10 tracking-tight">
                Unlimited for <br /> everyone, <span style={{ color: T.accent }}>forever.</span>
              </h2>
              <div className="flex flex-wrap justify-center gap-10 mb-16 opacity-40">
                {["No Credit Card", "Unlimited Generations", "All Style Tones", "Privacy Guaranteed"].map(feat => (
                  <div key={feat} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {feat}
                  </div>
                ))}
              </div>
              <button onClick={() => navigate("/signup")} className="px-12 py-5 rounded-2xl font-black text-xl bg-white text-black hover:scale-105 transition-all">Get Started Now</button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Pricing;
