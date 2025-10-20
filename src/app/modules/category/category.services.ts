import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TCategory } from "./category.interface";
import { Category } from "./category.model";

// Create
const createCategory = async (payload: TCategory) => {
  const exists = await Category.findOne({ name: payload.name });

  if (exists) {
    throw new AppError(httpStatus.CONFLICT, "Category already exists.");
  }

  const category = await Category.create(payload);
  return category;
};

// Get All
const getAllCategories = async () => {
  const categories = await Category.find();
  return categories;
};

// Get One
const getCategoryById = async (id: string) => {
  const category = await Category.findById(id);

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found.");
  }

  return category;
};

// Update
const updateCategory = async (id: string, payload: Partial<TCategory>) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found.");
  }

  if (payload.name) {
    const exists = await Category.findOne({ name: payload.name });
    if (exists && exists._id.toString() !== id) {
      throw new AppError(httpStatus.CONFLICT, "Category name already in use.");
    }
    category.name = payload.name;
  }

  const updated = await category.save();
  return updated;
};

// Delete
const deleteCategory = async (id: string) => {
  const deleted = await Category.findByIdAndDelete(id);

  if (!deleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found.");
  }

  return deleted;
};

export const CategoryServices = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
