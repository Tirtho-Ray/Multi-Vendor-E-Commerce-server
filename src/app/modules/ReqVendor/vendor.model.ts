import { Schema, model, Types } from 'mongoose';
import { TVendor } from './vendor.interface';

const AddressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
}, { _id: false });

const SocialLinksSchema = new Schema({
  facebook: { type: String },
  instagram: { type: String },
  twitter: { type: String },
}, { _id: false });

const BankDetailsSchema = new Schema({
  accountName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  bankName: { type: String, required: true },
  ifscCode: { type: String },
}, { _id: false });

const DocumentsSchema = new Schema({
  nationalId: { type: String, required: true },
  tradeLicense: { type: String },
  otherDocs: [{ name: String, url: String }],
}, { _id: false });

const BlockInfoSchema = new Schema({
  reason: { type: String },
  blockedBy: { type: Types.ObjectId, ref: 'Admin' },
  blockedAt: { type: Date },
}, { _id: false });

const VendorSchema = new Schema<TVendor>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  shopName: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  address: { type: AddressSchema, required: true },
  logoImg: String,
  bannerImg: String,
  description: { type: String, required: true },
  website: String,

  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: false },
  
  // Block info starts as null, admin can update
  isBlocked: { type: Boolean, default: false },
  blockInfo: { type: BlockInfoSchema, default: null },

  rating: { type: Number, min: 0, max: 5, default: 0 },
  socialLinks: { type: SocialLinksSchema },
  bankDetails: { type: BankDetailsSchema, required: true },
  documents: { type: DocumentsSchema, required: true },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'misInfo'],
    default: 'pending'
  },

  businessType: {
    type: String,
    enum: ['individual', 'company', 'reseller', 'manufacturer'],
    required: true
  },
  productCategories: [{ type: String, required: true }],

  approvedBy: { type: Types.ObjectId, ref: 'Admin' },
  approvalDate: Date,

}, { timestamps: true });

export const Vendor = model<TVendor>('Vendor', VendorSchema);
