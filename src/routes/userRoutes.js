import express from "express";
import passport from "passport";
import {
    getAllUser,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import jwt from "jsonwebtoken"; 
const router = express.Router();

router.get("/user",verifyToken, getAllUser);
router.get("/user/:id", getUserById);
router.post("/user", createUser);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

// Bước 1: Redirect sang trang đăng nhập của Google
router.get(
    "/auth/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        prompt: "select_account",
    })
);

// Bước 2: Google gửi phản hồi về đường dẫn này
router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/api/auth/login-failed",
        session: false,
    }),
    (req, res) => {
        const user = req.user;
        // 2. Tạo JWT Token
        const token = jwt.sign(
            { id: user.id, email: user.email }, // Payload
            process.env.JWT_SECRET || "your_jwt_secret", // Secret key
            { expiresIn: "1d" } // Thời hạn token
        );
        // 3. Trả về JSON chứa Token
        res.status(200).json({
            status: 1,
            message: "Đăng nhập Google thành công!",
            token: token, // Client sẽ lưu token này vào LocalStorage/Cookie
            user: user,
        });
    }
);

// Route báo lỗi nếu login thất bại
router.get("/auth/login-failed", (req, res) => {
    res.status(401).json({ success: false, message: "Đăng nhập thất bại!" });
});
export default router;
