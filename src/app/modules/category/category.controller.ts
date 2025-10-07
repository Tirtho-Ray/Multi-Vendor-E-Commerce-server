import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";

import { CategoryServices } from "./category.services";
import AppError from "../../errors/AppError";
import sendResponse from "../../utils/sendResponse";


const createCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await CategoryServices.createCategoryIntoDB(req.body);

    if (!result) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to create category!");
    }

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: " Category created successfully!",
        data: result,
    });
});


const getAllCategories = catchAsync(async (_req: Request, res: Response) => {
    const result = await CategoryServices.getAllCategoriesFromDB();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: " Categories fetched successfully!",
        data: result,
    });
});


const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;


    if (!id) {
        throw new AppError(httpStatus.BAD_REQUEST, "Category ID is required!");
    }
    const result = await CategoryServices.getSingleCategoryFromDB(id);

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, " Category not found!");
    }

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: " Category fetched successfully!",
        data: result,
    });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        throw new AppError(httpStatus.BAD_REQUEST, "Category ID is required!");
    }
    const result = await CategoryServices.updateCategoryInDB(id, req.body);

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, " Category not found for update!");
    }

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: " Category updated successfully!",
        data: result,
    });
});

const renameCategory = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        throw new AppError(httpStatus.BAD_REQUEST, "Category ID is required!");
    }
    const result = await CategoryServices.renameSubCategory(id, req.body);

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, " Category not found for update!");
    }

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: " Category updated successfully!",
        data: result,
    });
});


const deleteCategory = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        throw new AppError(httpStatus.BAD_REQUEST, "Category ID is required!");
    }
    const result = await CategoryServices.deleteCategoryFromDB(id);



    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, " Category not found for delete!");
    }

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "🗑️ Category deleted successfully!",
        data: result,
    });
});

export const CategoryController = {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory,
    renameCategory
};
