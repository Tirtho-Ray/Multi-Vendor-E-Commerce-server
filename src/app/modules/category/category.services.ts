import AppError from "../../errors/AppError";
import { TCategory } from "./category.interface";
import { Category } from "./category.model";

import httpStatus from "http-status";


const createCategoryIntoDB = async (payload: TCategory) => {
  const existing = await Category.findOne({ name: payload.name });
  if (existing) {
    throw new AppError(httpStatus.CONFLICT, "Category already exists!");
  }
  const category = await Category.create(payload);
  return category;
};


const getAllCategoriesFromDB = async () => {
  const categories = await Category.find();
  return categories;
};


const getSingleCategoryFromDB = async (id: string) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found!");
  }
  return category;

  
};

const updateCategoryInDB = async (id: string, payload: Partial<TCategory>) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found!");
  }

  if (payload.subCategories) {
    const existingNames = category.subCategories.map(sub =>
      sub.name.toLowerCase()
    );


    const newSubCategories = payload.subCategories.filter(
      sub => !existingNames.includes(sub.name.toLowerCase())
    );

    if (newSubCategories.length === 0) {
      throw new AppError(
        httpStatus.CONFLICT,
        " subcategories already exist!"
      );
    }
    category.subCategories = [...category.subCategories, ...newSubCategories];
  }

  if (payload.name) {
    category.name = payload.name;
  }

  const updated = await category.save();
  return updated;
};


interface TRenameSubCategory {
  oldName: string;
  newName: string;
}

const renameSubCategory = async (id: string, rename: TRenameSubCategory) => {
  const category = await Category.findById(id);
  if (!category) throw new AppError(httpStatus.NOT_FOUND, "Category not found!");

  const { oldName, newName } = rename;

  if (category.subCategories.some(sub => sub.name.toLowerCase() === newName.toLowerCase())) {
    throw new AppError(httpStatus.CONFLICT, "Subcategory with this name already exists!");
  }

  const sub = category.subCategories.find(sub => sub.name.toLowerCase() === oldName.toLowerCase());
  if (!sub) throw new AppError(httpStatus.NOT_FOUND, "Subcategory not found!");

  sub.name = newName;
  return await category.save();
};




const deleteCategoryFromDB = async (id: string) => {
  const deleted = await Category.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found!");
  }
  return deleted;
};

export const CategoryServices = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  getSingleCategoryFromDB,
  updateCategoryInDB,
  deleteCategoryFromDB,
  renameSubCategory
};
