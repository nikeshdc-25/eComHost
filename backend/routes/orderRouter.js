import express from "express";
import {
  addOrder,
  deleteOrder,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderStatus,
} from "../controller/orderController.js";
import { authCheck, checkAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authCheck, checkAdmin, getOrders);
router.get("/myorders", authCheck, getMyOrders);
router.put("/:id/updatestatus", authCheck, checkAdmin, updateOrderStatus);
router.post("/addorder", authCheck, addOrder);
router.get("/:id", authCheck, getOrderById);
router.delete("/:id", authCheck, checkAdmin, deleteOrder);

export default router;
