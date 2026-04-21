import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const socketAuthMiddleware = async (socket, next) => {
    try {
        const token =
            socket.handshake.auth?.accessToken ||
            socket.handshake.auth?.token;

        if (!token) {
            return next(new Error("Unauthorized - Token kh�ng t?n t?i"));
        }

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET
        );

        if (!decoded) {
            return next(new Error("Unauthorized - Token kh�ng h?p l? ho?c d� h?t h?n"));
        }

        const userId = decoded.userId || decoded.id;
        const user = await User.findById(userId).select("-hashedPassword -hashPassword");

        if (!user) {
            return next(new Error("User kh�ng t?n t?i"));
        }

        socket.user = user;
        next();
    } catch (error) {
        console.error("L?i khi verify JWT trong socketMiddleware", error);
        next(new Error("Unauthorized"));
    }
};
