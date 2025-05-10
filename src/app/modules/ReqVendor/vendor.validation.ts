import { z } from "zod";

// Address validation
const AddressSchema = z.object({
  street: z.string()
    .min(3, "Street name must be at least 3 characters.")
    .max(100, "Street name can't exceed 100 characters."),
  city: z.string({
    required_error: "City name is required.",
    invalid_type_error: "City must be a valid string.",
  })
    .min(2, "City name must be at least 2 characters.")
    .max(50, "City name can't exceed 50 characters.")
    .regex(/^[a-zA-Z\s]+$/, "City name can only contain letters and spaces."),
  state: z.string().max(50, "State can't exceed 50 characters.").optional(),
  postalCode: z.string()
    .min(4, "Postal code must be at least 4 characters.")
    .max(10, "Postal code can't exceed 10 characters."),
  country: z.string()
    .min(2, "Country name must be at least 2 characters.")
    .max(56, "Country name can't exceed 56 characters."),
});

// Social links validation
const SocialLinksSchema = z.object({
  facebook: z.string().url("Invalid Facebook URL").optional(),
  instagram: z.string().url("Invalid Instagram URL").optional(),
  twitter: z.string().url("Invalid Twitter URL").optional(),
}).optional();

// Bank details validation
const BankDetailsSchema = z.object({
  accountName: z.string().min(3, "Account name must be at least 3 characters.").max(100),
  accountNumber: z.string().min(8, "Account number must be at least 8 digits.").max(20),
  bankName: z.string().min(3, "Bank name must be at least 3 characters.").max(100),
  ifscCode: z.string().max(20).optional(),
});

// Documents validation
const DocumentsSchema = z.object({
  nationalId: z.string().min(5, "National ID must be at least 5 characters.").max(20),
  tradeLicense: z.string().max(30).optional(),
  otherDocs: z.array(z.string().url("Each document must be a valid URL")).optional(),
});

// Block info validation
const BlockInfoSchema = z.object({
  reason: z.string().min(5, "Block reason must be at least 5 characters.").max(200),
  blockedBy: z.string().min(1, "BlockedBy (Admin ID) is required."),
  blockedAt: z.date(),
}).optional();

// Enums
const TStatus = z.enum(['pending', 'approved', 'rejected', 'misInfo']);
const TBusinessType = z.enum(['individual', 'company', 'reseller', 'manufacturer']);
const TMainCategories = z.enum([
  'Electronics', 'Fashion', 'Home & Furniture', 'Grocery & Essentials',
  'Beauty & Health', 'Sports & Outdoors', 'Books & Media',
  'Toys, Baby & Kids', 'Automotive & Tools', 'Office & Stationery',
  'Pet Supplies', 'Jewelry & Accessories', 'Musical Instruments', 'Gaming'
]);

// Main Vendor Schema
const VendorBaseSchema = z.object({
  userId: z.string().min(1, "User ID is required."),
  shopName: z.string().min(2, "Shop name must be at least 2 characters.").max(100),
  email: z.string().email("Invalid email format."),
  phone: z.string().min(10, "Phone number must be at least 10 digits.").max(15),
  address: AddressSchema,
  logoImg: z.string().url("Logo must be a valid URL").optional(),
  bannerImg: z.string().url("Banner must be a valid URL").optional(),
  description: z.string().min(10, "Description must be at least 10 characters."),
  
  isVerified: z.boolean().default(false),
  isActive: z.boolean().default(false),
  isBlocked: z.boolean().default(false),
  blockInfo: BlockInfoSchema,
  
  rating: z.number().min(0).max(5).optional(),
  socialLinks: SocialLinksSchema,
  bankDetails: BankDetailsSchema,
  documents: DocumentsSchema,
  status: TStatus,

  productCategories: z.array(TMainCategories).nonempty("At least one category is required."),
  businessType: TBusinessType,
  establishedYear: z.number().min(1900).max(new Date().getFullYear()).optional(),
  website: z.string().url("Invalid website URL").optional(),
  gstNumber: z.string().max(30).optional(),
  companyRegistrationNumber: z.string().max(30).optional(),

  approvedBy: z.string().optional(),
  approvalDate: z.date().optional(),
});

//  Final validator
const CreateVendorValidationSchema = z.object({
  body: VendorBaseSchema
});

export const VendorValidation = {
    CreateVendorValidationSchema
};
