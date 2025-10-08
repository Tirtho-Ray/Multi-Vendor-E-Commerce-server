import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { SubCategory, TSubCategory } from "./sub_category.model";
import { Category } from "../category/category.model";



const createSubCategory = async (payload: TSubCategory) => {
  //  Check if the mainCategoryId exists
  const mainCategoryExists = await Category.findById(payload.mainCategoryId);

  if (!mainCategoryExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Main category not found");
  }

  //  Check for duplicate subcategory under same main category
  const exists = await SubCategory.findOne({
    name: payload.name,
    mainCategoryId: payload.mainCategoryId,
  });

  if (exists) {
    throw new AppError(httpStatus.CONFLICT, "Subcategory already exists under this category.");
  }

  //  Create subcategory
  const category = await SubCategory.create(payload);
  return category;
};


const getAllSubCategories = async () => {
  return await SubCategory.find().populate("mainCategoryId");
};

const getSingleSubCategory = async (id: string) => {
  const subCategory = await SubCategory.findById(id).populate("mainCategoryId");
  if (!subCategory) {
    throw new AppError(httpStatus.NOT_FOUND, "Subcategory not found");
  }
  return subCategory;
};

const updateSubCategory = async (id: string, payload: Partial<TSubCategory>) => {
  const existing = await SubCategory.findOne({
    _id: { $ne: id },
    name: payload.name,
    mainCategoryId: payload.mainCategoryId,
  });

  if (existing) {
    throw new AppError(httpStatus.CONFLICT, "Another subcategory with the same name exists in this main category.");
  }

  const updated = await SubCategory.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    throw new AppError(httpStatus.NOT_FOUND, "Subcategory not found");
  }

  return updated;
};

const deleteSubCategory = async (id: string) => {
  const deleted = await SubCategory.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Subcategory not found");
  }
  return deleted;
};

export const SubCategoryServices = {
  createSubCategory,
  getAllSubCategories,
  getSingleSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
