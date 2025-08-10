import { Types } from 'mongoose';

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
  otherDocs?: Array<{ name: string; url: string }>;
};

type TBlockInfo = {
  reason?: string;
  blockedBy?: Types.ObjectId;
  blockedAt?: Date;
};

export interface TVendor {
  userId: Types.ObjectId;
  shopName: string;
  email: string;
  phone: string;
  address: TAddress;
  logoImg?: string;
  bannerImg?: string;
  description: string;
  website?: string;

  isVerified: boolean;
  isActive: boolean;

  isBlocked: boolean;
  blockInfo?: TBlockInfo | null;

  rating?: number;
  socialLinks?: TSocialLinks;
  bankDetails: TBankDetails;
  documents: TDocument;

  status: 'pending' | 'approved' | 'rejected' | 'misInfo';
  businessType: 'individual' | 'company' | 'reseller' | 'manufacturer';
  productCategories: string[];

  approvedBy?: Types.ObjectId;
  approvalDate?: Date;
}
