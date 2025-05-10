import { Types } from 'mongoose';
import { TBusinessType,TStatus } from './vendor.constant';
import { TMainCategory } from '../product/product.constant';

type TAddress = {
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
};

type TSocialLinks = {
  facebook?: string;
  instagram?: string;
  twitter?: string;
};

type TBankDetails = {
  accountName: string;
  accountNumber: string;
  bankName: string;
  ifscCode?: string;
};

type TDocument = {
  nationalId: string;
  tradeLicense?: string;
  otherDocs?: Array<{ name: string; url: string }>; // updated for better document management
};

type TBlockInfo = {
  reason: string;
  blockedBy: Types.ObjectId;  // Admin ID
  blockedAt: Date;
};

export type TKycStatus = 'pending' | 'verified' | 'rejected';

// Main Interface
export interface TVendor {
  userId: Types.ObjectId;

  // Basic Info
  shopName: string;
  email: string;
  phone: string;
  address: TAddress;
  logoImg?: string;
  bannerImg?: string;
  description: string;
  website?: string;
  slug?: string; // SEO Friendly URL

  // Verification & Status
  isVerified: boolean;
  verifiedAt?: Date;
  verifiedBy?: Types.ObjectId;
  kycStatus?: TKycStatus;
  status: TStatus;
  isActive: boolean;
  isBlocked: boolean;
  blockInfo?: TBlockInfo;
  rating?: number;

  // Business Info
  businessType: TBusinessType;
  establishedYear?: number;
  gstNumber?: string;
  companyRegistrationNumber?: string;
  productCategories: TMainCategory[]; // changed to array for multiple category support

  // Admin Control
  approvedBy?: Types.ObjectId;
  approvalDate?: Date;

  // Documents & Bank Info
  documents: TDocument;
  bankDetails?: TBankDetails;

  // Social & Support
  socialLinks?: TSocialLinks;
  supportEmail?: string;
  supportPhone?: string;

  // Location (Optional for Map/Delivery)
  latitude?: number;
  longitude?: number;

  // Metadata
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
}
