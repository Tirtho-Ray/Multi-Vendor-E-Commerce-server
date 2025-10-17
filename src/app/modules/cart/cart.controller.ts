import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CartServices } from "./cart.services";
import httpStatus from "http-status";

const addToCart = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const item = req.body; // { productId, quantity, selectedVariant }

  const cart = await CartServices.addToCart(userId, item);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Item added to cart",
    data: cart,
  });
});

const removeFromCart = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { productId, selectedVariant } = req.body;

  const cart = await CartServices.removeFromCart(userId, productId, selectedVariant);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Item removed from cart",
    data: cart,
  });
});

const updateCartItemQuantity = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity, selectedVariant } = req.body;

  const cart = await CartServices.updateCartItemQuantity(userId, productId, quantity, selectedVariant);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Cart updated",
    data: cart,
  });
});

const getCart = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const cart = await CartServices.getCart(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Cart retrieved",
    data: cart,
  });
});

export const CartController = {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  getCart,
};
