import { z } from "zod";

// Variant Schema
const VariantSchema = z.object({
  attributes: z.record(
    z.string({ required_error: "Attribute key is required" }),
    z.union([z.string(), z.number(), z.boolean()])
  ),
  stock: z
    .number({ required_error: "Stock is required" })
    .min(0, "Stock cannot be negative"),
  additionalPrice: z.number().optional(),
  variantPicture: z
    .array(z.string().url("Variant image must be a valid URL"))
    .optional(),
});

// Review Schema
const ReviewSchema = z.object({
  userId: z
    .string({ required_error: "User ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format"),
  rating: z
    .number({ required_error: "Rating is required" })
    .min(1, "Minimum rating is 1")
    .max(5, "Maximum rating is 5"),
  comment: z.string().optional(),
  createdAt: z.date().optional(),
});

// Discount Schema
const DiscountSchema = z
  .object({
    type: z.enum(["percentage", "fixed"], {
      required_error: "Discount type is required",
      invalid_type_error: "Type must be 'percentage' or 'fixed'",
    }),
    amount: z
      .number({ required_error: "Discount amount is required" }),
    startDate: z.date({ required_error: "Start date is required" }),
    endDate: z.date({ required_error: "End date is required" }),
  })
  .partial();

// SEO Schema
const SeoSchema = z
  .object({
    metaTitle: z.string().max(100, "Meta title too long").optional(),
    metaDescription: z
      .string()
      .max(300, "Meta description too long")
      .optional(),
  })
  .optional();

// Product Item Schema
const ProductItemSchema = z.object({
  name: z
    .string({ required_error: "Product name is required" })
    .max(100, "Name must be within 100 characters"),
  slug: z
    .string({ required_error: "Slug is required" })
    .max(50, "Slug must be within 50 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly"),
  description: z
    .string({ required_error: "Description is required" })
    .max(1000, "Description too long"),
  price: z
    .number({ required_error: "Price is required" })
    .min(1, "Price must be at least 1"),
  quantity: z
    .number({ required_error: "Quantity is required" })
    .min(1, "Minimum quantity is 1")
    .max(100000, "Quantity too large"),
  category: z
    .string({ required_error: "Category is required" })
    .max(100),
  subCategory: z.string().max(100).optional(),
  brand: z.string().max(100).optional(),
  tags: z
    .array(z.string().max(30, "Each tag must be under 30 characters"))
    .max(8, "You can only use up to 8 tags")
    .optional(),
  isAvailable: z.boolean().optional(),
  picture: z
    .string({ required_error: "Main image is required" })
    .url("Main image must be a valid URL"),
  manyPicture: z.array(z.string().url("Must be a valid URL")).optional(),
  variants: z.array(VariantSchema).optional(),
});

// ✅ Vendor Schema
const VendorSchema = z.object({
  vendorId: z
    .string({ required_error: "Vendor ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid vendor ID"),
  vendorName: z.string().optional(),
});

// ✅ Reviews Schema
const ReviewsSchema = z
  .object({
    averageRating: z.number().optional(),
    totalReviews: z.number().optional(),
    customerReviews: z.array(ReviewSchema).optional(),
  })
  .optional();

// ✅ Full Product Schema
const ProductBaseSchema = z.object({
  _id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID")
    .optional(),

  productId: z
    .number({ required_error: "Product ID is required" })
    .int("Product ID must be an integer")
    .min(1, "Product ID must be at least 1"),

  item: ProductItemSchema, 

  vendor: VendorSchema,

  reviews: ReviewsSchema,

  discount: DiscountSchema.optional(),

  seo: SeoSchema,

  status: z
    .enum(["active", "inactive", "pending", "rejected"], {
      invalid_type_error: "Status must be valid",
    })
    .optional(),

  visibility: z
    .enum(["public", "private", "draft"], {
      invalid_type_error: "Visibility must be valid",
    })
    .optional(),

  views: z
    .number()
    .int("Views must be an integer")
    .min(0, "Views cannot be negative")
    .optional(),

  wishlistedCount: z
    .number()
    .int("Wishlist count must be an integer")
    .min(0, "Wishlist count cannot be negative")
    .optional(),

  adminNotes: z.string().optional(),
});

// ✅ Create + Update
const CreateProductValidationSchema = z.object({
  body: ProductBaseSchema,
});

const UpdateProductValidationSchema = z.object({
  body: ProductBaseSchema.partial(),
});

// ✅ Export
export const ProductValidation = {
  CreateProductValidationSchema,
  UpdateProductValidationSchema,
};
