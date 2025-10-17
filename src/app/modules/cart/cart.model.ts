import { Schema, model } from "mongoose";
import { TCart } from "./cart.interface";

const CartItemSchema = new Schema<TCart["items"][0]>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, default: 1 },
  selectedVariant: { type: Schema.Types.Mixed },
    isBlocked: { type: Boolean, default: false },
});

const CartSchema = new Schema<TCart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

export const Cart = model<TCart>("Cart", CartSchema);
