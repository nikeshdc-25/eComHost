import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  name: String,
  comment: String,
  rating: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: String,
    description: String,
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    discount: {
      type: Number,
      default: 0,
    },
    discountedPrice: {
      type: Number,
      default: 0,
    },
    countInStock: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    properties: [
      {
        key: { type: String, required: true },
        value: {
          type: mongoose.Schema.Types.Mixed,
          required: true,
        },
      },
    ],
    nicotine: [String],
    flavour: [String],
    color: [String],
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (this.discount > 0) {
    this.discountedPrice = this.price - this.discount;
  } else {
    this.discountedPrice = this.price;
  }
  next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
