import { Router } from "express";
import { isAuthenticated } from "./../../middlware/authentication.middleware.js";
import { validation } from "./../../middlware/validation.middleware.js";
import { isAuthorized } from "./../../middlware/authorization.middleware.js";
import * as couponSchema from "./coupon.schema.js";
import * as couponController from "./coupon.controller.js";

const router = Router();

// create coupon
router.post(
  "/",
  isAuthenticated,
  isAuthorized("seller"),
  validation(couponSchema.createCoupon),
  couponController.createCoupon
);

//update coupon
router.patch(
  "/:code",
  isAuthenticated,
  isAuthorized("seller"),
  validation(couponSchema.updateCoupon),
  couponController.updateCoupon
);

// delete coupon
router.delete(
  "/:code",
  isAuthenticated,
  isAuthorized("seller"),
  validation(couponSchema.deleteCoupon),
  couponController.deleteCoupon
);

// all coupons
router.get(
  "/",
  isAuthenticated,
  isAuthorized("admin", "seller"),
  couponController.allCoupons
);

export default router;
