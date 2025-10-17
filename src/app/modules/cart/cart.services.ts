/* eslint-disable @typescript-eslint/no-explicit-any */
import { Cart } from "./cart.model";
import { Product } from "../product/product.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { ICartItem } from "./cart.interface";
import { TProduct } from "../product/product.interface";

// Add or update cart item
const addToCart = async (userId: string, item: ICartItem) => {
  const product = await Product.findById(item.productId);
  if (!product || product.status !== "active" || product.visibility !== "public") {
    throw new AppError(httpStatus.BAD_REQUEST, "This product is no longer available");
  }

  if (item.quantity > product.item.quantity) {
    throw new AppError(httpStatus.BAD_REQUEST, "Quantity exceeds available stock");
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({ userId, items: [item] });
    return cart;
  }

  // Check if same product + variant exists
  const existingIndex = cart.items.findIndex(
    (i) =>
      i.productId.toString() === item.productId.toString() &&
      JSON.stringify(i.selectedVariant || {}) === JSON.stringify(item.selectedVariant || {})
  );

  if (existingIndex > -1) {
    // Update quantity
    const newQuantity = cart.items[existingIndex].quantity + item.quantity;
    if (newQuantity > product.item.quantity) {
      throw new AppError(httpStatus.BAD_REQUEST, "Quantity exceeds available stock");
    }
    cart.items[existingIndex].quantity = newQuantity;
    cart.items[existingIndex].isBlocked = false;
  } else {
    // Check max 5 items
    if (cart.items.length >= 5) {
      throw new AppError(httpStatus.BAD_REQUEST, "Cannot add more than 5 different products in cart");
    }
    cart.items.push(item);
  }

  await cart.save();
  return cart;
};

// Remove item from cart
const removeFromCart = async (userId: string, productId: string, selectedVariant?: Record<string, any>) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new AppError(httpStatus.NOT_FOUND, "Cart not found");

  // Check if item exists
  const itemIndex = cart.items.findIndex(
    (i) =>
      i.productId.toString() === productId &&
      JSON.stringify(i.selectedVariant || {}) === JSON.stringify(selectedVariant || {})
  );

  if (itemIndex === -1) {
    // Item not found → throw error
    throw new AppError(httpStatus.NOT_FOUND, "Item not found in cart");
  }

  // Remove the item
  cart.items.splice(itemIndex, 1);
  await cart.save();

  return cart;
};


// Update quantity
const updateCartItemQuantity = async (
  userId: string,
  productId: string,
  quantity: number,
  selectedVariant?: Record<string, any>
) => {
  if (quantity < 1) throw new AppError(httpStatus.BAD_REQUEST, "Quantity must be at least 1");

  const cart = await Cart.findOne({ userId });
  if (!cart) throw new AppError(httpStatus.NOT_FOUND, "Cart not found");

  const item = cart.items.find(
    (i) =>
      i.productId.toString() === productId &&
      JSON.stringify(i.selectedVariant || {}) === JSON.stringify(selectedVariant || {})
  );
  if (!item) throw new AppError(httpStatus.NOT_FOUND, "Item not found in cart");

  const product = await Product.findById(productId);
  if (!product || product.status !== "active" || product.visibility !== "public") {
    item.isBlocked = true;
  } else if (quantity > product.item.quantity) {
    throw new AppError(httpStatus.BAD_REQUEST, "Quantity exceeds available stock");
  } else {
    item.quantity = quantity;
    item.isBlocked = false;
  }

  await cart.save();
  return cart;
};

// Get cart (auto block deleted products)
const getCart = async (userId: string) => {
  const cart = await Cart.findOne({ userId }).populate({
    path: "items.productId",
    select: "item.name item.price item.picture status visibility item.quantity",
  });

  if (!cart) return { userId, items: [] };

  cart.items.forEach((i) => {
    const product = i.productId as unknown as TProduct;
    if (!product || product.status !== "active" || product.visibility !== "public") {
      i.isBlocked = true;
    }
  });

  await cart.save();
  return cart;
};

export const CartServices = {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  getCart,
};
