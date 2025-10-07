import { TVendor } from "./vendor.interface";
import { Vendor } from "./vendor.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { User } from "../User/user.model";
import mongoose from "mongoose";
import { USER_ROLE } from "../User/user.constant";

const createVendorIntoDB = async (payload: TVendor) => {

  if (!payload.userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User ID is missing');
  }


  const user = await User.findById(payload.userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }


  if (user.status !== 'ACTIVE') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is not active');
  }

  const existingVendor = await Vendor.findOne({ userId: payload.userId });
  if (existingVendor && ['pending', 'approved'].includes(existingVendor.status)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have already applied to become a vendor'
    );
  }


  const result = await Vendor.create(payload);
  return result;
};


//=>
const getAllVendorIntoDB = async () =>{
   const getVendors = await Vendor.find().populate("userId", "name email status");
    return getVendors;
} ;


//  =->
const approveVendor  = async (
  vendorId: string,
  adminId: string,
  status: "approved" | "rejected" | "misInfo",
  reason?: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const vendor = await Vendor.findById(vendorId).session(session);
    if (!vendor) throw new AppError(httpStatus.NOT_FOUND, "Vendor not found");

    // --- already final decision ---
    if (["approved", "rejected"].includes(vendor.status)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Vendor status already finalized");
    }

    // --- handle approval flow ---
    if (status === "approved") {
      vendor.status = "approved";
      vendor.isVerified = true;
      vendor.isActive = true;
      vendor.approvedBy = new mongoose.Types.ObjectId(adminId);
      vendor.approvalDate = new Date();

      // Change user role to VENDOR
      await User.findByIdAndUpdate(
        vendor.userId,
        { role: USER_ROLE.VENDOR },
        { session }
      );
    }

    if (status === "rejected" || status === "misInfo") {
      vendor.status = status;
      vendor.isVerified = false;
      vendor.isActive = false;

      vendor.blockInfo = {
        reason: reason || "Rejected by admin",
        blockedBy: new mongoose.Types.ObjectId(adminId),
        blockedAt: new Date(),
      };
    }

    await vendor.save({ session });
    await session.commitTransaction();
    session.endSession();

    return vendor;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};




const updateVendorStatus = async (
  vendorId: string,
  updateData: Partial<TVendor>,
  adminId: string
) => {
  const vendor = await Vendor.findById(vendorId);
  if (!vendor) throw new AppError(httpStatus.NOT_FOUND, "Vendor not found");

  if (updateData.isBlocked) {
    vendor.isBlocked = true;
    vendor.blockInfo = {
      reason: updateData.blockInfo?.reason || "Blocked by admin",
      blockedBy: new mongoose.Types.ObjectId(adminId),
      blockedAt: new Date(),
    };
  } else if (updateData.isBlocked === false) {
    vendor.isBlocked = false;
    vendor.blockInfo = null;
  }

  // other updates
  if (updateData.isVerified !== undefined) vendor.isVerified = updateData.isVerified;
  if (updateData.isActive !== undefined) vendor.isActive = updateData.isActive;

  const updatedVendor = await vendor.save();
  return updatedVendor;
};




const softDeleteVendor = async (vendorId: string, adminId: string) => {
  const vendor = await Vendor.findById(vendorId);
  if (!vendor) throw new AppError(httpStatus.NOT_FOUND, "Vendor not found");

  vendor.isDeleted = true;
  vendor.deletedAt = new Date();
  vendor.deletedBy = adminId;
  vendor.isActive = false;

  await vendor.save();
  return vendor;
};



const hardDeleteVendor = async (vendorId: string) => {
  const vendor = await Vendor.findByIdAndDelete(vendorId);
  if (!vendor) throw new AppError(httpStatus.NOT_FOUND, "Vendor not found");
  return vendor;
};



const deleteAllMisInfoAndRejected = async (adminId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
  
    const vendorsToDelete = await Vendor.find({
      status: { $in: ["misInfo", "rejected"] },
    }).session(session);

    if (vendorsToDelete.length === 0) {
      throw new AppError(httpStatus.NOT_FOUND, "No vendors found to delete");
    }


    const deletedVendorIds = vendorsToDelete.map((v) => v._id);


    const result = await Vendor.deleteMany(
      { status: { $in: ["misInfo", "rejected"] } },
      { session }
    );

    // console.log(
    //   `Admin ${adminId} deleted ${result.deletedCount} vendors:`,
    //   deletedVendorIds
    // );

    await session.commitTransaction();
    session.endSession();

    return {
      deletedCount: result.deletedCount,
      deletedVendorIds,
      deletedBy: adminId,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getMyVendorRequest = async (userId: string) => {
  const vendor = await Vendor.findOne({ userId })
    .populate("userId", "name email role status")
    .lean();

  if (!vendor) {
    throw new AppError(httpStatus.NOT_FOUND, "You have not submitted any vendor request");
  }

  return vendor;
};


export const VendorServices = {
  createVendorIntoDB,
  getAllVendorIntoDB,
  approveVendor,
  updateVendorStatus,softDeleteVendor,
  hardDeleteVendor,
  deleteAllMisInfoAndRejected,
  getMyVendorRequest
};
