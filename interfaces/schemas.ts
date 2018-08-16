import { Document } from "mongoose";
/**
 * IUserDocument
 * typedef for user document
 * @extends mongoose.Document
 */
export interface IUserDocument extends Document {
  email: String;
  password: String;
  access?: String;
  properties?: Array<String>;
  createdAt?: String;
  updatedAt?: String;
}
