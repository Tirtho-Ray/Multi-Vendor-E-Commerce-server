import { Schema, model, Types } from 'mongoose';
import { TVendor } from './vendor.interface';

const AddressSchema = new Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const SocialLinksSchema = new Schema(
  {
    facebook: { type: String },
    instagram: { type: String },
    twitter: { type: String },
  },
  { _id: false }
);

const BankDetailsSchema = new Schema(
  {
    accountName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    bankName: { type: String, required: true },
    ifscCode: { type: String },
  },
  { _id: false }
);

const DocumentsSchema = new Schema(
  {
    nationalId: { type: String, required: true },
    tradeLicense: { type: String },
    otherDocs: [{ name: String, url: String }],
  },
  { _id: false }
);

const BlockInfoSchema = new Schema(
  {
    reason: { type: String, required: true },
    blockedBy: { type: Types.ObjectId, ref: 'Admin', required: true },
    blockedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const VendorSchema = new Schema<TVendor>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    shopName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    address: { type: AddressSchema, required: true },
    logoImg: { type: String },
    bannerImg: { type: String },
    description: { type: String, required: true },
    website: { type: String },

    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    blockInfo: { type: BlockInfoSchema },

    rating: { type: Number, min: 0, max: 5, default: 0 },
    socialLinks: { type: SocialLinksSchema },
    bankDetails: { type: BankDetailsSchema, required: true },
    documents: { type: DocumentsSchema, required: true },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'misInfo'],
      default: 'pending',
    },

    kycStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },

    productCategories: [
      {
        type: String,
        enum: [
          'Electronics',
          'Fashion',
          'Home & Furniture',
          'Grocery & Essentials',
          'Beauty & Health',
          'Sports & Outdoors',
          'Books & Media',
          'Toys, Baby & Kids',
          'Automotive & Tools',
          'Office & Stationery',
          'Pet Supplies',
          'Jewelry & Accessories',
          'Musical Instruments',
          'Gaming',
        ],
        required: true,
      },
    ],

    businessType: {
      type: String,
      enum: ['individual', 'company', 'reseller', 'manufacturer'],
      required: true,
    },
    establishedYear: { type: Number },
    gstNumber: { type: String },
    companyRegistrationNumber: { type: String },

    approvedBy: { type: Types.ObjectId, ref: 'Admin' },
    approvalDate: { type: Date },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const Vendor = model<TVendor>('Vendor', VendorSchema);
