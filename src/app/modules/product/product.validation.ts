import { z } from "zod";

// Example: Variant schema based on your Mongoose model
const VariantSchema = z.object({
  attributes: z.record(z.union([z.string(), z.number(), z.boolean()])),
  sku: z.string().optional(),
  stock: z.number().min(0),
  additionalPrice: z.number().optional(),
  variantPictures: z.array(z.string().url()).optional(),
});

const CustomerReviewSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  comment: z.string(),
  rating: z.number().min(1).max(5),
  createdAt: z.date().optional(),
});

const DiscountSchema = z.object({
  type: z.enum(["percentage", "fixed"]),
  amount: z.number().min(0, "Discount amount must be positive"),


  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid start date" })
    .transform((val) => new Date(val)),

  endDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid end date",
    })
    .transform((val) => (val ? new Date(val) : undefined)),


  activeTime: z
    .object({
      specificDate: z
        .string()
        .optional()
        .refine((val) => !val || !isNaN(Date.parse(val)), {
          message: "Invalid specific date",
        })
        .transform((val) => (val ? new Date(val) : undefined)),
      startTime: z.string().optional(), 
      endTime: z.string().optional(), 
      repeatDaily: z.boolean().optional(),
    })
    .optional(),

  isActive: z.boolean().optional().default(false),
  noEndDate: z.boolean().optional().default(false), 

  maxUsageLimit: z.number().int().optional(),
  usedCount: z.number().int().optional().default(0),
  applicableProducts: z
    .array(z.string().regex(/^[0-9a-fA-F]{24}$/))
    .optional(),
}).optional();


const ShippingSchema = z
  .object({
    isFree: z.boolean().optional(),
    deliveryCharge: z.number().optional(),
    estimatedDays: z.number().int().optional(),
    courier: z.string().optional(),
    locationBased: z.boolean().optional(),
  })
  .optional();

const ProductItemSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  price: z.number(),
  quantity: z.number(),
  category: z.string(),
  subCategory: z.string(),
  variants: z.array(VariantSchema).optional(),
  brand: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isAvailable: z.boolean().optional(),
  picture: z.string().optional(),
  manyPictures: z.array(z.string()).optional(),
  productFor:z.enum(["men" , "women" , "kids" , "baby"])
});

const ReviewsSchema = z.object({
  averageRating: z.number().optional(),
  totalReviews: z.number().optional(),
  customerReviews: z.array(CustomerReviewSchema).optional(),
});


const ProductBaseSchema = z.object({
  // productId: z.number().int(),
  item: ProductItemSchema,
  discount: DiscountSchema,
  shipping: ShippingSchema,
  reviews: ReviewsSchema.optional(),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    })
    .optional(),
  status: z.enum(["active", "inactive", "pending", "rejected"]).optional(),
  visibility: z.enum(["public", "private", "draft"]).optional(),
  views: z.number().int().optional(),
  wishlistedCount: z.number().int().optional(),
  soldCount: z.number().int().optional(),
  approvedBy: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  adminNotes: z.string().optional(),
});


// Create + Update
const CreateProductValidationSchema = z.object({
  body: ProductBaseSchema,
});

const UpdateProductValidationSchema = z.object({
  body: ProductBaseSchema.partial(),
});

//  Export
export const ProductValidation = {
  CreateProductValidationSchema,
  UpdateProductValidationSchema,
};
