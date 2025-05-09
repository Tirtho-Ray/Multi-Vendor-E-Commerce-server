import { Types } from 'mongoose';
import { TBusinessType, TStatus } from './vendor.constant';
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
  otherDocs?: string[];
};


type TBlockInfo = {
  reason: string;
  blockedBy: Types.ObjectId;  // Admin ID
  blockedAt: Date;
};

//Main Interface
export interface TVendor {
  userId: Types.ObjectId;
  shopName: string;
  email: string;
  phone: string;
  address: TAddress;
  logoImg?: string;
  bannerImg?: string;
  description: string;
  isVerified: boolean;
  isActive: boolean;
  isBlocked: boolean;           
  blockInfo?: TBlockInfo;        
  rating?: number;
  socialLinks?: TSocialLinks;
  bankDetails?: TBankDetails;
  documents: TDocument;
  status: TStatus;


  productCategories: TMainCategory; 
  businessType: TBusinessType;
  establishedYear?: number;
  website?: string;
  gstNumber?: string; 
  companyRegistrationNumber?: string;

  createdAt?: Date;
  updatedAt?: Date;
  approvedBy?: Types.ObjectId;
  approvalDate?: Date;
};
