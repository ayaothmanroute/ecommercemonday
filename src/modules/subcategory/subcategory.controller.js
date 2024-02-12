import slugify from "slugify";
import { Category } from "../../../DB/models/category.model.js";
import { Subcategory } from "../../../DB/models/subcategory.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";

export const createSubcategory = asyncHandler(async (req, res, next) => {
  // check category
  const category = await Category.findById(req.params.category);
  if (!category) return next(new Error("category not found!"));

  // check file
  if (!req.file)
    return next(new Error("Subcategory image is required!", { cause: 400 }));

  // upload image in cloudinary
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.CLOUD_FOLDER_NAME}/subcategory`,
    }
  );

  // save subcategory in database
  await Subcategory.create({
    name: req.body.name, // Mobile Phone
    slug: slugify(req.body.name), // mobile-phone
    createdBy: req.user._id,
    image: { id: public_id, url: secure_url },
    category: req.params.category,
  });

  // return response
  return res.json({
    success: true,
    message: "subcategory created succussfully!",
  });
});

export const updateSubcategory = asyncHandler(async (req, res, next) => {
  // check category in database
  const category = await Category.findById(req.params.category);
  if (!category) return next(new Error("Category not found!", { cause: 404 }));

  // check subcategory
  const subcategory = await Subcategory.findOne({
    _id: req.params.id,
    category: req.params.category,
  });
  if (!subcategory)
    return next(new Error("Subcategory not found!", { cause: 404 }));

  // check if category is the parent

  // check subcategory owner
  if (req.user._id.toString() !== subcategory.createdBy.toString())
    return next(new Error("Not allowed to update the subcategory!"));
  // check file >>> upload in cloudinary
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { public_id: subcategory.image.id }
    );
    subcategory.image = { id: public_id, url: secure_url };
  }
  // update subcategory
  subcategory.name = req.body.name ? req.body.name : subcategory.name;
  subcategory.slug = req.body.name ? slugify(req.body.name) : subcategory.slug;

  // save subcategory
  await subcategory.save();

  // return response
  return res.json({
    success: true,
    message: "subcategory updated successfully!",
  });
});

export const deleteSubcategory = asyncHandler(async (req, res, next) => {
  // check category in database
  const category = await Category.findById(req.params.category);
  if (!category) return next(new Error("Category not found!", { cause: 404 }));

  // check subcategory
  const subcategory = await Subcategory.findOne({
    _id: req.params.id,
    category: req.params.category,
  });
  if (!subcategory)
    return next(new Error("Subcategory not found!", { cause: 404 }));

  // check owner
  if (subcategory.createdBy.toString() !== req.user._id.toString())
    return next(new Error("Not allowed to delete!"));

  // delete subcategory from database
  //   await category.remove(); // hooks
  await subcategory.deleteOne();

  // delete image subcategory from cloudinary
  await cloudinary.uploader.destroy(subcategory.image.id);
  // return response
  return res.json({
    success: true,
    message: "subcategory deleted successfully!",
  });
});

export const allSubcategories = asyncHandler(async (req, res, next) => {
  if (req.params.category !== undefined) {
    // check category in database
    const category = await Category.findById(req.params.category);
    if (!category)
      return next(new Error("Category not found!", { cause: 404 }));

    // all subcategories of certain category
    const results = await Subcategory.find({ category: req.params.category });
    return res.json({ success: true, results });
  }

  // const results = await Subcategory.find().populate([
  //   { path: "category", select: "name -_id" },
  //   { path: "createdBy" },
  // ]); // multiple populate

  // const results = await Subcategory.find().populate([
  //   { path: "category", populate: [{ path: "createdBy", select: "email" }] },
  // ]); // nested populate

  const results = await Subcategory.find().populate([
    { path: "category", populate: { path: "createdBy" } },
    { path: "createdBy" },
  ]);
  return res.json({ success: true, results });
});
