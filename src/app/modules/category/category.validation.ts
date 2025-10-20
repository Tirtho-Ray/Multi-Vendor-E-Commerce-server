import { z } from 'zod';

const categoryValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .nonempty("Category name is required")
      .min(3, "Category name must be at least 3 characters")
      .max(200, "Category name cannot exceed 200 characters")
      .trim(),
  }),
  // picture:z.string().url("need url formate")
});

export const CategoryValidation = {
  categoryValidationSchema,
};
