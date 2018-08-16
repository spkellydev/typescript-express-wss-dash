import Server from "../../protocols/HttpServer";
import * as http from "http";

export default class TestServer extends http.Server {
  public server: http.Server;
  public port: number;
  public routes: Array<String>;

  constructor() {
    super();
    this.port = 4000;
    Server.set("port", this.port);
    this.server = http.createServer(Server);
    // routes list, header slash not needed
    this.routes = ["auth/signin", "ga"];
  }

  public setupServer(): http.Server {
    this.server = http.createServer(Server);
    this.server.listen(this.port);
    return this.server;
  }
}
