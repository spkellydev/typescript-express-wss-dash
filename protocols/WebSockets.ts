import * as WebSocket from "ws";
import { Server as HttpServer } from "http";
import { ISocketer, IExtWebSocket } from "../interfaces/sockets";

class Socketer implements ISocketer {
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

  public listen(): void {
    this.wss.on("connection", (ws: IExtWebSocket) => {
      console.log("connected");
      ws.isAlive = true;

      ws.on("pong", () => {
        ws.isAlive = true;
      });

      ws.on("message", this.onMessage);
      ws.on("close", this.onClose);
    });
  }

  public onMessage(message: string, ws: WebSocket): void {
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
  }

  public onClose(): void {
    console.log("disconnect on server");
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
