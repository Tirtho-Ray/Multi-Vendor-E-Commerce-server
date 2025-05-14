import { Types } from "mongoose";

export interface TComment {
    comment:string;
    userId:Types.ObjectId;
    productId:Types.ObjectId;
    parentComment?: Types.ObjectId | null;
}
