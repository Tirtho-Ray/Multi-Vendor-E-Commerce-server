import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { ProductValidation } from "./product.validation";
import { ProductController } from "./product.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";

const router = express.Router();

// Create product (Vendor) -> status = pending
router.post(
  "/create-product",
  auth(USER_ROLE.VENDOR),
  validateRequest(ProductValidation.CreateProductValidationSchema),
  ProductController.createProduct
);

// Public: only active products
router.get("/", ProductController.getAllProduct);
router.get("/:id",ProductController.getProductById);

// Vendor routes
router.get("/my-products", auth(USER_ROLE.VENDOR), ProductController.getMyProducts);//{null come populate VendorID}
router.patch("/:id", auth(USER_ROLE.VENDOR), validateRequest(ProductValidation.UpdateProductValidationSchema), ProductController.updateProduct);
router.delete("/:id", auth(USER_ROLE.VENDOR), ProductController.deleteProduct);

// Vendor toggle active/inactive
router.patch("/:id/status", auth(USER_ROLE.VENDOR), ProductController.toggleProductStatus);

// Admin routes
router.patch("/approve/:id", auth(USER_ROLE.ADMIN), ProductController.approveProduct);
router.patch("/reject/:id", auth(USER_ROLE.ADMIN), ProductController.rejectProduct);
router.get("/admin/all", 
  // auth(USER_ROLE.ADMIN), 
  ProductController.adminGetAllProducts);

export const ProductRouter = router;
