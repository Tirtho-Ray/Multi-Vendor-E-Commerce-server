import { Types } from "mongoose";

export interface TComment {
    comment:string;
    userID:Types.ObjectId;
    productId:Types.ObjectId;
    parentComment?: Types.ObjectId | null;
    status?: "pending" | "approved" | "rejected";
    role: "user" | "vendor";
}