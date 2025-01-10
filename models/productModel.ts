import { required } from "joi";
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
  variants: string[]; // Array for multiple variants
  colours: string[]; // Array for multiple colours
  createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      unique:true
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
      required: false,
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
    variants:{
      type:[String],
      required:true,
    },
    colours:{
      type:[String],
      required:true,
    },
  },
  { timestamps: true }
);

const productModel = mongoose.model<IProduct>("Product", ProductSchema);

export default productModel;