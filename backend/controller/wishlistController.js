import Wishlist from "../models/wishlistModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import ApiError from "../utils/apiError.js";

const addWishlistItem = asyncHandler(async (req, res) => {
  const { wishlistItems } = req.body;

  if (!wishlistItems || wishlistItems.length === 0) {
    throw new ApiError(400, "No items to add to wishlist");
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,
      wishlistItems: wishlistItems.map((item) => ({
        name: item.name,
        image: item.image,
        price: item.price,
        discountedPrice: item.discountedPrice,
        discount: item.discount,
        brand: item.brand,
        category: item.category,
        product: item._id,
        numReviews: item.numReviews || 0,
        _id: undefined,
      })),
    });
  } else {
    wishlistItems.forEach((item) => {
      const itemExists = wishlist.wishlistItems.find(
        (i) => i.product.toString() === item._id
      );
      if (!itemExists) {
        wishlist.wishlistItems.push({
          name: item.name,
          image: item.image,
          price: item.price,
          discount: item.discount,
          discountedPrice: item.discountedPrice,
          product: item._id,
          brand: item.brand,
          category: item.category,
          numReviews: item.numReviews || 0,
          _id: undefined,
        });
      }
    });
    await wishlist.save();
  }

  res.send({
    message: "Wishlist updated successfully",
    wishlist,
  });
});

// Get the user's wishlist with populated product data
const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
    "wishlistItems.product",
    "name price image"
  );

  if (!wishlist) throw new ApiError(404, "No wishlist found for this user");

  res.send(wishlist);
});

const removeWishlistItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    throw new ApiError(404, "No wishlist found for this user");
  }
  const updatedItems = wishlist.wishlistItems.filter(
    (item) => item.product.toString() !== productId
  );
  if (updatedItems.length === wishlist.wishlistItems.length) {
    throw new ApiError(404, "Product not found in wishlist");
  }
  wishlist.wishlistItems = updatedItems;
  await wishlist.save();

  res.status(200).send({
    message: "Product removed from wishlist",
    wishlist,
  });
});

export { addWishlistItem, getWishlist, removeWishlistItem };
