import  { model, Schema } from "mongoose";
import { TComment } from "./comment.interface";

const CommentSchema  = new Schema<TComment> (
    {
        comment:{type:String,required:true},
        userID:{type:Schema.Types.ObjectId, required:true},
        productId:{type:Schema.Types.ObjectId,required:true},
        createdAt:Date.now()

        
    },{
        timestamps: true,
    }

);

export const Comment = model<TComment>("comments",CommentSchema)