const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3002', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

    const io = new Server(httpServer, {
        path: '/api/socket', // Important to match on client side
        addTrailingSlash: false,
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    // Basic Room & Event management for Live Auctions
    io.on('connection', (socket) => {
        console.log('User connected to socket:', socket.id);

        socket.on('join-auction', (auctionId) => {
            socket.join(`auction-${auctionId}`);
            console.log(`Socket ${socket.id} joined room: auction-${auctionId}`);
        });

        socket.on('leave-auction', (auctionId) => {
            socket.leave(`auction-${auctionId}`);
            console.log(`Socket ${socket.id} left room: auction-${auctionId}`);
        });

        // Auctioneer / Admin dispatches an event
        socket.on('auction-action', (data) => {
            // data should have at least { auctionId, type, payload }
            // Broadcast to everyone in the room
            io.to(`auction-${data.auctionId}`).emit('auction-update', data);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    httpServer.listen(port, () => {
        console.log(`> Custom Server Ready on http://${hostname}:${port}`);
    });
});
