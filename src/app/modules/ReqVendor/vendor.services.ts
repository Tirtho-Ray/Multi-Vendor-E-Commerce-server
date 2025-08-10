import { TVendor } from "./vendor.interface";
import { Vendor } from "./vendor.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { User } from "../User/user.model";

const createVendorIntoDB = async (payload: TVendor) => {
  const user = await User.findById(payload.userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.status !== "ACTIVE") {
    throw new AppError(httpStatus.FORBIDDEN, "User is not active");
  }

 
  const existingVendor = await Vendor.findOne({ userId: payload.userId });


  if (existingVendor && ["pending", "approved"].includes(existingVendor.status)) {
    throw new AppError(httpStatus.BAD_REQUEST, "You have already applied to become a vendor");
  }

 
  const result = await Vendor.create(payload);
  return result;
};

const getAllVendorIntoDB = async () =>{
   const getVendors = await Vendor.find().populate("userId", "name email status");
    return getVendors;
} 

export const VendorServices = {
  createVendorIntoDB,
  getAllVendorIntoDB
};
