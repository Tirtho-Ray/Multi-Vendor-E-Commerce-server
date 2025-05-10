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
  facebook: String,
  instagram: String,
  twitter: String,
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
  otherDocs: [{ type: String }],
}, { _id: false });

const BlockInfoSchema = new Schema({
  reason: { type: String, required: true },
  blockedBy: { type: Types.ObjectId, ref: 'Admin', required: true },
  blockedAt: { type: Date, default: Date.now },
}, { _id: false });


//Main schema
const VendorSchema = new Schema<TVendor>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  shopName: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  address: { type: AddressSchema, required: true },
  logoImg: String,
  bannerImg: String,
  description: { type: String, required: true },

  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  blockInfo: BlockInfoSchema,

  rating: { type: Number, min: 0, max: 5 },
  socialLinks: SocialLinksSchema,
  bankDetails: { type: BankDetailsSchema, required: true },
  documents: { type: DocumentsSchema, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'misInfo'],
    default: 'pending'
  },

  productCategories: [{
    type: String,
    enum: [
      'Electronics', 'Fashion', 'Home & Furniture', 'Grocery & Essentials',
      'Beauty & Health', 'Sports & Outdoors', 'Books & Media',
      'Toys, Baby & Kids', 'Automotive & Tools', 'Office & Stationery',
      'Pet Supplies', 'Jewelry & Accessories', 'Musical Instruments', 'Gaming'
    ],
    required: true
  }],

  businessType: {
    type: String,
    enum: ['individual', 'company', 'reseller', 'manufacturer'],
    required: true
  },
  establishedYear: Number,
  website: String,
  gstNumber: String,
  companyRegistrationNumber: String,

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  approvedBy: { type: Types.ObjectId, ref: 'Admin' },
  approvalDate: Date
}, {
  timestamps: true
});

export const Vendor = model<TVendor>('Vendor', VendorSchema);
