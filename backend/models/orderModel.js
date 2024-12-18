import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        discountedPrice: { type: Number, required: true },
        color: { type: String, required: false },
        flavour: { type: String, required: false },
        nicotine: { type: Number, required: false }, 
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    shippingAddress: {
      recipient: { type: String, required: true },
      primaryPhone: { type: String, required: true },
      secondaryPhone: { type: String, required: false },
      address: { type: String, required: true },
      city: { type: String, required: true },
    },
    itemPrice: {
      type: Number,
      required: true,
    },
    shippingCharge: {
      type: Number,
      default: 5,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    paymentMethod:{
      type: String,
      enum: ["ESEWA", "KHALTI", "COD"],
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "In Progress", "Cancelled", "Delivered", "Refunded"],
    },
  },
  { timestamps: true }
);



const Order = mongoose.model("Order", orderSchema);
export default Order;
