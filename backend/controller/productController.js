import Product from "../models/productModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import ApiError from "../utils/apiError.js";

// @desc    Create a new product
// @route   POST /api/v1/products/addproduct
// @access  Private/Admin
const addProduct = asyncHandler(async (req, res) => {
  const { category } = req.body;

  let categoryProperties = [];
  switch (category) {
    case "Liquid":
      categoryProperties = [
        {
          key: "size", value: "0ml"
        },
      ];
      break;
    case "Pod":
      categoryProperties = [
        { key: "tankCapacity", value: "0ml" },
        { key: "tankType", value: "Default Type" },
        { key: "coilType", value: "Default Coil" },
        { key: "wattControl", value: false },
        { key: "display", value: "No Display" },
        { key: "battery", value: "Default Battery" },
      ];
      break;
    case "Mod":
      categoryProperties = [
        { key: "wattage", value: "Default Wattage" },
        { key: "tankType", value: "Default Tank" },
        { key: "wattControl", value: false },
        { key: "display", value: "No Display" },
        { key: "battery", value: "Default Battery" },
      ];
      break;
    case "Coil":
      categoryProperties = [
        { key: "coilType", value: "Default Coil" },
        { key: "resistance", value: "Default Resistance" },
        { key: "material", value: "Default Material" },
      ];
      break;
    case "Disposable Vape":
      categoryProperties = [
        { key: "puffCount", value: 0 },
        { key: "coilType", value: "Default Coil" },
        { key: "battery", value: "Default Battery" },
        { key: "rechargable", value: false },
      ];
      break;
    default:
      break;
  }

  // Create the product
  let product = await Product.create({
    user: req.user._id,
    name: req.body.name || "Sample Name",
    description: req.body.description || "Sample Description",
    image: req.body.image || "/images/sample.jpg",
    price: req.body.price || 1,
    discount: req.body.discount || 0,
    brand: req.body.brand || "Sample Brand",
    category: req.body.category || "Sample Category",
    nicotine: req.body.nicotine || [],
    flavour: req.body.flavour || [],
    color: req.body.color || [],
    properties: categoryProperties,
  });

  res.send({ message: `Product created successfully!`, product });
});

// @desc    Get all products
// @route   GET /api/v1/products?pageNumber=3
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 8;
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

  // Prefetch Data
  product.name = req.body.name || product.name;
  product.description = req.body.description || product.description;
  product.category = req.body.category || product.category;
  product.image = req.body.image || product.image;
  product.brand = req.body.brand || product.brand;
  product.price = req.body.price || product.price;
  product.discount = req.body.discount || product.discount;
  product.countInStock = req.body.countInStock || product.countInStock;
  product.nicotine = req.body.nicotine || [];
  product.flavour = req.body.flavour || [];
  product.color = req.body.color || [];


  if (req.body.category) {
    let categoryProperties = [];
    const properties = req.body.properties || [];
    const propertiesMap = properties.reduce((acc, prop) => {
      acc[prop.key] = prop.value;
      return acc;
    }, {});

    switch (req.body.category) {
      case "Liquid":
        categoryProperties = [{
          key: "size",
          value:
          propertiesMap.size ||
              product.properties?.find((p) => p.key === "size")
                ?.value ||
              "0ml",
        }];
        break;
      case "Pod":
        categoryProperties = [
          {
            key: "tankCapacity",
            value:
              propertiesMap.tankCapacity ||
              product.properties?.find((p) => p.key === "tankCapacity")
                ?.value ||
              "0ml",
          },
          {
            key: "tankType",
            value:
              propertiesMap.tankType ||
              product.properties?.find((p) => p.key === "tankType")?.value ||
              "Default Type",
          },
          {
            key: "coilType",
            value:
              propertiesMap.coilType ||
              product.properties?.find((p) => p.key === "coilType")?.value ||
              "Default Coil",
          },
          {
            key: "wattControl",
            value:
              propertiesMap.wattControl ||
              product.properties?.find((p) => p.key === "wattControl")?.value ||
              false,
          },
          {
            key: "display",
            value:
              propertiesMap.display ||
              product.properties?.find((p) => p.key === "display")?.value ||
              "No Display",
          },
          {
            key: "battery",
            value:
              propertiesMap.battery ||
              product.properties?.find((p) => p.key === "battery")?.value ||
              "Default Battery",
          },
        ];
        break;
      case "Mod":
        categoryProperties = [
          {
            key: "wattage",
            value:
              propertiesMap.wattage ||
              product.properties?.find((p) => p.key === "wattage")?.value ||
              "Default Wattage",
          },
          {
            key: "tankType",
            value:
              propertiesMap.tankType ||
              product.properties?.find((p) => p.key === "tankType")?.value ||
              "Default Tank",
          },
          {
            key: "wattControl",
            value:
              propertiesMap.wattControl ||
              product.properties?.find((p) => p.key === "wattControl")?.value ||
              false,
          },
          {
            key: "display",
            value:
              propertiesMap.display ||
              product.properties?.find((p) => p.key === "display")?.value ||
              "No Display",
          },
          {
            key: "battery",
            value:
              propertiesMap.battery ||
              product.properties?.find((p) => p.key === "battery")?.value ||
              "Default Battery",
          },
        ];
        break;
      case "Coil":
        categoryProperties = [
          {
            key: "coilType",
            value:
              propertiesMap.coilType ||
              product.properties?.find((p) => p.key === "coilType")?.value ||
              "Default Coil",
          },
          {
            key: "resistance",
            value:
              propertiesMap.resistance ||
              product.properties?.find((p) => p.key === "resistance")?.value ||
              "Default Resistance",
          },
          {
            key: "material",
            value:
              propertiesMap.material ||
              product.properties?.find((p) => p.key === "material")?.value ||
              "Default Material",
          },
        ];
        break;
      case "Disposable Vape":
        categoryProperties = [
          {
            key: "puffCount",
            value:
              propertiesMap.puffCount ||
              product.properties?.find((p) => p.key === "puffCount")?.value ||
              0,
          },

          {
            key: "coilType",
            value:
              propertiesMap.coilType ||
              product.properties?.find((p) => p.key === "coilType")?.value ||
              "Default Coil",
          },
          {
            key: "battery",
            value:
              propertiesMap.battery ||
              product.properties?.find((p) => p.key === "battery")?.value ||
              "Default Battery",
          },
          {
            key: "rechargable",
            value:
              propertiesMap.rechargable ||
              product.properties?.find((p) => p.key === "rechargable")?.value ||
              "false",
          },
        ];
        break;
      default:
        break;
    }
    product.properties = categoryProperties;
  }
  let updatedProduct = await product.save();
  res.send({
    message: "Product updated successfully!",
    product: updatedProduct,
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
