import { asyncHandler } from "./../utils/asyncHandler.js";
import { Token } from "./../../DB/models/token.model.js";
import { User } from "./../../DB/models/user.model.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  // check token existence
  let token = req.headers["token"];
  // check bearer key
  if (!token || !token.startsWith(process.env.BEARER_KEY))
    return next(new Error("Valid token is required!"));
  // extract payload
  token = token.split(process.env.BEARER_KEY)[1];
  const payload = jwt.verify(token, process.env.TOKEN_SECRET);
  // check token in db
  const tokenDB = await Token.findOne({ token, isValid: true });
  if (!tokenDB) return next(new Error("Token is invalid!"));
  // check user existence
  const user = await User.findById(payload.id);
  if (!user) return next(new Error("User not found!", { cause: 404 }));
  // pass user
  req.user = user;
  // next()
  return next();
});
