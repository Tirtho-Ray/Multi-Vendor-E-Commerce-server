import { Schema, model } from "mongoose";
import { TComment } from "./comment.interface";

const CommentSchema = new Schema<TComment>(
  {
    comment: { type: String, required: true, maxlength: 400 },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    parentComment: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
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

