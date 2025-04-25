import mongoose from "mongoose";
import bcrypt from "bcrypt";
export interface iUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  username: string;
  role: "user" | "admin";
  email: string;
  address: string;
  password: string;
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
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 20,
    },
  },
  { timestamps: true }
);

// Hash password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // Hash the password using bcrypt or any other hashing library
  const hash = await bcrypt.hash(this.password, 12);
  this.password = hash;
});

const User = mongoose.model<iUser>("User", userSchema);
export default User;
