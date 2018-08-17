import { Document } from "mongoose";
/**
 * IUserDocument
 * typedef for user document
 * @extends mongoose.Document
 */
export interface IUserDocument extends Document {
  email: string;
  password: string;
  id?: string;
  access?: string;
  properties?: Array<string>;
  createdAt?: string;
  updatedAt?: string;
}
