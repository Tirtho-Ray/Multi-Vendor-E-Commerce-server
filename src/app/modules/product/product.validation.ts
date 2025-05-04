import { z } from 'zod';

const CreateProductValidationSchema = z.object({
    body:z.object({

    })
}
)

const UpdateProductValidationSchema = z.object({
    body: z.object ({

    })
})

export  const  ProductValidation ={
    CreateProductValidationSchema,
    UpdateProductValidationSchema
}