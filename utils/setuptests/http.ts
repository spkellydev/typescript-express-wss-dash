import Server from "../../protocols/HttpServer";
import * as http from "http";

export default class TestServer {
  public server: http.Server;
  public port: number;

  constructor() {
    this.port = 4000;
    Server.set("port", this.port);
    this.server = http.createServer(Server);
  }

  public setupServer(): http.Server {
    this.server = http.createServer(Server);
    this.server.listen(this.port);
    return this.server;
  }
}
