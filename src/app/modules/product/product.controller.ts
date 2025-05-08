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

const getAllProduct  = catchAsync( async (req, res) =>{
    const result = await ProductServices.getAllProductIntoDB();

    sendResponse(res,{
        success : true,
        statusCode:httpStatus.OK,
        message:"Product retrive succfully",
        data:result

    })
})

export const ProductController ={
    createProduct,
    getAllProduct
}