import { Product } from "../../../DB/models/product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Order } from "./../../../DB/models/order.model.js";
import { Review } from "./../../../DB/models/review.model.js";

export const addReview = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { comment, rating } = req.body;

  // check product in order
  const order = await Order.findOne({
    user: req.user._id,
    status: "delivered",
    "products.productId": productId,
  });

  if (!order)
    return next(new Error("Can not review this product!", { cause: 400 }));

  // check past reviews
  if (
    await Review.findOne({
      createdBy: req.user._id,
      productId,
      orderId: order._id,
    })
  )
    return next(new Error("Already reviewed by you!"));

  // create review
  const review = await Review.create({
    comment,
    rating,
    createdBy: req.user._id,
    orderId: order._id,
    productId: productId,
  });

  // calculate averageRate
  let calcRating = 0;
  const product = await Product.findById(productId);
  const reviews = await Review.find({ productId });

  for (let i = 0; i < reviews.length; i++) {
    calcRating += reviews[i].rating;
  }

  product.averageRate = calcRating / reviews.length;
  await product.save();

  return res.json({ success: true, results: { review } });
});

export const updateReview = asyncHandler(async (req, res, next) => {
  const { id, productId } = req.params;
  await Review.updateOne({ _id: id, productId }, { ...req.body });
  if (req.body.rating) {
    // calculate averageRate
    let calcRating = 0;
    const product = await Product.findById(productId);
    const reviews = await Review.find({ productId });

    for (let i = 0; i < reviews.length; i++) {
      calcRating += reviews[i].rating;
    }

    product.averageRate = calcRating / reviews.length;
    await product.save();
  }
  return res.json({ success: true, message: "Review updated successfully!" });
});
