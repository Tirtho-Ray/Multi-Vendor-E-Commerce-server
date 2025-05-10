import  express  from "express"
import { VendorController } from "./vendor.controller";
import validateRequest from "../../middlewares/validateRequest";
import { VendorValidation } from "./vendor.validation";
const router = express.Router();

router.post('/create-vendor',validateRequest(VendorValidation.CreateVendorValidationSchema),VendorController.CreateVendor);

export const VendorRouter = router;