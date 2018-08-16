import { Router, Request, Response, NextFunction } from "express";

class AuthRouter {
  router: Router;
  constructor() {
    this.router = Router();
    this.routes();
  }

  public SignIn(req: Request, res: Response, next: NextFunction) {
    res.send({ success: true });
  }

  public routes() {
    this.router.get("/signin", this.SignIn);
  }
}

const authRoutes = new AuthRouter();
authRoutes.routes();
export default authRoutes.router;
