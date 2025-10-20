import express from 'express';
import auth from '../../middlewares/auth';

import validateRequest from './../../middlewares/validateRequest';
import { CategoryValidation } from './category.validation';
import { USER_ROLE } from '../User/user.constant';
import { CategoryController } from './category.controller';
import { multerUpload } from '../../config/multer.config';

const router = express.Router();


router.post('/create-category',
    multerUpload.single("picture"),
    validateRequest(CategoryValidation.categoryValidationSchema),
// auth(USER_ROLE.ADMIN), 
CategoryController.createCategory);
router.get('/',
    // auth(USER_ROLE.ADMIN,USER_ROLE.SUPER_ADMIN), 
    CategoryController.getAllCategories);
router.get('/:id',auth(USER_ROLE.ADMIN), CategoryController.getCategoryById)
router.put('/rename-category/:id', CategoryController.updateCategory);
router.delete('/:id',auth(USER_ROLE.ADMIN), CategoryController.deleteCategory);

export const CategoryRouter = router;
