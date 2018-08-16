import * as request from "supertest";
import Server from "../../protocols/HttpServer";
import * as http from "http";

describe("Test Auth Routes", () => {
  let port: number;
  let server: http.Server;

  beforeEach(done => {
    let port = 4000;
    Server.set("port", port);
    server = http.createServer(Server);
    server.listen(port);
    done();
  });

  afterEach(() => {
    server.close();
  });

  test("It should response the GET method", done => {
    request(server)
      .get("/api/v0/auth/signin")
      .then(response => {
        console.log(response.status);
        expect(response.status).toBe(200);
        done();
      });
  });
});
