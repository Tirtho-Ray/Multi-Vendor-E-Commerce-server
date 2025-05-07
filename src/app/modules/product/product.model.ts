import { Schema, model, Types } from "mongoose";
import { TProduct } from "./product.interface";

// 🧾 Variant Schema
const VariantSchema = new Schema(
  {
    attributes: {
      type: Map,
      of: Schema.Types.Mixed, 
      required: true,
    },
    stock: { type: Number, required: true },
    additionalPrice: { type: Number },
    variantPicture: [{ type: String }],
  },
  { _id: false }
);

//  Review Schema
const ReviewSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

//  Product Schema
const ProductSchema = new Schema<TProduct>(
  {
    productId: { type: Number, required: true },

    item: {
      name: { type: String, required: true },
      slug: { type: String, required: true, unique: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      category: { type: String, required: true },
      subCategory: { type: String },
      brand: { type: String },
      tags: [{ type: String }],
      isAvailable: { type: Boolean, default: true },
      picture: { type: String, required: true },
      manyPicture: [{ type: String }],
      variants: [VariantSchema],
    },

    vendor: {
      vendorId: { type: Types.ObjectId, ref: "Vendor", required: true },
      vendorName: { type: String },
    },

    discount: {
      type: {
        type: String,
        enum: ["percentage", "fixed"],
      },
      amount: { type: Number },
      startDate: { type: Date, default: Date.now },
      endDate: { type: Date, default: Date.now },
    },

    reviews: {
      averageRating: { type: Number, default: 0 },
      totalReviews: { type: Number, default: 0 },
      customerReviews: [ReviewSchema],
    },

    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
    },

    status: {
      type: String,
      enum: ["active", "inactive", "pending", "rejected"],
      default: "pending",
    },

    visibility: {
      type: String,
      enum: ["public", "private", "draft"],
      default: "public",
    },

    views: { type: Number, default: 0 },
    wishlistedCount: { type: Number, default: 0 },
    adminNotes: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Product = model<TProduct>("Product", ProductSchema);
