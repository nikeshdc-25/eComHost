import React, { useState } from "react";
import { Col, ListGroup, Modal, Row } from "react-bootstrap";
import Rating from "./Rating";
import "./product.css";
import { Link } from "react-router-dom";
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
  Tooltip,
  Typography,
} from "@mui/joy";
import { nepaliRupeesFormat } from "../utils/rupeesUtils";
import BoltIcon from "@mui/icons-material/Bolt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Divider from "@mui/joy/Divider";

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
      <Card className="my-2 product-card" sx={{ width: 350, maxWidth: "100%" }}>
        <CardOverflow>
          <Link to={`/product/${product._id}`} className="nav-link">
            <AspectRatio sx={{ minWidth: 150 }} objectFit="contain">
              <img src={product.image} />
            </AspectRatio>
          </Link>
        </CardOverflow>
        <CardContent>
          <Typography level="body-xs">
            From <b>{product.brand}</b> | {product.category}
          </Typography>
          <Typography level="body-xs" className="pName"></Typography>
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
                <s style={{ fontSize: "0.8rem" }} className="price">
                  Rs.{nepaliRupeesFormat(product.price)}
                </s>{" "}
                <span className="discount" style={{ fontSize: "1rem" }}>
                  Rs. {nepaliRupeesFormat(product.discountedPrice)}
                </span>
              </>
            ) : (
              <span className="price">
                Rs. {nepaliRupeesFormat(product.price)}
              </span>
            )}
          </Typography>
          <Typography level="body-sm">
            (Only <b>{product.countInStock}</b> left in stock!)
          </Typography>
        </CardContent>
        <CardOverflow>
          <ButtonGroup
            color="success"
            sx={{
              "--ButtonGroup-radius": "40px",
              justifyContent: "center",
            }}
          >
            <Tooltip arrow title="Add to Cart">
              <Button
                variant="outlined"
                color="danger"
                disabled={product.countInStock <= 0}
                onClick={() => addToCartHandler({ ...product, qty: 1 })}
              >
                <AddShoppingCartIcon style={{ fontSize: "1.4rem" }} />
              </Button>
            </Tooltip>
            <Divider />
            <Button
              variant="solid"
              color="success"
              disabled={product.countInStock <= 0}
              className="ml-5"
            >
              <BoltIcon />
              Buy Now
            </Button>
            <Divider />
            <Tooltip arrow title="Quick View">
              <Button
                variant="outlined"
                color="neutral"
                onClick={handleShowQuickView}
              >
                <VisibilityIcon style={{ fontSize: "1.4rem" }} />
              </Button>
            </Tooltip>
          </ButtonGroup>
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
