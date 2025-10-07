
import { Schema, model } from 'mongoose';
import { TCategory } from './category.interface';


const SubCategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
  },
  { _id: true }
);

const CategorySchema = new Schema<TCategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    subCategories: { type: [SubCategorySchema], default: [] },
  },
  {
    timestamps: true,
  }
);

export const Category = model<TCategory>('Category', CategorySchema);
