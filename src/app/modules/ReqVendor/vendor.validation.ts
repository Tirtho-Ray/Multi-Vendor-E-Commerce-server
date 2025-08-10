import { z } from "zod";

const AddressSchema = z.object({
  street: z.string().min(3).max(100),
  city: z.string().min(2).max(50),
  state: z.string().max(50).optional(),
  postalCode: z.string().min(4).max(10),
  country: z.string().min(2).max(56),
});

const SocialLinksSchema = z.object({
  facebook: z.string().url().optional(),
  instagram: z.string().url().optional(),
  twitter: z.string().url().optional(),
}).optional();

const BankDetailsSchema = z.object({
  accountName: z.string().min(3).max(100),
  accountNumber: z.string().min(8).max(20),
  bankName: z.string().min(3).max(100),
  ifscCode: z.string().max(20).optional(),
});

const DocumentsSchema = z.object({
  nationalId: z.string().min(5).max(20),
  tradeLicense: z.string().max(30).optional(),
  otherDocs: z.array(z.object({
    name: z.string().min(1),
    url: z.string().url()
  })).optional(),
});

const VendorCreateSchema = z.object({
  userId: z.string(),
  shopName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  address: AddressSchema,
  logoImg: z.string().url().optional(),
  bannerImg: z.string().url().optional(),
  description: z.string().min(10),
  socialLinks: SocialLinksSchema,
  bankDetails: BankDetailsSchema,
  documents: DocumentsSchema,
  businessType: z.enum(['individual', 'company', 'reseller', 'manufacturer']),
  productCategories: z.array(z.string()).nonempty(),
});


//  Final validator
const CreateVendorValidationSchema = z.object({
  body: VendorCreateSchema
});

export const VendorValidation = {
    CreateVendorValidationSchema
};
