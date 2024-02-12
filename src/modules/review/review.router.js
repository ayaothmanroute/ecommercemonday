import { Router } from "express";
import { isAuthenticated } from "./../../middlware/authentication.middleware.js";
import { isAuthorized } from "./../../middlware/authorization.middleware.js";
import { validation } from "./../../middlware/validation.middleware.js";
import * as reviewController from "./review.controller.js";
import * as reviewSchema from "./review.schema.js";
const router = Router({ mergeParams: true });

// add review
router.post(
  "/",
  isAuthenticated,
  isAuthorized("user"),
  validation(reviewSchema.addReview),
  reviewController.addReview
);

// update review
router.patch(
  "/:id",
  isAuthenticated,
  isAuthorized("user"),
  validation(reviewSchema.updateReview),
  reviewController.updateReview
);

export default router;
