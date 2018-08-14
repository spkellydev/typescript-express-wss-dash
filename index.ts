/**
 * @package Typescript Express WSS API
 * @summary Server implementation of Analytics Dashboard
 */
import * as express from "express";
import * as http from "http";
import * as WebSocket from "ws";
const port = 8080;

const app = express();

/**
 * (alias) server
 * relies on http.createServer,
 * relies on expreess()
 * initialize a simple http server
 */
const server = http.createServer(app);

/**
 * WebSocket server instance
 * relies on http.createServer,
 * relies on express()
 */
const wss = new WebSocket.Server({ server });

/**
 * IExtWebSocket extends WebSocket default functionality
 * @extends WebSocket
 * @property isAlive<boolean>
 * @see isExtended typeguard
 */
interface IExtWebSocket extends WebSocket {
  isAlive: boolean;
}

/**
 * isExtended
 * checks for ws typed as IExtWebSocket and returns correct typing
 * necessary for iterating over Sets of WebSockets
 * @param ws <WebSocket>
 * @example wss.clients.forEach((ws: WebSocket) => {
 *  if(!isExtend(ws)) return
 *  if (!ws.isAlive) return ws.terminate();
 * })
 */
function isExtended(ws: WebSocket): ws is IExtWebSocket {
  return typeof (ws as IExtWebSocket).isAlive == "boolean";
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

// poll connection
setInterval(() => {
  wss.clients.forEach((ws: WebSocket) => {
    // type guard
    if (!isExtended(ws)) {
      return;
    }

    // kill polling
    if (!ws.isAlive) return ws.terminate();

    ws.isAlive = false;
    ws.ping(null, false);
  });
}, 1000).unref(); // allow server to disconnect

//start our server
server.listen(process.env.PORT || port, () => {
  // port resolves to string | WebSocket.AddressInfo if not served over TCP
  const { port } = server.address() as WebSocket.AddressInfo;
  console.log(`Server started on port ${port} :)`);
});
