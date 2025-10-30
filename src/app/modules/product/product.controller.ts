import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProductServices } from "./product.services";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Types } from "mongoose";

const createProduct = catchAsync(async (req, res) => {
  //  Check authentication
  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  // Check role (only vendor can create product)
  if (req.user.role !== "VENDOR") {
    throw new AppError(httpStatus.FORBIDDEN, "Only vendors can create products");
  }

  // 3Inject vendorID from logged in user
  if (!req.user.id) {
    throw new AppError(httpStatus.BAD_REQUEST, "Vendor ID missing in token");
  }
 req.body.vendorID = new Types.ObjectId(req.user.id);
//  console.log( req.body.vendorID)
//  console.log(req.user.id)

  // 4 Set default status
  req.body.status = "pending";

  //Optional: Validate subCategory limit
  if (req.body.item?.subCategory && Array.isArray(req.body.item.subCategory)) {
    if (req.body.item.subCategory.length > 5) {
      throw new AppError(httpStatus.BAD_REQUEST, "Maximum 5 subcategories allowed");
    }
  }

  // Call service to create product
  const result = await ProductServices.createProductIntoDB(req.body);
  //Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Product created successfully (pending admin approval)",
    data: result,
  });
});



const getAllProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.getAllProductIntoDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Products retrieved successfully",
    data: result,
  });
});

const getPendingProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.getPendingProduct();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Products retrieved successfully",
    data: result,
  });
});

const getProductById = catchAsync(async(req,res) =>{
  const {id} =req.params
  const result = await ProductServices.getProductById(id);
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Products retrieved successfully",
    data: result,
  });
})

const getMyProducts = catchAsync(async (req, res) => {
  if (!req.user) throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  const vendorId = req.user.id;
  const result = await ProductServices.getMyProductsFromDB(vendorId);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "My products retrieved successfully", data: result });
});

const updateProduct = catchAsync(async (req, res) => {
  if (!req.user) throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  if (req.user.role !== "VENDOR") throw new AppError(httpStatus.FORBIDDEN, "Only vendors can update products");

  const vendorId = req.user.id;
  const productId = req.params.id;
  const updatedData = req.body;

  const result = await ProductServices.updateProductInDB(productId, vendorId, updatedData);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Product updated successfully", data: result });
});

const deleteProduct = catchAsync(async (req, res) => {
  if (!req.user) throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  if (req.user.role !== "VENDOR") throw new AppError(httpStatus.FORBIDDEN, "Only vendors can delete products");

  const vendorId = req.user.id;
  const productId = req.params.productId;

  const result = await ProductServices.deleteProductFromDB(productId, vendorId);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Product deleted successfully", data: result });
});

// Vendor toggles own product active <-> inactive (cannot bypass initial admin approval)
const toggleProductStatus = catchAsync(async (req, res) => {
  if (!req.user) throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  if (req.user.role !== "VENDOR") throw new AppError(httpStatus.FORBIDDEN, "Only vendors can change product status");

  const vendorId = req.user.id;
  const productId = req.params.productId;
  const { status } = req.body as { status: "active" | "inactive" };

  if (!status || !["active", "inactive"].includes(status)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Status must be 'active' or 'inactive'");
  }

  const result = await ProductServices.vendorToggleStatus(productId, vendorId, status);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Product status updated", data: result });
});

// ------------------------------------------------ADMIN-------------------------------------
// Admin approve product
const reviewProductByAdmin = catchAsync(async (req, res) => {
  if (!req.user) throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  if (req.user.role !== "ADMIN") throw new AppError(httpStatus.FORBIDDEN, "Only admin can review products");

  const productId = req.params.id;
  const { action, adminNotes } = req.body;

  if (!["active", "reject"].includes(action)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Action must be 'active' or 'reject'");
  }

  const adminId = req.user.id; //  current admin

  const result = await ProductServices.reviewProductByAdmin(
    productId,
    action,
    adminNotes,
    adminId
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `Product ${action}d successfully`,
    data: result,
  });
});


// Admin: get all
const adminGetAllProducts = catchAsync(async (req, res) => {
  // if (!req.user) throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  // if (req.user.role !== "ADMIN") throw new AppError(httpStatus.FORBIDDEN, "Only admin can view all products");

  const result = await ProductServices.adminGetAllProducts();
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "All products retrieved", data: result });
});

export const ProductController = {
  createProduct,
  getAllProduct,
  getMyProducts,
  getPendingProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  reviewProductByAdmin,
  adminGetAllProducts,
};
