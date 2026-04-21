import { Server } from "socket.io";
import http, { get } from 'http';
import express from 'express';
import { socketAuthMiddleware } from "../middlewares/socketMiddleware.js";
import { getConversationIdsForSocketIo } from "../controllers/conversationController.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true
    }
})
io.use(socketAuthMiddleware);
const onlineUsers = new Map();
io.on('connection', async (socket) => {
    const user = socket.user;
    console.log(`socket with id: ${socket.id} connected, user: ${user.displayName}`);
    socket.join(`user:${user._id.toString()}`);
    onlineUsers.set(user._id, socket.id);
    io.emit('online-users', Array.from(onlineUsers.keys()));

    const conversationIds = await getConversationIdsForSocketIo(user._id);
    conversationIds.forEach((id) => {
        socket.join(id);
    })
    socket.on('disconnect', () => {
        console.log(`socket with id: ${socket.id} disconnected`);
        onlineUsers.delete(user._id);
        io.emit('online-users', Array.from(onlineUsers.keys()));
    })
})
export { io, app, server };
