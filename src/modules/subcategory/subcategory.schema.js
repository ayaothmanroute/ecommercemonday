import joi from "joi";
import { isValidObjectId } from "./../../middlware/validation.middleware.js";

export const createSubcategory = joi
  .object({
    name: joi.string().min(5).max(20).required(),
    category: joi.string().custom(isValidObjectId).required(),
  })
  .required();

export const updateSubcategory = joi.object({
  name: joi.string().min(5).max(20),
  id: joi.string().custom(isValidObjectId).required(), // subcategory
  category: joi.string().custom(isValidObjectId).required(),
});

export const deleteSubcategory = joi
  .object({
    id: joi.string().custom(isValidObjectId).required(),
    category: joi.string().custom(isValidObjectId).required(),
  })
  .required();

export const getSubcategories = joi
  .object({
    category: joi.string().custom(isValidObjectId),
  })
  .required();
