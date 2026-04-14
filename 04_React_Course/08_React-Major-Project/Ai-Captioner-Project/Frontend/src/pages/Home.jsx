import React, { useState, useEffect } from "react";
import { ArrowRight, Sparkles, Zap, Upload, Image, Copy, Wand2, Globe, Shield, Play, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import Footer from "../components/Footer";

const T = {
  bg: "#fafafa", surface: "#f5f0eb", dark: "#1a1a1a",
  mid: "#4a4a4a", muted: "#9a9a9a", accent: "#c4956a",
  accentHover: "#b5845a", border: "#e8e0d5"
};

const Home = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    const handleMouse = (e) => {
      setMousePos({ x: (e.clientX / window.innerWidth - 0.5) * 20, y: (e.clientY / window.innerHeight - 0.5) * 20 });
    };
    window.addEventListener("scroll", fn);
    window.addEventListener("mousemove", handleMouse);
    return () => {
      window.removeEventListener("scroll", fn);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  const simulateVision = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setShowResult(false);
    setTimeout(() => {
      setIsProcessing(false);
      setShowResult(true);
    }, 2800);
  };

  return (
    <div className="min-h-screen text-[#1a1a1a] overflow-x-hidden bg-[#fafafa]" style={{ fontFamily: "'Manrope', sans-serif" }}>

      {/* ══ NAVBAR ══════════════════════════════════════════════ */}
      <nav className={`fixed top-0 left-0 w-full z-[120] transition-all duration-500 ${scrolled ? "py-3 bg-white/95 backdrop-blur-xl shadow-sm" : "py-5 bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex justify-between items-center text-[#1a1a1a]">
          <div className="flex items-center gap-12">
            <div className="cursor-pointer transition-transform hover:scale-105 active:scale-95" onClick={() => navigate("/home")}>
              <Logo />
            </div>

            <div className="hidden lg:flex items-center gap-10">
              {[["Features", "features"], ["How It Works", "how-it-works"], ["Pricing", "pricing"]].map(([l, id]) => (
                <button key={l} onClick={() => scrollToSection(id)} className="text-[12px] font-bold uppercase tracking-[0.25em] transition-all hover:text-[#c4956a]">{l}</button>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-5">
            <button 
              onClick={() => navigate("/login")}
              className="px-6 py-2.5 rounded-xl font-bold text-[12px] uppercase tracking-wider hover:bg-[#1a1a1a] hover:text-white transition-all border border-[#e8e0d5]"
            >
              Login
            </button>
            <button 
              onClick={() => navigate("/signup")}
              className="px-7 py-2.5 rounded-xl font-black text-[12px] uppercase tracking-widest text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-95"
              style={{ background: T.accent }}
            >
              Sign Up Free
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className={`w-6 h-0.5 bg-black transition-all ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}></div>
            <div className={`w-6 h-0.5 bg-black transition-all ${mobileMenuOpen ? "opacity-0" : ""}`}></div>
            <div className={`w-6 h-0.5 bg-black transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Move outside to avoid stacking context issues */}
      <div className={`fixed inset-0 z-[300] transition-all duration-500 md:hidden flex flex-col items-center justify-center gap-8 px-8 text-center ${mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className="absolute inset-0 bg-white/95 backdrop-blur-2xl -z-10"></div>
        
        <button className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center bg-[#f5f0eb] rounded-2xl" onClick={() => setMobileMenuOpen(false)}>
          <Logo textVisible={false} size={30} />
        </button>

        <div className="flex flex-col gap-6 w-full">
          {[["Features", "features"], ["How It Works", "how-it-works"], ["Pricing", "pricing"]].map(([l, id]) => (
            <button 
              key={l} 
              onClick={() => { scrollToSection(id); setMobileMenuOpen(false); }}
              className="text-4xl font-black tracking-tighter hover:text-[#c4956a] transition-colors"
            >{l}</button>
          ))}
        </div>

        <div className="w-full h-px bg-[#e8e0d5] my-4"></div>

        <div className="flex flex-col gap-4 w-full">
          <button 
            onClick={() => { navigate("/login"); setMobileMenuOpen(false); }}
            className="w-full py-5 rounded-2xl font-black text-xl uppercase tracking-widest border-2 border-[#e8e0d5] bg-white text-[#1a1a1a]"
          >
            Login
          </button>
          <button 
            onClick={() => { navigate("/signup"); setMobileMenuOpen(false); }}
            className="w-full py-5 rounded-2xl font-black text-xl uppercase tracking-widest text-white shadow-xl shadow-[#c4956a]/20"
            style={{ background: T.accent }}
          >
            Sign Up Free
          </button>
        </div>
      </div>

      {/* ══ HERO ════════════════════════════════════════════════ */}
      <section className="relative pt-40 pb-20 px-8 overflow-hidden bg-[#fafafa]">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-20 animate-pulse pointer-events-none" style={{ background: T.accent }}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-20 animate-pulse-slow pointer-events-none" style={{ background: T.accent }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-[0.03]" style={{ backgroundImage: `radial-gradient(${T.dark} 1px, transparent 1px)`, backgroundSize: '32px 32px' }}></div>

        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="animate-fadeUp flex flex-col items-center lg:items-start text-center lg:text-left" style={{ transform: `translate(${mousePos.x * 0.2}px, ${mousePos.y * 0.2}px)` }}>
            <div className="group inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl mb-10 text-[11px] font-black uppercase tracking-[0.2em] bg-white shadow-sm border border-[#e8e0d5] transform hover:scale-105 transition-all cursor-default" style={{ color: T.accent }}>
              <Sparkles className="w-4 h-4 fill-current group-hover:rotate-12 transition-transform" />
              Next-Gen Vision AI
            </div>

            <h1 className="text-[40px] xs:text-[48px] md:text-[68px] lg:text-[88px] font-extrabold leading-[1.1] md:leading-[0.9] tracking-[-0.05em] mb-10 px-4 md:px-0" style={{ color: T.dark, fontFamily: "'Urbanist', sans-serif" }}>
              Turn Any Image<br className="hidden xs:block" />
              <span className="relative inline-block group">
                Into a <span style={{ color: T.accent }}>Viral Script</span>
                <span className="absolute -bottom-2 left-0 w-full h-3 rounded-full opacity-30 z-[-1] blur-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${T.accent}, transparent)` }}></span>
                <span className="absolute -bottom-2 left-0 w-0 h-3 bg-[#c4956a] rounded-full transition-all duration-1000 group-hover:w-full opacity-40"></span>
              </span>
            </h1>

            <div className="relative pl-0 lg:pl-10 mb-12 max-w-xl group">
              <div className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-[#c4956a] via-[#c4956a]/40 to-transparent hidden lg:block">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#c4956a] shadow-[0_0_15px_#c4956a] animate-pulse"></div>
              </div>
              <p className="text-lg md:text-[22px] font-medium leading-[1.6] group-hover:translate-x-1 transition-transform duration-500" style={{ color: T.mid }}>
                The world's most <span className="font-extrabold" style={{ color: T.dark }}>intelligent vision engine</span> for creators. <span className="block lg:inline">Generate captions that <span className="italic font-bold" style={{ color: T.accent }}>stop the scroll</span>.</span>
              </p>
            </div>

            <div className="flex flex-col items-center lg:items-start gap-10 pt-4">
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                {["100% Free", "Gemini 1.5 Pro", "Viral Hooks", "24/7 Active"].map((tag, i) => (
                  <div key={tag} className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border border-[#e8e0d5] bg-white shadow-sm flex items-center gap-2 hover:border-[#c4956a] hover:text-[#c4956a] transition-all cursor-default group">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#c4956a] group-hover:animate-ping"></div>
                    {tag}
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center lg:items-start gap-4 border-t border-[#e8e0d5]/40 pt-8 mt-2 w-full lg:w-auto">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-[3px] border-white bg-gray-200 shadow-xl transition-transform hover:-translate-y-2 hover:z-20 cursor-pointer" style={{ backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 15})`, backgroundSize: 'cover' }}></div>
                    ))}
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-[3px] border-white bg-[#1a1a1a] flex items-center justify-center text-white text-[10px] font-black shadow-xl hover:-translate-y-2 transition-transform cursor-pointer">+2k</div>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-sm font-black text-[#1a1a1a]">Join 2,000+ creators</p>
                    <div className="flex items-center justify-center sm:justify-start gap-1">
                      {[1, 2, 3, 4, 5].map(s => <Sparkles key={s} className="w-3 h-3 fill-[#c4956a] text-[#c4956a]" />)}
                      <span className="text-[10px] font-bold opacity-40 ml-1 uppercase tracking-tighter">Top Rated Vision AI</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div 
            className="relative hidden xl:block perspective-1000 transition-transform duration-300 ease-out"
            style={{ transform: `rotateY(${mousePos.x * 0.5}deg) rotateX(${mousePos.y * -0.5}deg) scale(1)` }}
          >
            <div className="rounded-[48px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border bg-white relative z-10" style={{ borderColor: T.border }}>
              <div className="h-14 flex items-center gap-4 px-8 border-b bg-[#fcfbf9]/80 backdrop-blur-md" style={{ borderColor: T.border }}>
                <div className="flex gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] shadow-inner"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] shadow-inner"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] shadow-inner"></div>
                </div>
                <div className="flex-grow flex justify-center">
                  <div className="h-6 w-full max-w-[280px] rounded-full flex items-center px-4 text-[10px] font-bold opacity-30 tracking-tight" style={{ background: T.border }}>snapscript.ai/workspace</div>
                </div>
              </div>

              <div className="p-12 relative overflow-hidden">
                {isProcessing && (
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-30 flex items-center justify-center">
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#c4956a] to-transparent shadow-[0_0_20px_#c4956a] animate-scan"></div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-3xl bg-white shadow-2xl flex items-center justify-center mb-4 mx-auto animate-bounce">
                        <Wand2 className="w-8 h-8 text-[#c4956a]" />
                      </div>
                      <p className="font-black text-xs uppercase tracking-[0.2em]" style={{ color: T.accent }}>AI Analyzing...</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-[1fr_280px] gap-8 items-start">
                  <div onClick={simulateVision} className="aspect-square w-full rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center gap-6 group cursor-pointer transition-all hover:bg-[#fff9f4] relative overflow-hidden" style={{ borderColor: T.border, background: T.surface }}>
                    <div className="w-20 h-20 rounded-[28px] flex items-center justify-center bg-white shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-transform">
                      <Image className="w-10 h-10" style={{ color: T.accent }} />
                    </div>
                    <div className="text-center group-hover:opacity-80 transition-opacity">
                      <p className="font-black text-base mb-1" style={{ color: T.dark }}>Drop image here</p>
                      <p className="text-xs font-medium opacity-40">Click to test instant captioning</p>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-[#c4956a]/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                  </div>

                  <div className="space-y-6 pt-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${isProcessing ? 'bg-[#c4956a] animate-pulse' : 'bg-black'}`}>
                        <Zap className={`w-4 h-4 fill-current ${isProcessing ? 'text-white' : 'text-[#c4956a]'}`} />
                      </div>
                      <span className="font-black text-[11px] uppercase tracking-[0.2em]" style={{ color: T.dark }}>Gemini Engine</span>
                    </div>

                    <div className={`relative transition-all duration-700 ${showResult ? 'opacity-100 scale-100 translate-y-0' : 'opacity-20 scale-95 translate-y-4'}`}>
                      <div className="absolute -left-3 top-4 w-1 h-12 rounded-full" style={{ background: T.accent }}></div>
                      <div className="rounded-[28px] p-6 text-[13px] leading-relaxed italic font-bold shadow-sm border border-[#e8e0d5] bg-[#fffcf9]" style={{ color: T.mid }}>
                        {showResult ? (
                          <span className="animate-fadeIn">"Golden hour hits different 🌅 Breathe it in. #GoldenHour #VibeCheck #Aesthetic"</span>
                        ) : (
                          <span className="opacity-20">Waiting for your visual input to spark magic...</span>
                        )}
                      </div>
                    </div>

                    <div className={`w-full py-4 rounded-2xl text-white font-black text-xs flex items-center justify-center gap-3 shadow-[0_15px_30px_-10px_rgba(196,149,106,0.6)] transform hover:-translate-y-1 transition-all active:scale-95 cursor-pointer ${showResult ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`} style={{ background: T.accent }}>
                      <Copy className="w-4 h-4" /> Copy Viral Script
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 bg-white rounded-3xl p-5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] border animate-bounce-slow z-20" style={{ borderColor: T.border }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-black text-white shadow-lg">
                  <Zap className="w-5 h-5 fill-current text-[#c4956a]" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 mb-0.5">Latency</p>
                  <p className="text-base font-black text-[#1a1a1a]">0.28s <span className="text-xs opacity-50">⚡</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══════════════════════════════════════════════ */}
      <section id="features" className="pt-32 pb-24 px-8 bg-white overflow-hidden">
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

      {/* ══ HOW IT WORKS ══════════════════════════════════════════════ */}
      <section id="how-it-works" className="pt-32 pb-24 px-8 relative overflow-hidden" style={{ background: T.surface }}>
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

      {/* ══ PRICING ══════════════════════════════════════════════ */}
      <section id="pricing" className="pt-32 pb-32 px-8 bg-white min-h-[80vh] flex items-center">
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

      {/* ══ FOOTER ══════════════════════════════════════════════ */}
      <Footer />
    </div>
  );
};

export default Home;