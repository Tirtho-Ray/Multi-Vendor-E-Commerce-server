import AppError from "../../errors/AppError";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { VendorServices } from "./vendor.services";
import httpStatus from 'http-status';

const CreateVendor = catchAsync(async (req, res )=>{
     const payload = {
    ...req.body,
    userId: req.user.id 
  };
    // console.log("payload:",payload)
    const vendor = await VendorServices.createVendorIntoDB(payload);
    sendResponse(res,
        {
            success:true,
            statusCode:httpStatus.CREATED,
            message:"Vendor create succfully",
            data:vendor
        }

    )
})

const getVendors = catchAsync (async (req,res) =>{
    const vendor = await VendorServices.getAllVendorIntoDB();
    sendResponse(res,{
        success:true,
        statusCode:httpStatus.CREATED,
        message:"vendors get succfully",
        data:vendor
    });
});

const approveVendor = catchAsync(async (req, res) => {
  const { vendorId } = req.params;
  const adminId = req.user.id;
  const { status, reason } = req.body; 

  const allowedStatuses = ["approved", "rejected", "misInfo", "blocked"];
  if (!allowedStatuses.includes(status)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid vendor status");
  }

  const result = await VendorServices.approveVendor(vendorId, adminId, status, reason);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `Vendor ${status} successfully`,
    data: result,
  });
});


const updateVendorStatus = catchAsync(async (req, res) => {
  const { vendorId } = req.params;
  const adminId = req.user.id;
  const updateData = req.body;

  const result = await VendorServices.updateVendorStatus(vendorId, updateData, adminId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Vendor status updated successfully",
    data: result,
  });
});


const softDeleteVendor = catchAsync(async (req, res) => {
  const { vendorId } = req.params;
  const adminId = req.user.id;

  const result = await VendorServices.softDeleteVendor(vendorId, adminId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Vendor soft deleted successfully",
    data: result,
  });
});


const hardDeleteVendor = catchAsync(async (req, res) => {
  const { vendorId } = req.params;

  const result = await VendorServices.hardDeleteVendor(vendorId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Vendor permanently deleted successfully",
    data: result,
  });
});


const deleteAllMisInfoAndRejected = catchAsync(async (req, res) => {
  const adminId = req.user.id; 

  const result = await VendorServices.deleteAllMisInfoAndRejected(adminId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All misInfo and rejected vendors deleted successfully",
    data: result,
  });
});

const getMyVendorRequest = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const result = await VendorServices.getMyVendorRequest(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Vendor request fetched successfully",
    data: result,
  });
});


export const VendorController = {
  CreateVendor,
  getVendors,
  approveVendor,
  updateVendorStatus,
  softDeleteVendor,
  hardDeleteVendor,
  deleteAllMisInfoAndRejected,
  getMyVendorRequest
};
