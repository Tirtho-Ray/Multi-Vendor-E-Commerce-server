import { model, Schema } from "mongoose";
import { TImage } from "./image.interface";

const ImageSchema = new Schema<TImage>(
    {
        image:{
            uploadImage:{type:String,required:true},
            UploadManyImage:[{type:String,required:true}]
        }
    }
);

export const Image = model<TImage>('Image',ImageSchema)