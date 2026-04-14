import React, { useState, useEffect } from "react";
import { Sparkles, Wand2, Globe, Shield, Zap, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import Footer from "../components/Footer";

const T = {
  bg: "#fafafa", surface: "#f5f0eb", dark: "#1a1a1a",
  mid: "#4a4a4a", muted: "#9a9a9a", accent: "#c4956a",
  accentHover: "#b5845a", border: "#e8e0d5"
};

const Features = () => {
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

      <section className="pt-40 pb-24 px-8 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#f5f0eb] rounded-full blur-[120px] opacity-30 -z-10"></div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 md:mb-24 text-center lg:text-left">
            <div className="space-y-6">
              <div className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] bg-[#1a1a1a] text-white">The Toolkit</div>
              <h2 className="text-[42px] md:text-[64px] font-black leading-[0.95] tracking-tight text-[#1a1a1a]">Everything creators<br />actually need.</h2>
            </div>
            <p className="text-base md:text-lg font-medium opacity-50 max-w-sm mx-auto lg:mx-0">No fluff. Just the most powerful AI primitives for digital distribution.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Wand2 />, title: "Vision Analysis", desc: "Reads objects, mood, and context with sub-pixel precision." },
              { icon: <Sparkles />, title: "Style Overlays", desc: "Switch between 5+ professional tones with a single click." },
              { icon: <Globe />, title: "Global Reach", desc: "Native support for Hindi, Hinglish, Spanish and beyond." },
              { icon: <Shield />, title: "Encrypted Cloud", desc: "Your images are processed in a secure sandbox & never stored." },
              { icon: <Zap />, title: "Millisecond Sync", desc: "Powered by Gemini 1.5 Flash for near-instant execution." },
              { icon: <Copy />, title: "Multi-Platform Export", desc: "Optimized formatting for Instagram, X, and LinkedIn." }
            ].map((f, i) => (
              <div key={i} className="group p-10 rounded-[40px] border border-[#e8e0d5] bg-white transition-all hover:border-[#1a1a1a] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-10 transition-all group-hover:scale-110 group-hover:rotate-3 shadow-lg bg-[#1a1a1a] text-white">
                  {React.cloneElement(f.icon, { className: "w-8 h-8" })}
                </div>
                <h3 className="text-2xl font-black mb-4">{f.title}</h3>
                <p className="font-medium text-[15px] opacity-40 leading-relaxed group-hover:opacity-100 transition-opacity">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Features;
