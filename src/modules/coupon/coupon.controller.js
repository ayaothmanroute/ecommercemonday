import { asyncHandler } from "../../utils/asyncHandler.js";
import voucher_codes from "voucher-code-generator";
import { Coupon } from "./../../../DB/models/coupon.model.js";

export const createCoupon = asyncHandler(async (req, res, next) => {
  // generate code
  const code = voucher_codes.generate({ length: 5 }); // ["h9yhk"]
  // create coupon in the database
  const coupon = await Coupon.create({
    name: code[0],
    createdBy: req.user._id,
    discount: req.body.discount,
    expiredAt: new Date(req.body.expiredAt).getTime(),
  });
  // response
  return res.status(201).json({ success: true, results: { coupon } });
});

export const updateCoupon = asyncHandler(async (req, res, next) => {
  // check coupon
  const coupon = await Coupon.findOne({
    name: req.params.code,
    expiredAt: { $gt: Date.now() },
  });

  if (!coupon) return next(new Error("Invalid Coupon!", { cause: 404 }));

  // check owner
  if (req.user._id.toString() != coupon.createdBy.toString())
    return next(new Error("Not Authorized!", { cause: 403 }));

  // update
  coupon.discount = req.body.discount ? req.body.discount : coupon.discount;
  coupon.expiredAt = req.body.expiredAt
    ? new Date(req.body.expiredAt).getTime()
    : coupon.expiredAt;

  await coupon.save();

  // response
  return res.json({ success: true, message: " coupon updated successfully!" });
});

export const deleteCoupon = asyncHandler(async (req, res, next) => {
  // check coupon
  const coupon = await Coupon.findOne({ name: req.params.code });
  if (!coupon) return next(new Error("Invalid coupon!", { cause: 404 }));

  // check owner
  if (req.user._id.toString() != coupon.createdBy.toString())
    return next(new Error(" Not Authorized!", { cause: 403 }));

  // delete
  await coupon.deleteOne();

  // response
  return res.json({ success: true, message: "coupon deleted successfully" });
});

export const allCoupons = asyncHandler(async (req, res, next) => {
  // admin >>> all coupons
  if (req.user.role === "admin") {
    const coupons = await Coupon.find();
    return res.json({ success: true, results: { coupons } });
  }
  // seller >>> his coupons
  if (req.user.role === "seller") {
    const coupons = await Coupon.find({ createdBy: req.user._id });
    return res.json({ success: true, results: { coupons } });
  }
});
