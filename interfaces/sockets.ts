import * as WebSocket from "ws";
/**
 * IExtWebSocket extends WebSocket default functionality
 * @extends WebSocket
 * @property isAlive<boolean>
 * @see isExtended typeguard
 */
export interface IExtWebSocket extends WebSocket {
  isAlive: boolean;
}

/**
 * @name ISocketer
 * @description interface for implementing the ISocketer class. Defines that messages must be able to be recieived and the server must liten
 */
export interface ISocketer {
  wss: WebSocket.Server;
  listen(): void;
  onMessage(message: String, ws: WebSocket): void;
}
