import z from "zod"
const ImageValidationSchema =z.object({
    body:z.object({
        image:z.object({
            uploadImage:z.string().max(1,{message:"you can upload many image"}),
            UploadManyImage:z.string().max(5,{message:"you can upload max 10 image"})
        }),
    }),
});

export const ImageValidation ={
    ImageValidationSchema
}