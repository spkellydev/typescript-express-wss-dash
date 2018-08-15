import * as debug from "debug";
import * as http from "http";
import * as logger from "morgan";
import * as helmet from "helmet";
import * as WebSocket from "ws";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

import Server from "./server";

debug("ts-dash:server");

const port = normalizePort(process.env.PORT || 8080);
Server.set("port", port);

console.log(`Server listening on port ${port}`);

const server = http.createServer(Server);

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
 * @since 0.0.0
 * @version 0.0.0
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

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function normalizePort(val: number | string): number | string | boolean {
  const port: number = typeof val === "string" ? parseInt(val, 10) : val;
  if (isNaN(port)) {
    return val;
  } else if (port >= 0) {
    return port;
  } else {
    return false;
  }
}

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening(): void {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Listening on ${bind}`);
}
