/**
 * @package Typescript Express WSS API
 * @summary Server implementation of Analytics Dashboard
 * @version 0.0.0
 */
import * as cors from "cors";
import * as http from "http";
import * as logger from "morgan";
import * as helmet from "helmet";
import * as WebSocket from "ws";
import * as express from "express";
import * as mongoose from "mongoose";
import * as bodyParser from "body-parser";
import * as compression from "compression";

const dev = process.env.NODE_ENV != "production";

class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  config() {
    const MONGO_URI = "mongodb://localhost:27017/dashboard";
    mongoose.connect(
      MONGO_URI || process.env.MONGODB_URI,
      { useNewUrlParser: true }
    );

    this.app.use(logger(dev ? "dev" : "combined"));
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(compression());
    this.app.use(helmet());
    this.app.use(cors());
  }

  public routes() {
    let router: express.Router;
    router = express.Router();

    this.app.use("/", router);
  }
}

export default new Server().app;

const PORT = 8080;

const app = express();

/**
 * (alias) server
 * relies on http.createServer,
 * relies on express()
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

//start our server
server.listen(process.env.PORT || PORT, () => {
  // port resolves to string | WebSocket.AddressInfo if not served over TCP
  const { port } = server.address() as WebSocket.AddressInfo;
  console.log(`Server started on port ${port} :)`);
});
