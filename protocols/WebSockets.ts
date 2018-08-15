import * as WebSocket from "ws";
import { Server as HttpServer } from "http";

/**
 * IExtWebSocket extends WebSocket default functionality
 * @extends WebSocket
 * @property isAlive<boolean>
 * @see isExtended typeguard
 */
interface IExtWebSocket extends WebSocket {
  isAlive: boolean;
}

class Socketer {
  wss: WebSocket.Server;

  constructor(server: HttpServer) {
    /**
     * WebSocket server instance
     * relies on http.createServer,
     * relies on express()
     */
    this.wss = new WebSocket.Server({
      server
    });
  }

  public listen() {
    this.wss.on("connection", (ws: IExtWebSocket) => {
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
          this.wss.clients.forEach(client => {
            if (client != ws) {
              client.send(`Hello, broadcast message -> ${message}`);
            }
          });
        } else {
          ws.send(`Hello, you sent -> ${message}`);
        }
      });
    });
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
  public isExtended(ws: WebSocket): ws is IExtWebSocket {
    return typeof (ws as IExtWebSocket).isAlive == "boolean";
  }
}

export default Socketer;
