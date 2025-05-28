import { TImage } from "./image.interface"
import { Image } from "./image.model"

const createImageIntoDB = async (payload:TImage)=>{
    const image = Image.create(payload);
    return image;
}

export const ImageServices ={
    createImageIntoDB
}