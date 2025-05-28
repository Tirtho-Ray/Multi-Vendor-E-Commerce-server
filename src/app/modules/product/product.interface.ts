import { Types } from "mongoose";

export type TVariantAttribute = {
  [key: string]: string | number | boolean;
};

export type TVariant = {
  attributes: TVariantAttribute;
  stock: number;
  additionalPrice?: number;
  variantPicture?: string[]; 
};

export interface TProduct {
  productId: number;

  item: {
    name: string;
    slug: string;
    description: string;
    price: number;
    quantity: number;
    category: string;
    subCategory?: string;
    brand?: string;
    tags?: string[];
    isAvailable: boolean;
    picture: string; 
    manyPicture?: string[]; 
    variants?: TVariant[];
  };

  vendor: {
    vendorId: Types.ObjectId;
    vendorName?: string;
  };

  discount?: {
    type?: "percentage" | "fixed";
    amount?: number;
    startDate?: Date;
    endDate?: Date;
  };

  reviews?: {
    averageRating: number;
    totalReviews: number;
    customerReviews: {
      comment: string;
      createdAt: Date;
    }[];
  };

  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };

  status?: "active" | "inactive" | "pending" | "rejected";
  visibility?: "public" | "private" | "draft";

  views?: number;
  wishlistedCount?: number;
  adminNotes?: string;
}
