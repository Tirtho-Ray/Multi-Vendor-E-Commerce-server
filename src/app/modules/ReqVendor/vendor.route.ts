import  express  from "express"
import { VendorController } from "./vendor.controller";
const router = express.Router();

router.post('/create-vendor',VendorController.CreateVendor);

export const VendorRouter = router;