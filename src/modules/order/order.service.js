import { Cart } from "../../../DB/models/cart.model.js";
import { Product } from "../../../DB/models/product.model.js";

export const updateStock = async (products, createOrder) => {
  // createOrder true , false

  if (createOrder) {
    for (const product of products) {
      await Product.findByIdAndUpdate(product.productId, {
        $inc: {
          soldItems: product.quantity,
          availableItems: -product.quantity,
        },
      });
    }
  } else {
    for (const product of products) {
      await Product.findByIdAndUpdate(product.productId, {
        $inc: {
          soldItems: -product.quantity,
          availableItems: product.quantity,
        },
      });
    }
  }
};

export const clearCart = async (userId) => {
  await Cart.findOneAndUpdate({ user: userId }, { products: [] });
};
