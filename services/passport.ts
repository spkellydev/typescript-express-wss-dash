import * as passport from "passport";
import User from "../models/UserModel";
import { IUserDocument } from "../interfaces/schemas";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions
} from "passport-jwt";
import { Strategy as LocalStrategy, IStrategyOptions } from "passport-local";

const localOptions: IStrategyOptions = { usernameField: "email" };

const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  User.findOne({ email }, (err: Error, user: IUserDocument) => {
    if (err) return done(err);
    if (!user) return done(null, false);
    // call on mongoose schema methods
    user.schema.methods.comparePassword(
      password,
      user.password,
      (err: Error, isMatch: boolean) => {
        if (err) return done(err);
        if (!isMatch) return done(null, false);
        return done(null, user);
      }
    );
  });
});

// Setup options for JWT strategies
// TODO: Fix secret for production
const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: "your_jwt_secret"
};

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  // see if the user ID in payload exists in db
  User.findById({ id: payload.sub }, (err: Error, user: IUserDocument) => {
    if (err) return done(err, false);
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

let strats = {
  localLogin,
  jwtLogin
};
// Employ passport to use these strategies
export default strats;
