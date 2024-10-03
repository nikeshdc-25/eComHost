import Product from "../models/productModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import ApiError from "../utils/apiError.js";

// @desc    Create a new product
// @route   POST /api/v1/products/addproduct
// @access  Private/Admin
const addProduct = asyncHandler(async (req, res) => {
  // let product = await Product.create({...req.body, user: req.user._id});
  let product = await Product.create({
    user: req.user._id,
    name: "Sample Name",
    description: "Sample Description",
    image: "/images/sample.jpg",
    price: 1,
    brand: "Sample Brand",
    category: "Sample Category",
  });
  res.send({ message: `Product created successfully!`, product });
});

// @desc    Get all products
// @route   GET /api/v1/products?pageNumber=3
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 3;
    const page = Number(req.query.pageNumber) || 1;
    let keyword = req.query.keyword;
    keyword = keyword
      ? {
          $or: [
            {
              name: {
                $regex: keyword,
                $options: "i",
              },
            },
            {
              description: {
                $regex: keyword,
                $options: "i",
              },
            },
          ],
        }
      : {};
    let productCount = await Product.countDocuments({ ...keyword });
    let products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    res.send({ products, page, pages: Math.ceil(productCount / pageSize) });
  });
  

// @desc    Get a product by ID
// @route   GET /api/v1/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (product) {
    res.send(product);
  } else {
    throw new ApiError(404, "Product not found!");
  }
});

// @desc    Delete a product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  let id = req.params.id;
  let product = await Product.findById(id);
  if (product) {
    await Product.findByIdAndDelete(id);
    res.send({ message: "Product removed" });
  } else {
    throw new ApiError(404, "Product not found");
  }
});

// @desc    Update a product
// @route   UPDATE /api/v1/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  let id = req.params.id;
  let product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product Not Found!");
  }
  product.name = req.body.name || product.name;
  product.description = req.body.description || product.description;
  product.category = req.body.category || product.category;
  product.image = req.body.image || product.image;
  product.brand = req.body.brand || product.brand;
  product.price = req.body.price || product.price;
  product.countInStock = req.body.countInStock || product.countInStock;
  let updateProduct = await product.save();

  res.send({
    message: "Product updated successfully!",
    product: updateProduct,
  });
});

// @desc    get products by top ratings
// @route   /api/v1/products/topproducts/:count
// @access  Public
const getTopProduct = asyncHandler(async (req, res) => {
  let limit = 3;
  let products = await Product.find({}).sort({ rating: -1 }).limit(limit);
  res.send(products);
});


const addUserReview = asyncHandler(async (req, res) => {
  let id = req.params.id;
  let product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  let alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) throw new ApiError(404, "Already Reviewed!");
  let { rating, comment } = req.body;
  product.reviews.push({
    name: req.user.username,
    rating,
    comment,
    user: req.user._id,
  });
  product.numReviews = product.reviews.length;
  let totalRating = product.reviews.reduce(
    (acc, review) => acc + review.rating,
    0
  );
  product.rating = (totalRating / product.reviews.length).toFixed(2);
  await product.save();
  res.send({ message: "Review added successfully!" });
});

export {
  addProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  getTopProduct,
  addUserReview,
};
