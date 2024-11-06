import React, { useState } from "react";
import { Col, ListGroup, Modal, Row } from "react-bootstrap";
import Rating from "./Rating";
import "./product.css";
import { Link } from "react-router-dom";
import { IoEyeSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../slices/cartSlice";
import { toast } from "react-toastify";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import {
  AspectRatio,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardOverflow,
  Typography,
} from "@mui/joy";
import { nepaliRupeesFormat } from "../utils/rupeesUtils";
import BoltIcon from "@mui/icons-material/Bolt";
import VisibilityIcon from "@mui/icons-material/Visibility";

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
      <Card className="my-2 product-card" sx={{ width: 300, maxWidth: "100%" }}>
        <CardOverflow>
          <Link to={`/product/${product._id}`} className="nav-link">
            <AspectRatio sx={{ minWidth: 150 }}>
              <img src={product.image} />
            </AspectRatio>
          </Link>
        </CardOverflow>
        <CardContent>
        <Typography level="body-xs"><b>By</b> {product.brand} | {product.category}</Typography>
          <Typography level="body-xs"></Typography>
          <Link to={`/product/${product._id}`} className="nav-link">
            <Typography level="body-md">
              <b className="title">{product.name}</b>
            </Typography>
          </Link>
          <Typography level="title-lg" sx={{ mt: 1, fontWeight: "xl" }}>
            {product.discount > 0 ? (
              <>
                <s style={{ fontSize: "0.8rem" }}>
                  Rs.{nepaliRupeesFormat(product.price)}
                </s>{" "}
                <span className="discount" style={{ fontSize: "1rem" }}>
                  Rs. {nepaliRupeesFormat(product.discountedPrice)}
                </span>
              </>
            ) : (
              <>Rs. {nepaliRupeesFormat(product.price)}</>
            )}
          </Typography>
          <CardOverflow>
            <Typography level="body-sm">
              (Only <b>{product.countInStock}</b> left in stock!){" "}
              <Button
                variant="plain"
                color="danger"
                title="Add to Cart"
                disabled={product.countInStock <= 0}
                onClick={() => addToCartHandler({ ...product, qty: 1 })}
              >
                <AddShoppingCartIcon style={{ fontSize: "1.4rem" }} />
              </Button>
              <Button
                variant="plain"
                color="neutral"
                title="Quick View"
                onClick={handleShowQuickView}
              >
                <VisibilityIcon style={{ fontSize: "1.4rem" }} />
              </Button>
            </Typography>
          </CardOverflow>
        </CardContent>
        <CardOverflow>
          <Button
            color="success"
            variant="solid"
            disabled={product.countInStock <= 0}
          >
            <BoltIcon />
            Buy Now
          </Button>
        </CardOverflow>
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
                <ListGroup.Item>
                  Price: Rs. {nepaliRupeesFormat(product.price)}
                </ListGroup.Item>
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
