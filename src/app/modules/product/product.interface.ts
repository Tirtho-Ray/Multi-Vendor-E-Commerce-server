export type TProduct = {
    _id?: string;
  
    // 🧾 Item details
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
      manyPicture: string[];
      variants?: {
        color?: string;
        size?: string;
        stock: number;
        additionalPrice?: number;
      }[];
    };
  
    // 🏪 Vendor details
    vendor: {
      vendorId: string;
      vendorName?: string;
    };
  
    // 🎯 Discount and Promotion
    discount?: {
      type: 'percentage' | 'fixed';
      amount: number;
      startDate?: Date;
      endDate?: Date;
    };
  
    // ⭐ Ratings & Reviews
    reviews?: {
      averageRating: number;
      totalReviews: number;
      customerReviews: {
        userId: string;
        username: string;
        rating: number; // 1-5 stars
        comment: string;
        createdAt: Date;
      }[];
    };
  
    // 🚚 Logistics
    logistics?: {
      shippingInfo?: string;
      returnPolicy?: string;
    };
  
    // 🔍 SEO
    seo?: {
      metaTitle?: string;
      metaDescription?: string;
    };
  
    // 🕒 Timestamps
    timestamps?: {
      createdAt?: Date;
      updatedAt?: Date;
    };
  };
  