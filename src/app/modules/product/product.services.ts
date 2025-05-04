import { TProduct } from "./product.interface"
import { Product } from "./product.model"

const  createProductIntoDB  = async (payload: TProduct) =>{
    const product  = await Product.create(payload);
    return product;

}



export const ProductServices ={
    createProductIntoDB
}