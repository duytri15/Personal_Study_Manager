import express from "express";
import passport from "passport";
import {
    getAllUser,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/user", getAllUser);
router.get("/user/:id", getUserById);
router.post("/user", createUser);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

// Bước 1: Redirect sang trang đăng nhập của Google
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'],prompt: 'select_account' }));

// Bước 2: Google gửi phản hồi về đường dẫn này
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/api/auth/login-failed' }),
  (req, res) => {
    // Thay vì res.redirect(...), bạn trả về JSON
    res.status(200).json({
        success: true,
        message: "Đăng nhập thành công!",
        user: req.user // Trả về thông tin user đã lưu trong DB
    });
  }
);

// Route báo lỗi nếu login thất bại
router.get('/auth/login-failed', (req, res) => {
    res.status(401).json({ success: false, message: "Đăng nhập thất bại!" });
});
export default router;
