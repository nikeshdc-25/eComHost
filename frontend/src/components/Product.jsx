import React, { useState } from "react";
import "./product.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../slices/cartSlice";
import { toast } from "react-toastify";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
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

function Product({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { userInfo } = useSelector((state) => state.auth);
  /*
  For View icon [in future]
  const [showQuickView, setShowQuickView] = useState(false);

  const handleShowQuickView = () => setShowQuickView(true);
  const handleCloseQuickView = () => setShowQuickView(false);
*/
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

  const buyNowHandler = (item) => {
    if (!userInfo) {
      navigate("../login?redirect=/shipping");
    } else {
      dispatch(addItem(item));
      navigate("/cart");
    }
  };
  
  return (
    <>
      <Card className="my-2 product-card" sx={{ flex: '1 1 calc(50% - 1rem)', minWidth: 150, maxWidth: '100%' }}>
        <CardOverflow>
          <AspectRatio ratio={1.3} sx={{ minWidth: 150 }}>
            <Link to={`/product/${product._id}`} className="nav-link">
              <img src={product.image} />
            </Link>
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
          </AspectRatio>
        </CardOverflow>

        <CardContent>
          <Typography level="body-xs">
            From <b>{product.brand}</b>
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
                <span style={{ fontSize: "0.9rem" }}>Rs.</span><s style={{ fontSize: "0.8rem" }} className="price">
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
            
            {product.countInStock > 0 ? <>(Only <b>{product.countInStock}</b> left in stock!)</> : <b style={{color: "grey"}}>Out of Stock</b>  }
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
      {/*
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
       */}
    </>
  );
}

export default Product;
