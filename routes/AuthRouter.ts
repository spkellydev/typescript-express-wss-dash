import { Router, Request, Response, NextFunction } from "express";
import { IUserDocument } from "../interfaces/schemas";
import User from "../models/UserModel";

class AuthRouter {
  router: Router;
  constructor() {
    this.router = Router();
    this.routes();
  }

  public SignUp(req: Request, res: Response, next: NextFunction) {
    let user: IUserDocument;
    let email: string;
    let password: string;
    ({ email, password } = req.body);
    email = email.toLowerCase();

    User.findOne({ email }, (err: Error, existingUser: IUserDocument) => {
      if (err) return next(err);
      if (existingUser) res.status(422).send({ error: true });
      user = new User({
        email,
        password
      }) as IUserDocument;

      user.save((err: Error) => {
        if (err) next(err);
        res.json(user);
      });
    });
  }

  public routes() {
    this.router.post("/signup", this.SignUp);
  }
}

const authRoutes = new AuthRouter();
authRoutes.routes();
export default authRoutes.router;
