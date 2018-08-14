"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const port = 8080;
const app = express();
//initialize a simple http server
const server = http.createServer(app);
//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });
// IExtWebSocket typeguard
function isExtended(ws) {
    return typeof ws.isAlive == "boolean";
}
wss.on("connection", (ws) => {
    ws.isAlive = true;
    ws.on("pong", () => {
        ws.isAlive = true;
    });
    ws.on("message", (message) => {
        //log the received message and send it back to the client
        console.log("received: %s", message);
        const broadcastRegex = /^broadcast\:/;
        if (broadcastRegex.test(message)) {
            message = message.replace(broadcastRegex, "");
            //send back the message to the other clients
            wss.clients.forEach(client => {
                if (client != ws) {
                    client.send(`Hello, broadcast message -> ${message}`);
                }
            });
        }
        else {
            ws.send(`Hello, you sent -> ${message}`);
        }
    });
});
setInterval(() => {
    wss.clients.forEach((ws) => {
        if (!isExtended(ws)) {
            return;
        }
        if (!ws.isAlive)
            return ws.terminate();
        ws.isAlive = false;
        ws.ping(null, false);
    });
}, 1000);
//start our server
server.listen(process.env.PORT || port, () => {
    // port resolves to string | WebSocket.AddressInfo if not served over TCP
    const { port } = server.address();
    console.log(`Server started on port ${port} :)`);
});
//# sourceMappingURL=index.js.map