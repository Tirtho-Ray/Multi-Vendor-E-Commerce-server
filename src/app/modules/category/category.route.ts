import express from 'express';
import { CategoryController } from './category.controller';
import auth from '../../middlewares/auth';

import validateRequest from './../../middlewares/validateRequest';
import { CategoryValidation } from './category.validation';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();


router.post('/create-category',validateRequest(CategoryValidation.categoryValidationSchema),
// auth(USER_ROLE.ADMIN), 
CategoryController.createCategory);
router.get('/',auth(USER_ROLE.ADMIN), CategoryController.getAllCategories);
router.get('/:id',auth(USER_ROLE.ADMIN), CategoryController.getSingleCategory);
router.put('/add-sub-category/:id', CategoryController.updateCategory);//this is mai category 
router.put('/rename-sub-category/:id', CategoryController.renameCategory);
router.delete('/:id',auth(USER_ROLE.ADMIN), CategoryController.deleteCategory);

export const CategoryRouter = router;
