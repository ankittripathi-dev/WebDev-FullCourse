const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("../models/user.model");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.VITE_API_URL || "http://localhost:3000"}/api/auth/google/callback`,
            proxy: true
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Find existing user by Google ID or Email
                let user = await userModel.findOne({
                    $or: [{ googleId: profile.id }, { email: profile.emails[0].value }],
                });

                if (user) {
                    // If the user registered via email previously without a Google ID, link it now
                    if (!user.googleId) {
                        user.googleId = profile.id;
                        await user.save();
                    }
                    return done(null, user);
                }

                // Create a new user since it doesn't exist
                const newUser = await userModel.create({
                    googleId: profile.id,
                    fullName: profile.displayName,
                    email: profile.emails[0].value,
                });

                return done(null, newUser);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

module.exports = passport;
