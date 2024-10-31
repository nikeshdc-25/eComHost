import React from "react";
import { Button, Card, CardFooter } from "react-bootstrap";
import Rating from "./Rating";
import "./product.css";
import { Link } from "react-router-dom";
import { IoEyeSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../slices/cartSlice";
import { toast } from "react-toastify";

function Product({ product }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems); // Get current cart items from Redux state

  const addToCartHandler = (item) => {
    // Check if the item is already in the cart
    const itemExists = cartItems.some((cartItem) => cartItem._id === item._id);
    if (itemExists) {
      toast.error(`Product is already in your cart.`);
    } else {
      dispatch(addItem(item));
      toast.success(`Added ${item.name} to your cart.`);
    }
  };
  return (
    <Card className="my-3 product-card">
      <Link
        to={`/product/${product._id}`}
        title={`${product.name}`}
        className="nav-link"
      >
        <Card.Img src={product.image} variant="top" />
      </Link>
      <Card.Body>
        <Card.Text as="div">
          <strong className="product-title">{product.name}</strong>
        </Card.Text>
        <Card.Text as="div">
          <Rating value={product.rating} text={product.numReviews}>
            {product.name}
          </Rating>
        </Card.Text>
        <Card.Text as="h3" className="product-price">
        Rs.{product.price}
        </Card.Text>
      </Card.Body>
      <CardFooter>
        <div className="d-flex justify-content-start gap-2">
          <Button
             className="addToCart"
            disabled={product.countInStock <= 0}
            onClick={() => addToCartHandler({ ...product, qty: 1 })}
          >
            Add to Cart
          </Button>
          <Button variant="warning" className="quickPay">Quick Pay</Button>
          <button className="btn ms-auto">
              <IoEyeSharp className="view" />
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default Product;
