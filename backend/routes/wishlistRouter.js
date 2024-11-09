import express from "express";
import {
  addWishlistItem,
  getWishlist,
  removeWishlistItem,
} from "../controller/wishlistController.js";
import { authCheck } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", authCheck, getWishlist);
router.post("/addwishlist", authCheck, addWishlistItem);
router.delete("/removewishlist/:productId", authCheck, removeWishlistItem);

export default router;
