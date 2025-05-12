import { Schema, model } from "mongoose";
import { TComment } from "./comment.interface";

const CommentSchema = new Schema<TComment>(
  {
    comment: { type: String, required: true, maxlength: 400 },
    userID: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product",required:true },
    parentComment: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    role: {
      type: String,
      enum: ["user", "vendor"],
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for reply system
CommentSchema.virtual("replies", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parentComment",
});

export const Comment = model<TComment>("Comment", CommentSchema);
