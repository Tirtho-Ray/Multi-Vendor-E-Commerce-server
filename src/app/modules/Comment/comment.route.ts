import express from "express"
import { CommentValidation } from "./comment.validation";
import validateRequest from "../../middlewares/validateRequest";
import { CommentController } from "./comment.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";
const router = express.Router();

router.post('/create-comment',auth(USER_ROLE.USER,USER_ROLE.VENDOR,USER_ROLE.ADMIN,USER_ROLE.SUPER_ADMIN),
    validateRequest(CommentValidation.CreateCommentValidationSchema),
    CommentController.createComment
)

export const CommentRouter = router;
