import { Document } from "mongoose";

export interface iProduct extends Document {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
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
