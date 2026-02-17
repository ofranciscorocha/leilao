
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3001;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer);

    // Auction State (In-Memory for low latency)
    // [auctionId]: { currentLotId: string, endTime: number, bids: [] }
    const auctionState: any = {};

    io.on("connection", (socket) => {
        // console.log("Client connected", socket.id);

        socket.on("join_auction", (auctionId) => {
            socket.join(auctionId);
            // Send current state to joiner
            if (auctionState[auctionId]) {
                socket.emit("auction_update", auctionState[auctionId]);
            }
        });

        socket.on("place_bid", (data) => {
            // data: { auctionId, lotId, amount, userId, userName }
            // TODO: Validate bid against DB/Current Price
            const { auctionId, lotId, amount, userName } = data;

            // Simple mock logic for now
            if (!auctionState[auctionId]) auctionState[auctionId] = {};

            auctionState[auctionId].lastBid = { amount, userName, time: Date.now() };

            // Overtime Logic: If bid is within last 15 seconds, add 30 seconds
            const now = Date.now();
            const endTime = auctionState[auctionId].endTime || (now + 60000); // Default 1 min if not set

            if (endTime - now < 15000) {
                auctionState[auctionId].endTime = now + 30000; // Reset to 30s
                io.to(auctionId).emit("timer_update", { endTime: auctionState[auctionId].endTime, reason: "OVERTIME" });
            }

            io.to(auctionId).emit("bid_placed", { amount, userName, lotId });
            io.to(auctionId).emit("auction_update", auctionState[auctionId]);
        });

        socket.on("admin_command", (data) => {
            // Handle Hammer, Pause, Next Lot from Admin
            io.to(data.auctionId).emit("admin_event", data);
        });
    });

    // Bridge: API Endpoint to trigger Socket Events from Next.js Server Actions
    // @ts-ignore
    httpServer.on("request", (req, res) => {
        if (req.url?.startsWith("/api/socket-notify") && req.method === "POST") {
            let body = "";
            req.on("data", (chunk) => {
                body += chunk.toString();
            });
            req.on("end", () => {
                try {
                    const { event, roomId, data } = JSON.parse(body);
                    if (roomId) {
                        io.to(roomId).emit(event, data);
                    } else {
                        io.emit(event, data);
                    }
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true }));
                } catch (e) {
                    res.writeHead(500);
                    res.end(JSON.stringify({ error: "Invalid JSON" }));
                }
            });
        }
    });

    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});
