import * as express from "express";
import * as http from "http";
import * as WebSocket from "ws";
const port = 8080;

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

interface IExtWebSocket extends WebSocket {
  isAlive: boolean;
}

// IExtWebSocket typeguard
function isExtended(ws: WebSocket): ws is IExtWebSocket {
  return typeof (ws as any).isAlive == "boolean";
}

wss.on("connection", (ws: IExtWebSocket) => {
  ws.isAlive = true;

  ws.on("pong", () => {
    ws.isAlive = true;
  });

  ws.on("message", (message: string) => {
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
    } else {
      ws.send(`Hello, you sent -> ${message}`);
    }
  });
});

setInterval(() => {
  wss.clients.forEach((ws: WebSocket) => {
    if (!isExtended(ws)) {
      return;
    }

    if (!ws.isAlive) return ws.terminate();

    ws.isAlive = false;
    ws.ping(null, false);
  });
}, 1000);

//start our server
server.listen(process.env.PORT || port, () => {
  // port resolves to string | WebSocket.AddressInfo if not served over TCP
  const { port } = server.address() as WebSocket.AddressInfo;
  console.log(`Server started on port ${port} :)`);
});
