import { Document, model, Model, Schema } from "mongoose";

export interface iHeroData extends Document {
  id: number;
  title: string;
  highlight: string;
  description: string;
  image: string;
}

export interface iHeroMethods {}

export interface iHeroSchema extends Model<iHeroData, {}, iHeroMethods> {
  // Define any static methods here when needed
  // EG: findAHeroByName(name: string): Promise<iHeroData>;
}

const heroSchema = new Schema<iHeroData, iHeroSchema, iHeroMethods>(
  {
    id: {
      type: Number,
      required: [true, "Hero ID is required"],
      unique: true,
    },
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
  },
  {
    timestamps: true,
  }
);

const Hero = model<iHeroData, iHeroSchema>("Hero", heroSchema);
export default Hero;
