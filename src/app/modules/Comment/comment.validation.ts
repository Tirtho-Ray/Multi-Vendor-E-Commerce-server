import { z } from "zod";

const CreateCommentValidationSchema = z.object({
  body: z.object({
    comment: z.string().min(1).max(400, {
      message: "Comment must be between 1 to 400 characters.",
    }),
    userId: z.string().min(1, "User ID is required."),
    productId: z.string().min(1, "Product ID is required."),
    parentComment: z.string().optional(),
  }),
});


export const CommentValidation = {
  CreateCommentValidationSchema,
};
