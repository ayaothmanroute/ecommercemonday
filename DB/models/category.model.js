import { Schema, Types, model } from "mongoose";
import { Subcategory } from "./subcategory.model.js";

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true, min: 5, max: 20 },
    slug: { type: String, required: true, unique: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    image: { id: { type: String }, url: { type: String } },
    brands: [{ type: Types.ObjectId, ref: "Brand" }],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// deleteOne() >>>> document(category).deleteOne()
categorySchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    // this >>> document
    // delete subcategories
    await Subcategory.deleteMany({
      category: this._id,
    });
  }
);

// virtual subcategory field
categorySchema.virtual("subcategory", {
  ref: "Subcategory",
  localField: "_id", // Category
  foreignField: "category", // Subcategory
});

export const Category = model("Category", categorySchema);
