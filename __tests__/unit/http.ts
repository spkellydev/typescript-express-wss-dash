import * as request from "supertest";
import * as http from "http";
import TestServer from "../../utils/setuptests/http";

let testServer: TestServer;
testServer = new TestServer();
describe("Test API Routes", () => {
  let server: http.Server | TestServer;

  beforeEach(done => {
    server = testServer.setupServer();
    done();
  });

  afterEach(done => {
    server.close();
    done();
  });

  testServer.routes.forEach(route => {
    test(`${route} should respond with 200`, done => {
      request(server)
        .get(`/api/v0/${route}`)
        .then(response => {
          expect(response.status).toBe(200);
          done();
        });
    });
  });
});
