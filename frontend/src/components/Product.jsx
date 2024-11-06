import React, { useState } from "react";
import { Card, CardFooter, Col, ListGroup, Modal, Row } from "react-bootstrap";
import Rating from "./Rating";
import "./product.css";
import { Link } from "react-router-dom";
import { IoEyeSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../slices/cartSlice";
import { toast } from "react-toastify";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Button } from "@mui/joy";
import { nepaliRupeesFormat } from "../utils/rupeesUtils";
import BoltIcon from '@mui/icons-material/Bolt';


function Product({ product }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [showQuickView, setShowQuickView] = useState(false);

  const handleShowQuickView = () => setShowQuickView(true);
  const handleCloseQuickView = () => setShowQuickView(false);

  const addToCartHandler = (item) => {
    //check if the item is already in the cart
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
        <CardFooter>
          <Card.Text as="div">
            <strong className="category">{product.category}</strong>
          </Card.Text>
        </CardFooter>
        <Link
          to={`/product/${product._id}`}
          title={`${product.name}`}
          className="nav-link"
        >
          <Card.Img src={product.image} className="image" variant="top" />
        </Link>
        <Card.Body>
          <Card.Text as="div">
            <Rating value={product.rating}>{product.name}</Rating>
          </Card.Text>
          <Card.Text as="div">
            <b className="title">{product.name}</b>
          </Card.Text>
          <Card.Text as="h3" className="price">
            {product.discount > 0 ? (
              <>
                <s>Rs.{nepaliRupeesFormat(product.price)}</s>{" "}
                <span className="discount">
                  Rs. {nepaliRupeesFormat(product.discountedPrice)}
                </span>
              </>
            ) : (
              <>Rs. {nepaliRupeesFormat(product.price)}</>
            )}
          </Card.Text>
        </Card.Body>
        <CardFooter>
          <div className="d-flex justify-content-center gap-2">
          <Button
              variant="plain"
              color="danger"
              className="btn me-auto"
              title="Add to Cart"
              disabled={product.countInStock <= 0}
              onClick={() => addToCartHandler({ ...product, qty: 1 })}
            >
              <AddShoppingCartIcon />
            </Button>
            <Button variant="outlined" color="success">
              <BoltIcon />Buy Now
            </Button>
           
            <button
              className="btn ms-auto"
              title="Quick View"
              onClick={handleShowQuickView}
            >
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
                <ListGroup.Item>Price: Rs. {nepaliRupeesFormat(product.price)}</ListGroup.Item>
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
