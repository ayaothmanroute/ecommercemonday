import { Router } from "express";
import * as brandController from "./brand.controller.js";
import * as brandSchema from "./brand.schema.js";
import { isAuthenticated } from "./../../middlware/authentication.middleware.js";
import { isAuthorized } from "./../../middlware/authorization.middleware.js";
import { fileUpload } from "./../../utils/fileUpload.js";
import { validation } from "../../middlware/validation.middleware.js";

const router = Router();

// CRUD
// create brand
router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload().single("brand"),
  validation(brandSchema.createBrand),
  brandController.createBrand
);

// update brand
router.patch(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload().single("brand"),
  validation(brandSchema.updateBrand),
  brandController.updateBrand
);

// delete brand
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  validation(brandSchema.deleteBrand),
  brandController.deleteBrand
);

// get brands
router.get("/", brandController.getBrand);
export default router;
