import React from "react";

const Logo = ({ size = 36, textVisible = true, theme = "dark" }) => {
    const accentColor = "#c4956a";
    const darkColor = "#1a1a1a";

    return (
        <div className="flex items-center gap-3 select-none">
            {/* Icon */}
            <div
                style={{
                    width: size,
                    height: size,
                    background: theme === "dark" ? darkColor : "white",
                    border: theme === "light" ? `1px solid #e8e0d5` : "none"
                }}
                className="rounded-xl flex items-center justify-center shadow-md relative group overflow-hidden"
            >
                <svg
                    width={size * 0.7}
                    height={size * 0.7}
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Wave Script Path 1 (Accent) */}
                    <path
                        d="M10 20Q15 5 20 20T30 20"
                        stroke={accentColor}
                        strokeWidth="5"
                        strokeLinecap="round"
                    />
                    {/* Wave Script Path 2 (Contrast) */}
                    <path
                        d="M15 25Q20 10 25 25T35 25"
                        stroke={theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(26,26,26,0.15)"}
                        strokeWidth="5"
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            {/* Text */}
            {textVisible && (
                <span
                    className="text-lg md:text-xl font-black tracking-tighter"
                    style={{
                        color: theme === "dark" || theme === "light" ? darkColor : "white",
                    }}
                >
                    Snap<span style={{ color: accentColor }}>Script</span>
                </span>
            )}
        </div>
    );
};

export default Logo;
