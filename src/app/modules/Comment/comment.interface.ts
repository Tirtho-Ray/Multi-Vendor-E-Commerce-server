import { Types } from "mongoose";

export interface TComment {
    comment:string;
    userID:Types.ObjectId;
    productId:Types.ObjectId;
}