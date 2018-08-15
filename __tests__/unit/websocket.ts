import { Server } from "mock-socket";
import test from "ava";
// let url: string;
url = "ws://localhost:8080";
const mockServer = new Server(url);

jest.useFakeTimers();

const msgs = [];

describe("Websockets", () => {
  // beforeEach(done => {
  //   mockServer.on("connection", (socket: Socket) => {
  //     socket.send("message");
  //   });
  // });

  // afterEach(() => {
  //   let closer: CloseOptions;
  //   closer = {
  //     code: 0,
  //     reason: "disconnected",
  //     wasClean: true
  //   };
  //   mockServer.close(closer);
  // });

  test.cb("that chat app can be mocked", t => {
    const fakeURL = "ws://localhost:8080";
    const mockServer = new Server(fakeURL);

    mockServer.on("connection", socket => {
      socket.on("message", data => {
        t.is(
          data,
          "test message from app",
          "we have intercepted the message and can assert on it"
        );
        socket.send("test message from mock server");
      });
    });
  });
  // const ws = new Socket(url);
  // ws.onmessage = async msg => {
  //   await msg;
  //   console.log(msg);
  //   msgs.push(msg);

  //   return msgs;
  // };

  // console.log(msgs);

  // jest.runOnlyPendingTimers();
  // done();
});
