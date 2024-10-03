import Order from "../models/orderModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import ApiError from "../utils/apiError.js";

const addOrder = asyncHandler(async (req, res) => {
  let { orderItems, itemPrice, shippingCharge, totalPrice, shippingAddress } =
    req.body;
  let order = await Order.create({
    user: req.user._id,
    orderItems: orderItems.map((item) => ({
      ...item,
      product: item._id,
      _id: undefined,
    })),
    itemPrice,
    shippingCharge,
    totalPrice,
    shippingAddress,
  });
  res.send({
    message: "Order Placed with id " + order._id,
    orderId: order._id,
  });
});

const getOrders = asyncHandler(async (req, res) => {
  let orders = await Order.find({}).populate("user", "username email -_id"); //Makes object with name and email, excluding _id.
  res.send(orders);
});

const getOrderById = asyncHandler(async (req, res) => {
  let id = req.params.id;
  let order = await Order.findById(id).populate("user", "username email -_id");
  res.send(order);
});

const getMyOrders = asyncHandler(async (req, res) => {
  let orders = await Order.find({ user: req.user._id });
  res.send(orders);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  let id = req.params.id;
  let status = req.body.status;
  let order = await Order.findById(id);
  if (!order) throw new ApiError(404, "Order Not Found");
  order.status = status;
  if (status == "Delivered") {
    order.isDelivered = true;
    order.isPaid = true;
    order.deliveredAt = Date.now();
  }
  order.save();
  res.send({ message: "Order status changed to " + order.status });
});

export { addOrder, getOrders, getOrderById, getMyOrders, updateOrderStatus };
