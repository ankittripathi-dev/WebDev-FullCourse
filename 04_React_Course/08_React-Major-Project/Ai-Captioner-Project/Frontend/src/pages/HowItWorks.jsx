import React, { useState, useEffect } from "react";
import { Upload, Wand2, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import Footer from "../components/Footer";

const T = {
  bg: "#fafafa", surface: "#f5f0eb", dark: "#1a1a1a",
  mid: "#4a4a4a", muted: "#9a9a9a", accent: "#c4956a",
  accentHover: "#b5845a", border: "#e8e0d5"
};

const HowItWorks = () => {
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

      <section className="pt-40 pb-24 px-8 relative overflow-hidden" style={{ background: T.surface }}>
        <div className="absolute top-1/2 left-0 w-full h-px border-t border-dashed border-[#d8d0c5] -translate-y-1/2 hidden md:block"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-32">
            <div className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] bg-white border border-[#e8e0d5] text-[#c4956a] mb-6">The Process</div>
            <h2 className="text-[42px] md:text-[64px] font-black tracking-tight leading-none">3 Steps to Virality</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-16 lg:gap-24">
            {[
              { step: "01", icon: <Upload />, title: "Upload", desc: "Select any visual asset from your device." },
              { step: "02", icon: <Wand2 />, title: "Analyze", desc: "Gemini Vision reads the context & mood." },
              { step: "03", icon: <Copy />, title: "Deploy", desc: "Copy & post with one-click formatting." }
            ].map((s, i) => (
              <div key={i} className="relative group text-center md:text-left">
                <div className="w-24 h-24 rounded-[32px] bg-white border border-[#e8e0d5] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] flex items-center justify-center text-[#1a1a1a] mb-10 transition-all group-hover:scale-110 group-hover:-rotate-3 relative z-10 mx-auto md:mx-0">
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#1a1a1a] text-white text-[10px] font-black flex items-center justify-center border-4 border-[#f5f0eb]">{s.step}</div>
                  {React.cloneElement(s.icon, { className: "w-10 h-10" })}
                </div>
                <h3 className="text-3xl font-black mb-4">{s.title}</h3>
                <p className="font-medium text-[#4a4a4a] opacity-50 text-lg leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HowItWorks;
