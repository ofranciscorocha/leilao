'use client'

import { io } from 'socket.io-client'

export const socket = io({
    path: '/api/socket/io',
    addTrailingSlash: false,
    transports: ['polling', 'websocket'], // Force polling first for better compatibility
    reconnection: true,
})
