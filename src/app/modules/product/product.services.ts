/* eslint-disable @typescript-eslint/no-explicit-any */
import { TProduct } from "./product.interface";
import { Product } from "./product.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { QueryBuilder } from "../../builder/QueryBuilder";
import { ProductSearchableFields } from "./product.constant";
import { Category } from "../category/category.model"; 
import { SubCategory } from "../sub-category/sub_category.model";


const createProductIntoDB = async (payload: TProduct) => {
  
  if (payload.item?.category) {
    const isCategoryExist = await Category.findById(payload.item.category);
    if (!isCategoryExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "Category not found");
    }
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, "Category is required");
  }
  if (payload.item?.subCategory) {
    const isSubCategoryExist = await SubCategory.findById(payload.item.subCategory);
    if (!isSubCategoryExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "subCategory not found");
    }
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, "subCategory is required");
  }

  payload.status = "pending";
  const product = await Product.create(payload);
  return product;
};



const getAllProductIntoDB = async (query: Record<string, unknown>) => {
  const baseQuery = Product.find(
    { status: "active", visibility: "public" },
    {
      // Select only public fields
      productId: 1,
      "item.name": 1,
      "item.slug": 1,
      "item.description": 1,
      "item.price": 1,
      "item.quantity": 1,
      "item.brand": 1,
      "item.tags": 1,
      "item.picture": 1,
      "item.manyPictures": 1,
      "item.variants": 1,
      "item.category": 1,
      "item.subCategory": 1,
      shipping: 1,
      reviews: 1,
      seo: 1,
      vendorID: 1, 
      status: 1,
      visibility: 1,
      soldCount: 1,
       discount: 1
    }
  ).populate([
    // { path: "vendorID", select: "name email" }, 
    { path: "item.category", select: "name slug" },
    { path: "item.subCategory", select: "name slug" },
    { path: "vendorID", select: "name email" },
  ]);

  const productQuery = new QueryBuilder(baseQuery, query)
    .search(ProductSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await productQuery.modelQuery.lean();
  return result;
};

const getProductById = async (id:string) =>{
  const product  = Product.findById(id);
  return product
};






// Vendor: get own products (any status) -> check ok
const getMyProductsFromDB = async (vendorID: string) => {
  return await Product.find({ vendorID: vendorID })
    .populate([
  { path: "item.category", select: "name " },
  { path: "item.subCategory", select: "name " },
  { path: "vendorID", select: "name email" },
  // { path: "approvedBy", select: "name email" } 
])

    .lean();
};


// Vendor update (except status)
const updateProductInDB = async (productId: string, vendorID: string, payload: Partial<TProduct>) => {
  const product = await Product.findOne({ _id: productId, vendorID: vendorID });
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found or not owned by you");
  }

  // prevent vendor changing status via this update route
  if ((payload as any).status) {
    delete (payload as any).status;
  }

  // ensure subCategory limit
  if (payload.item && Array.isArray(payload.item.subCategory) && payload.item.subCategory.length > 5) {
    throw new AppError(httpStatus.BAD_REQUEST, "You can select maximum 5 subcategories");
  }

  const updated = await Product.findByIdAndUpdate(productId, payload, {
    new: true,
    runValidators: true,
  });
  return updated;
};

const deleteProductFromDB = async (productId: string, vendorId: string) => {
  const product = await Product.findOne({ _id: productId, "vendor.vendorId": vendorId });
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found or not owned by you");
  }

  await Product.findByIdAndDelete(productId);
  return product;
};

// Admin: approve product (pending -> active)
const approveProductByAdmin = async (productId: string) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  product.status = "active";
  await product.save();
  return product;
};

// Admin: reject product (set rejected + optional adminNotes)
const rejectProductByAdmin = async (productId: string, adminNotes?: string) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }
  product.status = "rejected";
  if (adminNotes) product.adminNotes = adminNotes;
  await product.save();
  return product;
};

// Vendor: toggle active <-> inactive (but cannot make pending->active)
const vendorToggleStatus = async (productId: string, vendorID: string, newStatus: "active" | "inactive") => {
  const product = await Product.findOne({ _id: productId, vendorID: vendorID });
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found or not owned by you");
  }

  // if trying to set active but product was never approved by admin (pending/rejected) -> disallow
  if (newStatus === "active" && product.status === "pending") {
    throw new AppError(httpStatus.FORBIDDEN, "Product is pending admin approval. Admin must approve before setting active.");
  }
  if (newStatus === "active" && product.status === "rejected") {
    throw new AppError(httpStatus.FORBIDDEN, "Rejected product cannot be activated by vendor.");
  }

  product.status = newStatus;
  await product.save();
  return product;
};

// Admin: get all (include pending/rejected/active)
const adminGetAllProducts = async () => {
  return await Product.find().populate("item.category item.subCategory vendorID").lean();
};

export const ProductServices = {
  createProductIntoDB,
  getAllProductIntoDB,
  getProductById,
  getMyProductsFromDB,
  updateProductInDB,
  deleteProductFromDB,
  approveProductByAdmin,
  rejectProductByAdmin,
  vendorToggleStatus,
  adminGetAllProducts,
};
