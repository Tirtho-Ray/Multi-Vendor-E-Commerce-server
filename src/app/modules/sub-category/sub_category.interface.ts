import { Types } from "mongoose";

export interface TSubCategory {
  _id?: Types.ObjectId; 
  name: string;          
  mainCategoryId: Types.ObjectId; 
}
