import express from "express"
import { ImageController } from "./image.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ImageValidation } from "./image.validation";
const router = express.Router();
router.post('/create-image',
    validateRequest(ImageValidation.ImageValidationSchema),
    ImageController.createImage)

export const ImageRouter = router;