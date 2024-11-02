import React, { useState } from "react";
import {
  Button,
  Card,
  CardFooter,
  Col,
  ListGroup,
  Modal,
  Row,
} from "react-bootstrap";
import Rating from "./Rating";
import "./product.css";
import { Link } from "react-router-dom";
import { IoEyeSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../slices/cartSlice";
import { toast } from "react-toastify";
import { MdAddShoppingCart } from "react-icons/md";

function Product({ product }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [showQuickView, setShowQuickView] = useState(false);

  const handleShowQuickView = () => setShowQuickView(true);
  const handleCloseQuickView = () => setShowQuickView(false);

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
    <>
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
              variant="dark"
              disabled={product.countInStock <= 0}
              onClick={() => addToCartHandler({ ...product, qty: 1 })}
            >
              Add to Cart
            </Button>
            <Button variant="success">Quick Pay</Button>
            <button className="btn ms-auto" onClick={handleShowQuickView}>
              <IoEyeSharp className="view" />
            </button>
          </div>
        </CardFooter>
      </Card>

      <Modal
        show={showQuickView}
        onHide={handleCloseQuickView}
        centered
        size="lg"
      >
        <Modal.Body>
          <Row>
            <Col
              md={5}
              className="d-flex justify-content-center align-items-start"
            >
              <img
                src={product.image}
                alt={product.name}
                className="quickview-image"
                style={{ width: "100%", maxWidth: "250px", objectFit: "cover" }}
              />
            </Col>
            <Col md={7}>
              <ListGroup variant="flush" className="modalText">
                <ListGroup.Item>
                  <strong>{product.name}</strong>
                </ListGroup.Item>
                <ListGroup.Item>Price: Rs.{product.price}</ListGroup.Item>
                <ListGroup.Item>Stock: {product.countInStock}</ListGroup.Item>
                <ListGroup.Item className="product-rating">
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews}`}
                  />
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col>
              <div className="product-description">
                <p>{product.description}</p>
              </div>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Product;
