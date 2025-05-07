import { TProduct } from "./product.interface"
import { Product } from "./product.model"

const  createProductIntoDB  = async (payload: TProduct) =>{
    const product  = await Product.create(payload);
    return product;
}

const getAllProductIntoDB = async ( ) =>{
    const result  = await Product.find();
    return result;

}



export const ProductServices ={
    createProductIntoDB,
    getAllProductIntoDB
}