import { TComment } from "./comment.interface";
import { Comment } from "./comment.model";

const createCommentIntoDB = async(payload: TComment) =>{
    const comment = Comment.create(payload);
    return comment;
};

export const CommentService ={
    createCommentIntoDB
}