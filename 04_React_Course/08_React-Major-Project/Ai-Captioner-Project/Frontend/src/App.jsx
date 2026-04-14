import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ImageCaptioner from "./pages/ImageCaptioner";

const App = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      navigate("/captions-by-image");
    }
  };

  const handleSignupSuccess = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      navigate("/captions-by-image");
    } else {
      navigate("/login");
    }
  };

  const handleLogout = async () => {
    try {
      // Clear backend cookie
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Always clear local state
      localStorage.removeItem("user");
      setUser(null);
      navigate("/home");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#fafafa", fontFamily: "'Inter', sans-serif" }}>
        <div className="text-center">
          <div className="relative w-14 h-14 mx-auto mb-8">
            <div className="absolute inset-0 border-4 rounded-full" style={{ borderColor: "#e8e0d5" }}></div>
            <div className="absolute inset-0 border-4 border-t-transparent rounded-full animate-spin" style={{ borderTopColor: "transparent", borderColor: "#c4956a #c4956a #c4956a transparent" }}></div>
          </div>
          <div className="flex items-center gap-2.5 justify-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl animate-pulse" style={{ background: "#1a1a1a" }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 20Q15 5 20 20T30 20" stroke="#c4956a" strokeWidth="5" strokeLinecap="round" />
                <path d="M15 25Q20 10 25 25T35 25" stroke="rgba(255,255,255,0.2)" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-black text-xl tracking-tight" style={{ color: "#1a1a1a" }}>
              Snap<span style={{ color: "#c4956a" }}>Script</span>
            </span>
          </div>
          <p className="text-sm font-medium mt-3 uppercase tracking-widest" style={{ color: "#9a9a9a" }}>Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Default route redirects to /home */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* Home Landing Page at /home */}
      <Route
        path="/home"
        element={
          user ? <Navigate to="/captions-by-image" replace /> : <Home />
        }
      />

      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/captions-by-image" replace />
          ) : (
            <Login onLoginSuccess={handleLoginSuccess} />
          )
        }
      />

      <Route
        path="/signup"
        element={
          user ? (
            <Navigate to="/captions-by-image" replace />
          ) : (
            <Signup onSignupSuccess={handleSignupSuccess} />
          )
        }
      />

      {/* Protected Image Captioner UI at /captions-by-image */}
      <Route
        path="/captions-by-image"
        element={
          user ? (
            <ImageCaptioner
              onLogout={handleLogout}
              user={user}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default App;



