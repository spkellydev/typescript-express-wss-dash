/**
 * @package Typescript Express WSS API
 * @summary Server implementation of Analytics Dashboard
 * @version 0.0.0
 */
import * as fs from "fs";
import * as cors from "cors";
import * as logger from "morgan";
import * as helmet from "helmet";
import * as express from "express";
import * as mongoose from "mongoose";
import * as bodyParser from "body-parser";
import * as compression from "compression";

// import routers
import GoogleRouter from "../routes/GoogleRouter";
import AuthRouter from "../routes/AuthRouter";

const dev = process.env.NODE_ENV != "production";

/**
 * @name Server
 * @description Server class handles all the necesary code to bootstrap the express server with middlewares and routes, and connection to database
 * Middlewares: Morgan, BodyParser, Compression, Helmet, Cors
 */
class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  config() {
    const MONGO_URI = "mongodb://localhost:27017/dashboard";
    mongoose.connect(
      MONGO_URI || process.env.MONGODB_URI,
      { useNewUrlParser: true }
    );

    this.app.use(
      logger("common", {
        stream: fs.createWriteStream("./logs/access.log", { flags: "a" })
      })
    );
    this.app.use(logger(dev ? "dev" : "combined"));
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(compression());
    // this.app.use(helmet()); // TODO: Production
    this.app.use(cors());
  }

  public routes() {
    let router: express.Router;
    router = express.Router();

    this.app.use(router); // TODO: version control API
    this.app.use("/api/v0", GoogleRouter);
    this.app.use("/api/v0/auth", AuthRouter);
  }
}

export default new Server().app;
