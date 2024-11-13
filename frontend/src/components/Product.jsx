import React, { useEffect, useState } from "react";
import "./product.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../slices/cartSlice";
import { saveProductDetails } from "../slices/buySlice";
import { toast } from "react-toastify";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import {
  AspectRatio,
  Button,
  Card,
  CardContent,
  CardOverflow,
  Tooltip,
  Typography,
} from "@mui/joy";
import { nepaliRupeesFormat } from "../utils/rupeesUtils";
import BoltIcon from "@mui/icons-material/Bolt";
import {
  useAddWishlistMutation,
  useGetWishlistQuery,
  useRemoveWishlistMutation,
} from "../slices/wishlistSlice";

function Product({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { userInfo } = useSelector((state) => state.auth);
  const { data: wishlist, isLoading, refetch } = useGetWishlistQuery();
  const [addWishlist] = useAddWishlistMutation();
  const [removeWishlist] = useRemoveWishlistMutation();

  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    if (!isLoading && wishlist) {
      const isProductInWishlist = wishlist.wishlistItems.some(
        (item) => item.product._id === product._id
      );
      setIsInWishlist(isProductInWishlist);
    }
  }, [wishlist, isLoading, product._id]);

  const addToCartHandler = (item) => {
    const itemExists = cartItems.some((cartItem) => cartItem._id === item._id);
    if (itemExists) {
      toast.error("Product is already in your cart.");
    } else {
      dispatch(addItem(item));
      toast.success(`Added ${item.name} to your cart.`);
    }
  };

  const buyNowHandler = (item) => {
    dispatch(saveProductDetails(item));
    if (!userInfo) {
      navigate("/login", {
        state: { redirect: "/shipping", source: "BuyNowPage" },
      });
    } else {
      navigate("/shipping", { state: { source: "BuyNowPage" } });
    }
  };

  const toggleWishlist = async () => {
    try {
      if (isInWishlist) {
        await removeWishlist(product._id);
        setIsInWishlist(false);
        toast.error("Removed from Wishlist.");
      } else {
        await addWishlist({ ...product });
        setIsInWishlist(true);
        toast.success("Added to Wishlist.");
      }
      refetch();
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <Card
      className="my-2 product-card"
      sx={{ flex: "1 1 calc(50% - 1rem)", minWidth: 150, maxWidth: "100%" }}
    >
      <CardOverflow sx={{ position: "relative" }}>
        <AspectRatio ratio={1} sx={{ minWidth: 150 }}>
          <Link to={`/product/${product._id}`} className="nav-link">
            <img src={product.image} alt={product.name} />
          </Link>

          <div style={{ position: "absolute", top: "10px", left: "10px" }}>
            <Tooltip arrow title="Add to Cart">
              <Button
                variant="plain"
                color="danger"
                disabled={product.countInStock <= 0}
                onClick={() => addToCartHandler({ ...product, qty: 1 })}
              >
                <AddShoppingCartIcon style={{ fontSize: "1.4rem" }} />
              </Button>
            </Tooltip>
          </div>

          <div style={{ position: "absolute", top: "10px", right: "10px" }}>
            <Tooltip
              arrow
              title={isInWishlist ? "Remove Wishlist" : "Add Wishlist"}
            >
              <Button variant="plain" color="success" onClick={toggleWishlist}>
                {isInWishlist ? (
                  <BookmarkIcon style={{ fontSize: "1.4rem" }} />
                ) : (
                  <BookmarkBorderIcon style={{ fontSize: "1.4rem" }} />
                )}
              </Button>
            </Tooltip>
          </div>
        </AspectRatio>
      </CardOverflow>

      <CardContent>
        <Typography level="body-xs">
          From <b>{product.brand}</b>
        </Typography>
        <Link to={`/product/${product._id}`} className="nav-link">
          <Typography level="body-md">
            <b className="title">{product.name}</b>
          </Typography>
        </Link>
        <Typography
          level="title-lg"
          sx={{ mt: 1, fontWeight: "xl" }}
          className="price"
        >
          {product.discount > 0 ? (
            <>
              <span style={{ fontSize: "0.9rem" }}>Rs.</span>
              <s style={{ fontSize: "0.8rem" }} className="price">
                {nepaliRupeesFormat(product.price)}
              </s>{" "}
              <span className="discount" style={{ fontSize: "0.9rem" }}>
                {nepaliRupeesFormat(product.discountedPrice)}
              </span>
            </>
          ) : (
            <span style={{ fontSize: "0.9rem" }} className="price">
              Rs. {nepaliRupeesFormat(product.price)}
            </span>
          )}
        </Typography>
        <Typography level="body-sm">
          {product.countInStock > 0 ? (
            <>
              {" "}
              (Only <b>{product.countInStock}</b> left in stock!){" "}
            </>
          ) : (
            <b style={{ color: "grey" }}>Out of Stock</b>
          )}
        </Typography>
      </CardContent>
      <CardOverflow>
        <Button
          variant="solid"
          color="success"
          disabled={product.countInStock <= 0}
          className="ml-5"
          onClick={() => buyNowHandler({ ...product, qty: 1 })}
        >
          <BoltIcon />
          Buy Now
        </Button>
      </CardOverflow>
    </Card>
  );
}

export default Product;
