import { z } from "zod";

const CreateCommentValidationSchema = z.object({
  body: z.object({
    comment: z.string().min(1).max(400, {
      message: "Comment must be between 1 to 400 characters.",
    }),
    userID: z.string(),
    productId: z.string().optional(), 
    parentComment: z.string().optional(), 
    role: z.enum(["user", "vendor"]),
  }),
});

export const CommentValidation = {
  CreateCommentValidationSchema,
};
