import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ImageServices } from "./image.service";
import httpStatus from 'http-status';

const createImage = catchAsync(async(req,res)=>{
    const image = await ImageServices.createImageIntoDB(req.body)
    sendResponse(res,{
         success:true,
        message:"image create successfully",
        statusCode:httpStatus.CREATED,
         data:image

    });
});

export const ImageController ={
    createImage
}