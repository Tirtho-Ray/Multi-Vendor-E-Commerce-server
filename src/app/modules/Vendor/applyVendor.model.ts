import mongoose, { model, Schema } from "mongoose";
import { TVendorApplication } from "./applyVendor.interface";

const VendorSchema = new Schema<TVendorApplication>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // type: Schema.Types.ObjectId,
    businessName: { type: String, required: true },
    businessAddress: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    productCategory: { type: String, required: true },
    productName: { type: String, required: true },
    productImage: [{ type: String, required: true }],
    productDescription: { type: String, required: true },
    businessLicense: { type: String, required: false }, 
    taxID: { type: String, required: false }, 
    bankAccount: { type: String, required: false }, 
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    appliedAt: { type: Date, default: Date.now },
    approvedAt: { type: Date },
    rejectedAt: { type: Date },
    adminRemarks: { type: String, required: false }, 
  },
  { timestamps: true }
);

export const Vendor = model<TVendorApplication>('Vendor', VendorSchema);
