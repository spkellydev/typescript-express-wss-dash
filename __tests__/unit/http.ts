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

  testServer.routes.get.forEach(route => {
    test(`${route} should respond with 200`, done => {
      request(server)
        .get(`/api/v0/${route}`)
        .then(response => {
          expect(response.status).toBe(200);
          done();
        });
    });
  });

  test("Auth should allow new user to sign up", done => {
    // create random email by
    request(server).post("/api/v0/auth/signup")
      .send({ email: `${Date.now()}@gmail.com`, password: "1234" })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        done()
      })
  })

  testServer.routes.post.forEach(endpoint => {
    switch (endpoint.type) {
      case "signup": {
        test(`Auth ${endpoint.route} should not allow duplicate email addresses`, done => {
          request(server).post(`/api/v0/auth/${endpoint.route}`)
            .send(endpoint.body)
            .expect(422)
            .end((err, res) => {
              if (err) return done(err);
              done();
            });
        });
        break;
      }
      default:
        break;
    }
  })
});
