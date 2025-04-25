import mongoose from "mongoose";

export interface iUser extends mongoose.Document {
  name: string;
  username: string;
  role: "user" | "admin";
  email: string;
  address: string;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model<iUser>("User", userSchema);
export default User;
