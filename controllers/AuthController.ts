import { IUserDocument } from "../interfaces/schemas";
import User from "../models/UserModel";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jwt-simple";
require("dotenv").config();

class AuthController {
  /**
   * Token For User generates a JWT token if supplied an object with an ID propety on it
   * @method protected
   * @param user is required to know which user the JWT payload is assigned to
   */
  protected tokenForUser(user: IUserDocument) {
    const timestamp = new Date().getTime();
    return jwt.encode(
      { sub: user.id, iat: timestamp },
      process.env.JWT_SECRET || "dummy_secret"
    );
  }

  // user has been authenticated by passport service, needs token
  public SignIn = (req: Request, res: Response, next: NextFunction) => {
    console.log("init authcontroller");
    res.send({ token: this.tokenForUser(req.user) });
  };

  public SignUp = (req: Request, res: Response, next: NextFunction) => {
    let user: IUserDocument;
    let email: string;
    let password: string;
    ({ email, password } = req.body);
    email = email.toLowerCase();

    User.findOne({ email }, (err: Error, existingUser: IUserDocument) => {
      if (err) return next(err);
      if (existingUser) return res.status(422).send({ error: true });
      user = new User({
        email,
        password
      }) as IUserDocument;

      user.save((err: Error) => {
        if (err) next(err);
        // generate the JWT if the user is successfully added
        const token = this.tokenForUser(user);
        res.json({ token });
      });
    });
  };
}
const authController = new AuthController();
export default authController;
