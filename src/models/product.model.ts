import mongoose, { Document, Model, Types } from "mongoose";

export interface iProduct extends Document {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  images: string[];
  specs: {
    [key: string]: string | number | boolean;
  };
  inStock: boolean;
  featured: boolean;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

interface iProductMethods {}

export interface iProductModel extends Model<iProduct, {}, iProductMethods> {
  // Define any static methods here when needed
  // EG: findAProductByName(name: string): Promise<iProduct>;
}

const productSchema = new mongoose.Schema<
  iProduct,
  iProductModel,
  iProductMethods
>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: 10,
      maxlength: 50000,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: 0,
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
    },
    subcategory: {
      type: String,
    },
    images: {
      type: [String],
      // required: [true, "Product images are required"],
    },
    specs: {
      type: Object,
      required: [true, "Product specifications are required"],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<iProduct, iProductModel>(
  "Product",
  productSchema
);

export default Product;
