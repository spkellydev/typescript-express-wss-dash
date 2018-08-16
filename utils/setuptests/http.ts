import Server from "../../protocols/HttpServer";
import * as http from "http";

interface PostRoutes {
  type: string,
  route: string,
  body: any
}

interface TestRoutes {
  get: Array<string>,
  post: Array<PostRoutes>
}

export default class TestServer extends http.Server {
  public server: http.Server;
  public port: number;
  public routes: TestRoutes;

  constructor() {
    super();
    this.port = 4000;
    Server.set("port", this.port);
    this.server = http.createServer(Server);
    // routes list, header slash not needed
    this.routes = {
      get: ["ga"],
      post: [{
        route: "signup",
        type: "signup",
        body: {
          email: "spkellydev@gmail.com",
          password: "1234"
        }
      }]
    };
  }

  public setupServer(): http.Server {
    this.server = http.createServer(Server);
    this.server.listen(this.port);
    return this.server;
  }
}
