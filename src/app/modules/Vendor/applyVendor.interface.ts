import { Types } from "mongoose";

export interface TVendorApplication {
    user: Types.ObjectId;
    businessName: string;
    businessAddress: string;
    contactEmail: string;
    contactPhone: string;
    productCategory: string;
    productName: string;
    productImage: string[];
    productDescription: string;
    businessLicense?: string;
    taxID?: string;
    bankAccount?: string;
    status: 'pending' | 'approved' | 'rejected';
    appliedAt: Date;
    approvedAt?: Date;
    rejectedAt?: Date;
    adminRemarks?: string;
  }
  