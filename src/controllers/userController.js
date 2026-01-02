import {
    createUserService,
    deleteUserService,
    getAllUsersService,
    getUserByIdService,
    updateUserService,
} from "../models/userModel.js";

// Standardized response function
const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data,
    });
};
export const getAllUser = async (req, res, next) => {
    try {
        const users = await getAllUsersService();
        handleResponse(res, 201, "Users fetched successfully!", users);
    } catch (err) {
        next(err);
    }
};
export const getUserById = async (req, res, next) => {
    try {
        const user = await getUserByIdService(req.params.id);
        if (!user) return handleResponse(res, 404, "User not found");
        handleResponse(res, 201, "User fetched successfully!", user);
    } catch (err) {
        next(err);
    }
};
export const createUser = async (req, res, next) => {
    const { user_name, email } = req.body;
    try {
        const newUser = await createUserService(user_name, email);
        handleResponse(res, 201, "User created successfully!", newUser);
    } catch (err) {
        next(err);
    }
};
export const updateUser = async (req, res, next) => {
    const { user_name, email } = req.body;
    try {
        const user = await updateUserService(req.params.id, user_name, email);
        if (!user) return handleResponse(res, 404, "User not found");
        handleResponse(res, 201, "User updated successfully!", user);
    } catch (err) {
        next(err);
    }
};
export const deleteUser = async (req, res, next) => {
    try {
        const deleteUser = await deleteUserService(req.params.id);
        if (!deleteUser) return handleResponse(res, 404, "User not found");
        handleResponse(res, 201, "User deleted successfully!", deleteUser);
    } catch (err) {
        next(err);
    }
};
