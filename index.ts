import * as debug from "debug";
import * as http from "http";
import * as WebSocket from "ws";
require("dotenv").config();

let test: boolean;
test = process.env.NODE_ENV === "test" ? true : false;
if (process.env.NODE_ENV !== "production") {
  require("longjohn");
  require("cute-stack")("pretty");
}

import Server from "./protocols/HttpServer";
import Socketer from "./protocols/WebSockets";

debug("ts-dash:server");

const port = normalizePort(
  !test ? process.env.PORT || 8080 : process.env.TEST_PORT || 4040
);
Server.set("port", port);

console.log(`Server listening on port ${port}`);

const server = http.createServer(Server);
const socketer = new Socketer(server);

socketer.listen();

// poll connection
setInterval(() => {
  socketer.wss.clients.forEach((ws: WebSocket) => {
    // type guard
    if (!socketer.isExtended(ws)) {
      return;
    }

    // kill polling
    if (!ws.isAlive) {
      console.log("terminated");
      return ws.terminate();
    }

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
    console.log(error);
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
      console.log(error);
  }
}

function onListening(): void {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Listening on ${bind}`);
}
