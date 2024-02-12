import { Schema, Types, model } from "mongoose";

const brandSchema = new Schema(
  {
    name: { type: String, unqiue: true, required: true, min: 2, max: 12 },
    slug: { type: String, required: true, unqiue: true },
    image: {
      url: { type: String, required: true },
      id: { type: String, required: true },
    },
    createdBy: { type: Types.ObjectId, ref: "User" },
    // categories
    // subcategories
  },
  { timestamps: true }
);

export const Brand = model("Brand", brandSchema);
