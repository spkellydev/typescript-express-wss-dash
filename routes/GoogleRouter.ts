import { Router, Request, Response, NextFunction } from "express";
import User from "../models/UserModel";

class GoogleRouter {
  router: Router;
  constructor() {
    this.router = Router();
    this.routes();
  }

  public GetData(req: Request, res: Response, next: NextFunction): void {
    const code = res.statusCode;
    res.status(code).json({
      data: "data"
    });
  }

  routes() {
    this.router.get("/ga", this.GetData);
  }
}

const googleRoutes = new GoogleRouter();
googleRoutes.routes();
export default googleRoutes.router;
