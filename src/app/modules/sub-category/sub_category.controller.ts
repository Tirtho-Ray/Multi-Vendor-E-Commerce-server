import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SubCategoryServices } from "./sub_category.services";

const createSubCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await SubCategoryServices.createSubCategory(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Subcategory created successfully!",
    data: result,
  });
});

const getAllSubCategories = catchAsync(async (_req: Request, res: Response) => {
  const result = await SubCategoryServices.getAllSubCategories();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Subcategories fetched successfully!",
    data: result,
  });
});

const getSingleSubCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await SubCategoryServices.getSingleSubCategory(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Subcategory fetched successfully!",
    data: result,
  });
});

const updateSubCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await SubCategoryServices.updateSubCategory(req.params.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Subcategory updated successfully!",
    data: result,
  });
});

const deleteSubCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await SubCategoryServices.deleteSubCategory(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Subcategory deleted successfully!",
    data: result,
  });
});

export const SubCategoryController = {
  createSubCategory,
  getAllSubCategories,
  getSingleSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
