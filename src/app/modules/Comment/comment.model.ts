import  { model, Schema } from "mongoose";
import { TComment } from "./comment.interface";

const CommentSchema  = new Schema<TComment> (
    {
        comment:{type:String,required:true},
       userID: { type: Schema.Types.ObjectId, ref: "User", required: true },
        productId:{type:Schema.Types.ObjectId, ref:"product", required:true},

        
    },{
        timestamps: true,
    }

);

export const Comment = model<TComment>("comments",CommentSchema)