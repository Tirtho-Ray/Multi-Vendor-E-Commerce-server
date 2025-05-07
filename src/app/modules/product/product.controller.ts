import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProductServices } from "./product.services";
import httpStatus from 'http-status';

const createProduct = catchAsync( async (req,res )=>{
    const result  = await ProductServices.createProductIntoDB(req.body);

    sendResponse(res, {
        success:true,
        statusCode: httpStatus.CREATED,
        message:"Product Create Succfully",
        data:result
    });

});

export const ProductController ={
    createProduct
}