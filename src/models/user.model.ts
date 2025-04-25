import mongoose, { Model, Document } from "mongoose";
import bcrypt from "bcrypt";

export type UserRole = "user" | "admin";

// Main user interface extending mongoose.Document
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  username: string;
  role: UserRole;
  email: string;
  address: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for user instance methods
interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Interface for the User model (static methods could go here)
interface IUserModel extends Model<IUser, {}, IUserMethods> {
  // Define any static methods here if needed
  // Example: findByEmail(email: string): Promise<IUser>;
}

// Schema definition
const userSchema = new mongoose.Schema<IUser, IUserModel, IUserMethods>(
  {
    name: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"] as const, // 'as const' for better type inference
      default: "user",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      maxlength: [20, "Password cannot exceed 20 characters"],
      select: false, // Prevents password from being returned in queries by default
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const hash = await bcrypt.hash(this.password, 12);
    this.password = hash;
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (
  this: IUser,
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create the model with proper typing
const User = mongoose.model<IUser, IUserModel>("User", userSchema);

export default User;
