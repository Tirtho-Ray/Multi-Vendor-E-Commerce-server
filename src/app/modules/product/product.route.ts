import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidation } from './product.validation';
import { ProductController } from './product.controller';


const router = express.Router();

router.post('/create-product',validateRequest(ProductValidation.CreateProductValidationSchema),ProductController.createProduct);

export const ProductRouter = router;