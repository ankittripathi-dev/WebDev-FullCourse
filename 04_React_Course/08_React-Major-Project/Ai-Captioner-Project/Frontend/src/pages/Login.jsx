import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, ArrowRight, Zap, ChevronLeft, Mail, Lock, Sparkles, Wand2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

const T = {
  bg: "#fafafa", surface: "#f5f0eb", dark: "#1a1a1a",
  mid: "#4a4a4a", muted: "#9a9a9a", accent: "#c4956a",
  accentHover: "#b5845a", border: "#e8e0d5"
};

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const location = window.location;

  React.useEffect(() => {
    // Check if there is data coming back from Google OAuth via URL arguments
    const params = new URLSearchParams(location.search);
    const googleData = params.get("googleData");

    if (googleData) {
      try {
        const userObj = JSON.parse(decodeURIComponent(googleData));
        localStorage.setItem("user", JSON.stringify(userObj));
        if (onLoginSuccess) onLoginSuccess();
        navigate("/captions-by-image");
      } catch (err) {
        console.error("Failed to parse google data", err);
      }
    }
  }, [location.search, navigate, onLoginSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Attempting login with:", formData.email);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, formData, { withCredentials: true });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (onLoginSuccess) onLoginSuccess();
      navigate("/captions-by-image");
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch bg-[#fafafa] relative" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── EXTREME LEFT BUTTON ── */}
      <button onClick={() => navigate("/home")}
        className="fixed top-6 left-6 md:top-10 md:left-10 z-[100] flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
        style={{ color: T.dark }}>
        <ChevronLeft className="w-4 h-4" /> <span className="hidden sm:inline">Back to Home</span><span className="sm:hidden">Home</span>
      </button>

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex w-[45%] relative flex-col justify-center p-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none"
          style={{ background: `radial-gradient(circle at 0% 0%, rgba(196,149,106,0.15) 0%, transparent 70%)` }}></div>

        <div className="relative z-10 max-w-sm">
          <div className="mb-12">
            <Logo textVisible={false} size={54} />
          </div>

          <div className="space-y-6">
            <h1 className="text-6xl font-black leading-[1.05] tracking-tight text-[#1a1a1a]">
              Sign in to <span className="block" style={{ color: T.accent }}>SnapScript</span>
            </h1>
            <p className="text-lg font-medium leading-relaxed text-[#4a4a4a] opacity-80">
              Turn your images into viral content with the most powerful AI caption engine ever built.
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 relative py-6 overflow-y-auto">
        <div className="w-full max-w-[480px] animate-fadeUp my-auto">
          <div className="bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-10 border border-[#e8e0d5] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)]">
            <div className="mb-6 text-center">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2" style={{ color: T.dark }}>Welcome Back</h2>
              <p className="font-medium text-xs md:text-sm text-[#9a9a9a]">Access your intelligent studio space.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-[0.15em] ml-1 text-[#9a9a9a]">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors group-focus-within:text-[#c4956a]" style={{ color: T.muted }} />
                  <input
                    required
                    type="email"
                    placeholder="name@example.com"
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 outline-none transition-all font-bold text-[14px]"
                    style={{ background: "#fff", borderColor: T.border }}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    onFocus={e => e.target.style.borderColor = T.accent}
                    onBlur={e => e.target.style.borderColor = T.border}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-1 pr-1">
                  <label className="text-[11px] font-black uppercase tracking-[0.15em] text-[#9a9a9a]">Password</label>
                  <button type="button" className="text-[11px] font-black uppercase tracking-[0.15em]" style={{ color: T.accent }}>Forgot?</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors group-focus-within:text-[#c4956a]" style={{ color: T.muted }} />
                  <input
                    required
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3.5 rounded-2xl border-2 outline-none transition-all font-bold text-[14px]"
                    style={{ background: "#fff", borderColor: T.border }}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    onFocus={e => e.target.style.borderColor = T.accent}
                    onBlur={e => e.target.style.borderColor = T.border}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity">
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button disabled={loading} type="submit"
                className="w-full h-12 rounded-2xl font-black text-base text-white shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-4"
                style={{ background: T.dark }}>
                {loading ? <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" /> : <><ArrowRight className="w-4 h-4" /> Access Dashboard</>}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="h-px bg-[#e8e0d5] flex-1"></div>
              <span className="text-xs font-black uppercase tracking-widest text-[#9a9a9a]">OR</span>
              <div className="h-px bg-[#e8e0d5] flex-1"></div>
            </div>

            <button
              onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`}
              className="mt-5 w-full h-12 rounded-2xl font-bold text-[14px] border-2 flex items-center justify-center gap-2 transition-all hover:bg-[#fafafa] active:scale-95"
              style={{ borderColor: T.border, color: T.dark }}>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
              Continue with Google
            </button>

            <p className="mt-6 text-center text-sm font-medium text-[#9a9a9a]">
              Don't have an account?{" "}
              <button onClick={() => navigate("/signup")} className="font-black" style={{ color: T.accent }}>Join the Hub</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
