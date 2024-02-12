import { Router } from "express";
import { isAuthenticated } from "./../../middlware/authentication.middleware.js";
import { isAuthorized } from "./../../middlware/authorization.middleware.js";
import { validation } from "./../../middlware/validation.middleware.js";
import { fileUpload } from "./../../utils/fileUpload.js";
import * as productController from "./product.controller.js";
import * as productSchema from "./product.schema.js";
import reviewRouter from "./../review/review.router.js";
const router = Router();

router.use("/:productId/review", reviewRouter);

// create product
router.post(
  "/",
  isAuthenticated,
  isAuthorized("seller"),
  fileUpload().fields([
    // req.files >>> object
    { name: "defaultImage", maxCount: 1 }, // array
    { name: "subImages", maxCount: 3 },
  ]),
  validation(productSchema.createProduct),
  productController.createProduct
);

// delete product
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("seller"),
  validation(productSchema.deleteProduct),
  productController.deleteProduct
);

// get products
router.get("/", productController.allProducts);

export default router;
