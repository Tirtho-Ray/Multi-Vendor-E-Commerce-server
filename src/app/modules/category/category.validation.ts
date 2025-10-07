

import { z } from 'zod';

const subCategorySchema = z.object({
 


  name: z
    .string()
    .nonempty("Subcategory name is required")
    .min(2, "Subcategory name must be at least 2 characters")
    .max(100, "Subcategory name cannot exceed 100 characters")
    .trim(),
});

const categoryValidationSchema = z.object({
   body:z.object({
  name: z
    .string()
    .nonempty("Category name is required")
    .min(3, "Category name must be at least 3 characters")
    .max(200, "Category name cannot exceed 200 characters")
    .trim(),
  subCategories: z
    .array(subCategorySchema)
    .min(1, "At least one subcategory is required")
})
});

export const CategoryValidation = {
  categoryValidationSchema,
};
