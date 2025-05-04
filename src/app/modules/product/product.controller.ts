import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProductServices } from "./product.services";
import httpStatus from 'http-status';

const createProduct = catchAsync( async (req,res )=>{
    const result  =  ProductServices.createProductIntoDB(req.body);

    sendResponse(res, {
        success:true,
        statusCode:httpStatus.OK,
        message:"Product Create Succfully",
        data:result
    });

});

export const ProductController ={
    createProduct
}