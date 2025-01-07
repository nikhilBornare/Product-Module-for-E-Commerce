import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  brand: string;
  seller: string;
  product_description: string;
  price: number;
  discount: number;
  ratings: number;
  cod_availability: boolean;
  total_stock_availability: number;
  createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
    },
    brand: {
      type: String,
      required: true,
    },
    seller: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
      minlength: 10,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
    },
    ratings: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    cod_availability: {
      type: Boolean,
      required: true,
    },
    total_stock_availability: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

const productModel = mongoose.model<IProduct>("Product", ProductSchema);

export default productModel;