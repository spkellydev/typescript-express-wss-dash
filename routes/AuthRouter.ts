import { Router } from "express";
import AuthController from "../controllers/AuthController";

class AuthRouter {
  router: Router;
  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes() {
    this.router.post("/signup", AuthController.SignUp);
  }
}

const authRoutes = new AuthRouter();
authRoutes.routes();
export default authRoutes.router;
