import { create } from 'zustand';
import { io, type Socket } from 'socket.io-client';
import { useAuthStore } from './useAuthStore';
import { get } from 'react-hook-form';
import type { SocketState } from '@/types/store';

const baseUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001/';
export const useSocketStore = create<SocketState>((set, get) => ({
    socket: null,
    connectSocket: () => {
        const accessToken = useAuthStore.getState().accessToken;
        const existingSocket = get().socket;
        if (existingSocket) return;
        const socket: Socket = io(baseUrl, {
            auth: { token: accessToken },
            transports: ['websocket']
        })
        set({ socket });
        socket.on('connect', () => {
            console.log(`socket connected with id: ${socket.id}`);
        })
    },
    disconnectSocket: () => {
        const socket = get().socket;
        if (socket) {
            socket.disconnect();
            set({ socket: null });
        }
    }
}))