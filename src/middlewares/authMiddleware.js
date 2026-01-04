import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1]; // Lấy token từ header "Bearer <token>"

    if (!token) {
        return res
            .status(403)
            .json({ message: "Không có token, quyền truy cập bị từ chối!" });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "your_jwt_secret"
        );
        req.user = decoded; // Lưu thông tin giải mã được vào req để dùng sau
        next();
    } catch (err) {
        return res
            .status(401)
            .json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    }
};
