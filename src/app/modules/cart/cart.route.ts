import { Router } from "express";
import { CartController } from "./cart.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";


const router = Router();

router.post("/add",auth(USER_ROLE.USER), CartController.addToCart);
router.post("/remove",auth(USER_ROLE.USER), CartController.removeFromCart);
router.post("/update",auth(USER_ROLE.USER), CartController.updateCartItemQuantity);
router.get("/",auth(USER_ROLE.USER), CartController.getCart);

export const CartRoutes = router;
