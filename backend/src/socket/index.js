import { Server } from "socket.io";
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        creadentails: true
    }
})
io.on('connection', async (socket) => {
    console.log(`socket connected with id: ${socket.id}`);
    socket.on('disconnect', () => {
        console.log(`socket with id: ${socket.id} disconnected`);
    })
})
export { io, app, server };