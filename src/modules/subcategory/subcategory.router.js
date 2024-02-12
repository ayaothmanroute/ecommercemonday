import { Router } from "express";
import { isAuthenticated } from "../../middlware/authentication.middleware.js";
import { fileUpload } from "../../utils/fileUpload.js";
import { isAuthorized } from "../../middlware/authorization.middleware.js";
import { validation } from "../../middlware/validation.middleware.js";
import * as subcategoryController from "./subcategory.controller.js";
import * as subcategorySchema from "./subcategory.schema.js";
const router = Router({ mergeParams: true });
// CRUD
router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload().single("subcategory"),
  validation(subcategorySchema.createSubcategory),
  subcategoryController.createSubcategory
);

// update
router.patch(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload().single("subcategory"),
  validation(subcategorySchema.updateSubcategory),
  subcategoryController.updateSubcategory
);

// delete
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  validation(subcategorySchema.deleteSubcategory),
  subcategoryController.deleteSubcategory
);

// all subcategories
router.get(
  "/",
  validation(subcategorySchema.getSubcategories),
  subcategoryController.allSubcategories
);

export default router;
