import { TComment } from "./comment.interface";
import { Comment } from "./comment.model";

import { Product } from "../product/product.model";

const createCommentIntoDB = async (payload: TComment) => {
  const comment = await Comment.create(payload);
  // console.log(comment)

  
  if (payload.productId) {
    await Product.findByIdAndUpdate(payload.productId, {
      $push: { 'reviews.customerReviews': { comment: comment._id, createdAt: new Date() } },
    });
  }

  return comment;
};


export const CommentService ={
    createCommentIntoDB
}