import * as request from "supertest";
import * as http from "http";
import TestServer from "../../utils/setuptests/http";
import * as atob from "jwt-simple";
import User from "../../models/UserModel";
import { IUserDocument } from "../../interfaces/schemas";

let testServer: TestServer;
testServer = new TestServer();
describe("Test API Routes", () => {
  let server: http.Server | TestServer;

  beforeEach(() => {
    server = testServer.setupServer();
    return server;
  });

  afterEach(() => {
    return server.close();
  });

  testServer.routes.forEach(route => {
    test(`${route} should respond with 200`, async done => {
      request(server)
        .get(`/api/v0/${route}`)
        .then(response => {
          expect(response.status).toBe(200);
          done();
        });
    });
  });

  test("User can sign up", done => {
    let email = `${new Date().getTime()}@gmail.com`;
    request(server)
      .post("/api/v0/auth/signup")
      .send({
        email: email,
        password: "1234"
      })
      .expect(200)
      .end(async (err, res) => {
        if (err) return done(err);
        let { token } = await res.body;
        try {
          let decoded = atob.decode(token, "your_jwt_secret");

          User.findOne(
            { id: decoded.sub },
            (err: Error, user: IUserDocument) => {
              if (err) return done(err);
              expect(user).toHaveProperty("email");
              expect(user.email).toEqual(email);
            }
          );
        } catch (err) {
          return done(err);
        }
        done();
      });
  });
});
