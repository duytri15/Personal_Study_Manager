import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import errorHandling from "./middlewares/errorHandler.js";
import passport from "passport"; // Import từ thư viện gốc
import "./config/passport.js";   // Import file cấu hình để nó chạy
import session from "express-session";

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

// 1. Parser Middlewares
app.use(express.json());

// 2. CORS (Sửa lại để nhận được Cookie)
app.use(cors({
    origin: true, // Cho phép tất cả trong lúc test, hoặc điền domain cụ thể
    credentials: true
}));

// 3. Session Config (Phải đứng trước Passport)
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'study_planner_secret_key', 
        resave: false,
        saveUninitialized: false, // Để false để tránh tạo session rác
        cookie: {
            secure: process.env.NODE_ENV === 'production', // Chỉ bật true khi dùng HTTPS
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 ngày
        }
    })
);

// 4. Passport Middlewares
app.use(passport.initialize());
app.use(passport.session());

// 5. Routes
app.use("/api", userRoutes);

// 6. Testing Root
app.get("/", async (req, res) => {
    try {
        const result = await pool.query("Select current_database()");
        res.send(`The database name is ${result.rows[0].current_database}`);
    } catch (err) {
        res.status(500).send("Database connection error");
    }
});

// 7. Error handling (Luôn để cuối cùng)
app.use(errorHandling);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});