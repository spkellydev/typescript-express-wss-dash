import { Schema, Document, model } from "mongoose";
import { genSalt, compare, hash } from "bcrypt";

/**
 * IUserDocument
 * typedef for user document
 * @extends mongoose.Document
 */
export interface IUserDocument extends Document {
  email: String;
  password: String;
  access: String;
  properties: Array<String>;
  createdAt: String;
  updatedAt: String;
}

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

UserSchema.methods.comparePassword = (
  suppliedPw: String,
  actualPw: string,
  cb: any
) => {
  compare(suppliedPw, actualPw, (err, isMatch) => {
    if (err) cb(err);

    cb(null, isMatch);
  });
};

export default model("User", UserSchema);
