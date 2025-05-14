import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CommentService } from "./comment.services";
import  httpStatus  from 'http-status';

const createComment = catchAsync(async (req, res)=>{
    const comment = await CommentService.createCommentIntoDB(req.body);
//    console.log("📦 Incoming comment data:", req.body);
    sendResponse(res,{
        success:true,
        statusCode:httpStatus.CREATED,
        message:"comment create succfully ",
        data:comment
    });
});

export const CommentController ={
    createComment
}

