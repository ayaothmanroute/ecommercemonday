import { Router } from "express";
import { isAuthenticated } from "./../../middlware/authentication.middleware.js";
import { isAuthorized } from "./../../middlware/authorization.middleware.js";
import { validation } from "./../../middlware/validation.middleware.js";
import * as orderSchema from "./order.schema.js";
import * as orderController from "./order.controller.js";

const router = Router();

// create order
router.post(
  "/",
  isAuthenticated,
  isAuthorized("user"),
  validation(orderSchema.createOrder),
  orderController.createOrder
);

// cancel order
router.patch(
  "/:id",
  isAuthenticated,
  isAuthorized("user"),
  validation(orderSchema.cancelOrder),
  orderController.cancelOrder
);
export default router;
