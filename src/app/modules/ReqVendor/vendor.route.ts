import express from "express";
import { VendorController } from "./vendor.controller";
import validateRequest from "../../middlewares/validateRequest";
import { VendorValidation } from "./vendor.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";

const router = express.Router();

// USER apply for vendor
router.post(
  "/vendor-req",
  auth(USER_ROLE.USER),
  validateRequest(VendorValidation.CreateVendorValidationSchema),
  VendorController.CreateVendor
);

// Admin view all vendors
router.get("/", auth(USER_ROLE.ADMIN), VendorController.getVendors);

// Admin approves vendor
router.patch(
  "/approve/:vendorId",
   auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  VendorController.approveVendor
);

// Admin update vendor status (block, verify, active)
router.patch(
  "/status/:vendorId",
   auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  VendorController.updateVendorStatus
);

// Admin soft delete
router.delete(
  "/soft/:vendorId",
  auth(USER_ROLE.ADMIN),
  VendorController.softDeleteVendor
);

// Admin hard delete
router.delete(
  "/hard/:vendorId",
   auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  VendorController.hardDeleteVendor
);

// Admin delete all misInfo and rejected vendors
router.delete(
  "/delete-all-misinfo-rejected",
 auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  VendorController.deleteAllMisInfoAndRejected
);

// USER can view their submitted vendor request
router.get(
  "/my-request",
  auth(USER_ROLE.USER, USER_ROLE.VENDOR),
  VendorController.getMyVendorRequest
);



export const VendorRouter = router;
