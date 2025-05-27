import { model, Schema } from "mongoose";
import { Model } from "mongoose";
import { Types } from "mongoose";
import slug from "slugify";

export interface iCategory {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface iCategoryMethods {}

export interface iCategoryModel
  extends Model<iCategory, {}, iCategoryMethods> {}

const categorySchema = new Schema<iCategory, iCategoryModel, iCategoryMethods>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: [true, "Category description is required"],
      trim: true,
    },

    coverImage: {
      type: String,
      required: [true, "Category cover image is required"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.pre("save", function (next) {
  if (!this.isNew) return next();
  this.slug = slug(this.name, { lower: true });
  next();
});

const Category = model<iCategory, iCategoryModel>("Category", categorySchema);
export default Category;
