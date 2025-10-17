/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";

export interface ICartItem {
  productId: Types.ObjectId; 
  quantity: number;         
  selectedVariant?: Record<string, any>; 
  isBlocked?: boolean; 
}

export interface TCart {
  userId: Types.ObjectId;   
  items: ICartItem[];

  createdAt?: Date;
  updatedAt?: Date;
};
