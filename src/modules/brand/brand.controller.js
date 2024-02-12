import { asyncHandler } from "../../utils/asyncHandler.js";
import { Category } from "./../../../DB/models/category.model.js";
import cloudinary from "./../../utils/cloud.js";
import { Brand } from "./../../../DB/models/brand.model.js";
import slugify from "slugify";

export const createBrand = asyncHandler(async (req, res, next) => {
  // check categories
  const { categories, name } = req.body; // ["bsgbsdf", "fdaegwrt"]
  categories.forEach(async (categoryId) => {
    const category = await Category.findById(categoryId);
    if (!category)
      return next(
        new Error(`Category ${categoryId} not found!`, { cause: 404 })
      );
  });

  // file
  if (!req.file)
    return next(new Error("Brand image is required!", { cause: 400 }));

  // upload file in cloudinary
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.CLOUD_FOLDER_NAME}/brands` }
  );

  // save brand in database
  const brand = await Brand.create({
    name,
    createdBy: req.user._id,
    slug: slugify(name),
    image: { url: secure_url, id: public_id },
    // categories
  });

  // save brand in each category
  // category {name: , _id: , slug: , brands: ["vfcasd", "fqerwer"]}
  categories.forEach(async (categoryId) => {
    await Category.findByIdAndUpdate(categoryId, {
      $push: { brands: brand._id },
    });
    // category.brands.push(brand._id);
    // await category.save();
  });

  // return response
  return res.json({ success: true, message: "brand created successfully!" });
});

export const updateBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) return next(new Error("Brand not found!", { cause: 404 }));
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      brand.image.id
    );
    brand.image = { url: secure_url, id: public_id };
  }

  brand.name = req.body.name ? req.body.name : brand.name;
  brand.slug = req.body.name ? slugify(req.body.name) : brand.slug;

  await brand.save();

  return res.json({ success: true, message: "Brand updated successfully!" });
});

export const deleteBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findByIdAndDelete(req.params.id);
  if (!brand) return next(new Error("Brand not found!", { cause: 404 }));

  // delete image
  await cloudinary.uploader.destroy(brand.image.id);

  // delete brand from categories
  // find categories which have brand in brands array xxxxx
  await Category.updateMany({}, { $pull: { brands: brand._id } });

  return res.json({ success: true, message: "Brand deleted successfully!" });
});

export const getBrand = asyncHandler(async (req, res, next) => {
  // category query
  // subcategory query

  const results = await Brand.find();
  return res.json({ success: true, results });
});
