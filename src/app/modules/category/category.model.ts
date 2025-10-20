import { Schema, model } from 'mongoose';
import { TCategory } from './category.interface';

const CategorySchema = new Schema<TCategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    picture: { type: String, required: true, unique: true, trim: true },
  },
  {
    timestamps: true,
  }
);

export const Category = model<TCategory>('Category', CategorySchema);
