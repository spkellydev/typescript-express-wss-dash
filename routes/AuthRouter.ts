import { Router } from "express";
import AuthController from "../controllers/AuthController";
import * as passport from "passport";
import strats from "../services/passport";

passport.use(strats.localLogin);
passport.use(strats.jwtLogin);
const requireSignIn = passport.authenticate("local", { session: false });
const requireAuth = passport.authenticate("jwt", { session: false });

class AuthRouter {
  public router: Router;
  public passportOptions: passport.AuthenticateOptions;
  constructor() {
    this.passportOptions = {
      session: false
    };
    this.router = Router();
    this.Routes();
  }

  public Routes() {
    this.router.post("/signin", requireSignIn, AuthController.SignIn);
    this.router.post("/signup", AuthController.SignUp);
  }
}

const authRoutes = new AuthRouter();
authRoutes.Routes();
export default authRoutes.router;
