import React from "react";
import { Button, Card, CardFooter } from "react-bootstrap";
import Rating from "./Rating";
import "./product.css";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../slices/cartSlice";
import { toast } from "react-toastify";

function Product({ product }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems); // Get current cart items from Redux state

  const addToCartHandler = (item) => {
    // Check if the item is already in the cart
    const itemExists = cartItems.some((cartItem) => cartItem._id === item._id);
    console.log("Item to add:", item);
  console.log("Current cart items:", cartItems);


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
          ${product.price}
        </Card.Text>
      </Card.Body>
      <CardFooter>
        <div className="d-flex justify-content-start gap-2">
          <Button
            variant="success"
            disabled={product.countInStock <= 0}
            onClick={() => addToCartHandler({ ...product, qty: 1 })}
          >
            Add to Cart
          </Button>
          <Button variant="warning">Quick Pay</Button>
          <button className="btn ms-auto">
            <FaEye />
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default Product;
