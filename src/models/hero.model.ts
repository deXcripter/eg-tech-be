import { Document, model, Model, Schema } from "mongoose";

export interface iHeroData extends Document {
  title: string;
  highlight: string;
  description: string;
  image: string;
  link?: string; // Optional field for a link
  createdAt?: Date; // Optional field for createdAt, will be managed by Mongoose
  updatedAt?: Date; // Optional field for updatedAt, will be managed by Mongoose
}

export interface iHeroMethods {}

export interface iHeroSchema extends Model<iHeroData, {}, iHeroMethods> {
  // Define any static methods here when needed
  // EG: findAHeroByName(name: string): Promise<iHeroData>;
}

const heroSchema = new Schema<iHeroData, iHeroSchema, iHeroMethods>(
  {
    title: {
      type: String,
      required: [true, "Hero title is required"],
      trim: true,
    },
    highlight: {
      type: String,
      required: [true, "Hero highlight is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Hero description is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Hero image is required"],
    },
    link: {
      type: String,
      trim: true,
      default: "", // Default to an empty string if no link is provided
    },
  },
  {
    timestamps: true,
  }
);

const Hero = model<iHeroData, iHeroSchema>("Hero", heroSchema);
export default Hero;
