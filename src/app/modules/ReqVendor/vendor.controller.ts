import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { VendorServices } from "./vendor.services";
import httpStatus from 'http-status';

const CreateVendor = catchAsync(async (req, res )=>{
    const vendor = await VendorServices.createVendorIntoDB(req.body);
    sendResponse(res,
        {
            success:true,
            statusCode:httpStatus.CREATED,
            message:"Vendor create succfully",
            data:vendor
        }

    )
})

export const VendorController ={
    CreateVendor
}