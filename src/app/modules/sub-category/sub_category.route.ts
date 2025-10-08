import express from "express";
import { SubCategoryController } from "./sub_category.controller";

const router = express.Router();

router.post(
  "/create-sub-category",
  // auth(USER_ROLE.ADMIN),
  SubCategoryController.createSubCategory
);

router.get("/", SubCategoryController.getAllSubCategories);
router.get("/:id", SubCategoryController.getSingleSubCategory);
router.patch("/:id", SubCategoryController.updateSubCategory);
router.delete("/:id", SubCategoryController.deleteSubCategory);

export const SubCategoryRouter = router;
