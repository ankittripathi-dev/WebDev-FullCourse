const express = require("express")
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { registerController, loginController, logoutController } = require("../Controllers/auth.controller")

const router = express.Router();


router.post("/register", registerController);

router.post("/login", loginController);

router.post("/logout", logoutController);

// Google OAuth routes
router.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    prompt: "consent select_account", // Forces both consent AND account selection
    accessType: "offline"
}));

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5173"}/login` }),
    (req, res) => {
        // Generate JWT token
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
            expiresIn: "24h"
        });

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // Pass user info back to frontend
        const userObj = {
            fullName: req.user.fullName,
            email: req.user.email,
            id: req.user._id
        };

        const userDataStr = encodeURIComponent(JSON.stringify(userObj));
        res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/login?googleData=${userDataStr}`);
    }
);

module.exports = router;