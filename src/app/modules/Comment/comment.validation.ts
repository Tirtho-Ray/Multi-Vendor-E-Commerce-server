import { z} from "zod"
const CreateCommentValidationSchema = z.object({
    body:z.object({
        comment:z.string().min(1).max(400,{message:"Comment contain max 400 chr"}),
        userId:z.string(),
        productId:z.string(),

    })
});

export const CommentValidation ={
    CreateCommentValidationSchema
};