import { Router } from "express";
import { isAuthenticated } from "./../../middlware/authentication.middleware.js";
import { isAuthorized } from "./../../middlware/authorization.middleware.js";
import { validation } from "./../../middlware/validation.middleware.js";
import * as cartController from "./cart.controller.js";
import * as cartSchema from "./cart.schema.js";
const router = Router();

// add to cart
router.post(
  "/",
  isAuthenticated,
  isAuthorized("user"),
  validation(cartSchema.addToCart),
  cartController.addToCart
);

// get user cart
router.get(
  "/",
  isAuthenticated,
  isAuthorized("user", "admin"),
  validation(cartSchema.userCart),
  cartController.userCart
);

// update cart
router.patch(
  "/",
  isAuthenticated,
  isAuthorized("user"),
  validation(cartSchema.updateCart),
  cartController.updateCart
);

/////////////////////////////////////
// remove product from cart
router.patch(
  "/:productId",
  isAuthenticated,
  isAuthorized("user"),
  validation(cartSchema.removeFromCart),
  cartController.removeFromCart
);

// clear cart
router.put(
  "/clear",
  isAuthenticated,
  isAuthorized("user"),
  cartController.clearCart
);

export default router;
