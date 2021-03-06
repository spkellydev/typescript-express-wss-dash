import { Schema, model } from "mongoose";
import { genSalt, compare, hash } from "bcrypt";
import { IUserDocument } from "../interfaces/schemas";
import { MongoError } from "mongodb";

/**
 * UserSchema
 * @type Schema
 */
const UserSchema: Schema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  password: String,
  access: String,
  properties: [
    {
      id: String,
      name: String,
      website: String
    }
  ],
  createdAt: Date,
  updatedAt: Date
});

UserSchema.pre<IUserDocument>("save", function(next) {
  const user = this;

  // enter bcrypt
  // generate a salt
  genSalt(10, (err, salt) => {
    if (err) next(err);

    // hash the password with the salt
    hash(user.password, salt, (err, hash) => {
      if (err) next(err);

      // overwrite plaintext password
      user.password = hash;
      next();
    });
  });
});

UserSchema.post<IUserDocument>(
  "save",
  (err: MongoError, doc, next): void => {
    // duplicate key
    if (err.code === 11000) {
      // TODO: Logger
      next(err);
      return;
    }
    next();
  }
);

UserSchema.methods.comparePassword = (
  suppliedPw: string,
  actualPw: string,
  cb: any
): void => {
  compare(suppliedPw, actualPw, (err, isMatch) => {
    if (err) cb(err);

    cb(null, isMatch);
  });
};

export default model("User", UserSchema);
