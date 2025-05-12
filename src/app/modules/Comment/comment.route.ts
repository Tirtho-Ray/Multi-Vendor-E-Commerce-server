import express from "express"
import { CommentValidation } from "./comment.validation";
import validateRequest from "../../middlewares/validateRequest";
import { CommentController } from "./comment.controller";
const router = express.Router();

router.post('/create-comment',
    validateRequest(CommentValidation.CreateCommentValidationSchema),
    CommentController.createComment
)

export const CommentRouter = router;