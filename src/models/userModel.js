import pool from "../config/db.js";
import generateRandomId from "../utils/idGenerator.js";

export const getAllUsersService = async () => {
    const result = await pool.query("Select * from users");
    return result.rows;
};
export const getUserByIdService = async (id) => {
    const result = await pool.query("select * from users where id=$1", [id]);
    return result.rows[0];
};
export const createUserService = async (user_name, email) => {
    let id;
    let isExisted = true;
    while (isExisted) {
        id = generateRandomId();
        const checkResult = await pool.query(
            "select id from users where id=$1",
            [id]
        );
        if (checkResult.rows.length === 0) {
            isExisted = false;
        }
    }
    const result = await pool.query(
        "Insert into users (id, user_name, email, status) values ($1, $2, $3, 1) RETURNING *",
        [id, user_name, email]
    );
    return result.rows[0];
};
export const updateUserService = async (id, user_name, email) => {
    const result = await pool.query(
        "update users SET user_name=$1, email=$2 where id=$3 RETURNING *",
        [user_name, email, id]
    );
    return result.rows[0];
};
export const deleteUserService = async (id) => {
    const result = await pool.query(
        "Delete from users where id = $1 RETURNING *",
        [id]
    );
    return result.rows[0];
};

// Đăng nhập bằng google
export const findOrCreateGoogleUser = async (googleId, email, name) => {
    // 1. Kiểm tra xem user đã tồn tại qua google_id chưa
    const result = await pool.query(
        "SELECT * FROM users WHERE google_id = $1",
        [googleId]
    );

    if (result.rows.length > 0) {
        return result.rows[0];
    }
    // 2. Nếu chưa có, tạo user mới với status = 1 (mặc định như bạn muốn)
    const newId = generateRandomId(); // Hàm 10 số ngẫu nhiên bạn đã viết
    const newUser = await pool.query(
        "INSERT INTO users (id, google_id, email, user_name, status) VALUES ($1, $2, $3, $4, 1) RETURNING *",
        [newId, googleId, email, name]
    );
    return newUser.rows[0];
};
