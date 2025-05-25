import { model, Schema } from "mongoose";
import { Model } from "mongoose";
import { Types } from "mongoose";
import slug from "slugify";

export interface iSubcategory {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  // coverImage?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface iSubcategoryMethods {}

export interface iSubcategoryModel
  extends Model<iSubcategory, {}, iSubcategoryMethods> {
  findByNameAcrossCategories(name: string): Promise<iSubcategory[]>;
}

const subcategorySchema = new Schema<
  iSubcategory,
  iSubcategoryModel,
  iSubcategoryMethods
>(
  {
    name: {
      type: String,
      required: [true, "Subcategory name is required"],
      trim: true,
      lowercase: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Subcategory description is required"],
      trim: true,
    },
    // coverImage: {
    //   type: String,
    // },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create unique compound index for name (allows same subcategory name across different contexts)
subcategorySchema.index({ name: 1 });

subcategorySchema.pre("save", function (next) {
  if (!this.isNew && !this.isModified("name")) return next();
  this.slug = slug(this.name, { lower: true });
  next();
});

// Static method to find subcategories by name across all categories
subcategorySchema.statics.findByNameAcrossCategories = async function (
  name: string
) {
  return this.find({ name: { $regex: `^${name}$`, $options: "i" } });
};

const Subcategory = model<iSubcategory, iSubcategoryModel>(
  "Subcategory",
  subcategorySchema
);
export default Subcategory;
