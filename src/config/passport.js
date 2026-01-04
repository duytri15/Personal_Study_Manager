import passport from "passport";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { findOrCreateGoogleUser } from "../models/userModel.js";

const formatDisplayName = (name) => {
    return name
        .normalize("NFD") // Tách dấu ra khỏi chữ cái
        .replace(/[\u0300-\u036f]/g, "") // Xóa các dấu vừa tách
        .replace(/đ/g, "d") // Xử lý chữ đ
        .replace(/Đ/g, "D")
        .trim() // Xóa khoảng trắng thừa ở đầu/cuối
        .replace(/\s+/g, "_"); // Thay thế khoảng trắng ở giữa bằng dấu gạch dưới
};
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/api/auth/google/callback",
            proxy: true,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const formattedName = formatDisplayName(profile.displayName);
                const user = await findOrCreateGoogleUser(
                    profile.id,
                    profile.emails[0].value,
                    formattedName
                );
                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

// Lưu thông tin user vào session
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    done(null, result.rows[0]);
});

export default passport;
