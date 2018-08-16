import { IUserDocument } from "../interfaces/schemas";
import User from "../models/UserModel";
import { Request, Response, NextFunction } from "express";

class AuthController {
  public SignUp(req: Request, res: Response, next: NextFunction) {
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
        res.json(user);
      });
    });
  }
}
const authController = new AuthController();
export default authController;
