/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Document, Schema, model } from "mongoose";

// --- Counter Schema ---
const CounterSchema = new Schema({
  id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});
const Counter = mongoose.models.Counter || model("Counter", CounterSchema);

// --- Variant Schema ---
const VariantSchema = new Schema(
  {
    attributes: { type: Map, of: Schema.Types.Mixed, required: true },
    sku: { type: String },
    stock: { type: Number, required: true },
    additionalPrice: { type: Number },
    variantPictures: [{ type: String }],
  },
  { _id: false }
);

// --- Customer Review Schema ---
const CustomerReviewSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// --- Discount Schema ---
const DiscountSchema = new Schema(
  {
    type: { type: String, enum: ["percentage", "fixed"], required: true },
    amount: { type: Number, required: true, min: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    activeTime: {
      specificDate: { type: Date },
      startTime: { type: String },
      endTime: { type: String },
      repeatDaily: { type: Boolean, default: false },
    },
    isActive: { type: Boolean, default: false },
    maxUsageLimit: { type: Number },
    usedCount: { type: Number, default: 0 },
    applicableProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { _id: false }
);

// --- Shipping Schema ---
const ShippingSchema = new Schema(
  {
    isFree: { type: Boolean, default: false },
    deliveryCharge: { type: Number },
    estimatedDays: { type: Number },
    courier: { type: String },
    locationBased: { type: Boolean },
  },
  { _id: false }
);

// --- Product Interface ---
interface TProduct extends Document {
  productId: string;
  item: any;
  vendorID: mongoose.Types.ObjectId;
  discount?: any;
  shipping?: any;
  reviews?: any;
  seo?: any;
  status?: string;
  visibility?: string;
  views?: number;
  wishlistedCount?: number;
  soldCount?: number;
  approvedBy?: mongoose.Types.ObjectId;
  adminNotes?: string;
}

// --- Product Schema ---
const ProductSchema = new Schema<TProduct>(
  {
    productId: { type: String, unique: true },

    item: {
      name: { type: String, required: true },
      slug: { type: String, required: true, unique: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
      subCategory: { type: Schema.Types.ObjectId, ref: "SubCategory", required: true },
      variants: [VariantSchema],
      brand: { type: String },
      tags: [{ type: String }],
      isAvailable: { type: Boolean, default: true },
      picture: { type: String, required: true },
      manyPictures: [{ type: String }],
      productFor: { type: String, enum: ["men", "women", "kids", "baby"] },
    },

    vendorID: { type: Schema.Types.ObjectId, ref: "User", required: true },

    discount: DiscountSchema,
    shipping: ShippingSchema,

    reviews: {
      averageRating: { type: Number, default: 0 },
      totalReviews: { type: Number, default: 0 },
      customerReviews: [CustomerReviewSchema],
    },

    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      keywords: [{ type: String }],
    },

    status: { type: String, enum: ["active", "inactive", "pending", "rejected"], default: "pending" },
    visibility: { type: String, enum: ["public", "private", "draft"], default: "public" },
    views: { type: Number, default: 0 },
    wishlistedCount: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 },
    approvedBy: { type: Schema.Types.ObjectId, ref: "Admin" },
    adminNotes: { type: String },
  },
  { timestamps: true }
);

// --- Pre-save Hook for Auto-Increment ProductId ---
ProductSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { id: "productId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const formattedSeq = counter.seq.toString().padStart(6, "0"); // 6 digits
    this.productId = `P-${formattedSeq}`; // 👉 Result: P-000001
  }
  next();
});

export const Product = mongoose.models.Product || model<TProduct>("Product", ProductSchema);
