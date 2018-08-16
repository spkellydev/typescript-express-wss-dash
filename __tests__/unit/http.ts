import * as request from "supertest";
import * as http from "http";
import TestServer from "../../utils/setuptests/http";

describe("Test Auth Routes", () => {
  let server: http.Server;

  beforeEach(done => {
    const testServer = new TestServer();
    server = testServer.setupServer();
    done();
  });

  afterEach(done => {
    server.close();
    done();
  });

  test("Sign In route should respond with 200", done => {
    request(server)
      .get("/api/v0/auth/signin")
      .then(response => {
        expect(response.status).toBe(200);
        done();
      });
  });
});
