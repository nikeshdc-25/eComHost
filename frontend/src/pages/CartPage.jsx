import React, { useState } from "react";
import {
  Col,
  ListGroup,
  Row,
  Image,
  Form,
  Button,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addItem, removeItem } from "../slices/cartSlice";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Message from "../components/Message";
import { toast } from "react-toastify";

const CartPage = () => {
  const { cartItems, shippingCharge, totalPrice, itemPrice } = useSelector(
    (state) => state.cart
  );
  const dispatch = useDispatch();
  const changeCartQty = (item, qty) => {
    dispatch(addItem({ ...item, qty }));
  };
  const removeCartItem = (id) => {
    dispatch(removeItem(id));
  };

  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const promoHandler = (e) => {
    if (promo === "123456") {
      setDiscount(5);
      toast.success("Promo Applied!");
    } else {
      setDiscount(0);
      toast.error("Invalid promo code");
    }
  };

  return (
    <>
      {cartItems.length === 0 ? (
        <Message>
          Your Cart is currently empty. Browse <Link to="/">Products.</Link>
        </Message>
      ) : (
        <Row>
          <Col md={8}>
            <ListGroup variant="flush">
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} fluid rounded alt="item image" />
                    </Col>
                    <Col md={3}>
                      <Link
                        to={`/product/${item._id}`}
                        className="nav-link mb-4"
                      >
                        <strong>{item.name}</strong>
                      </Link>
                      <strong> Price: </strong>
                      <span>${(item.qty * item.price).toFixed(2)}</span>
                    </Col>
                    <Col md={2}>
                      <Form.Control
                        as="select"
                        value={item.qty}
                        onChange={(e) =>
                          changeCartQty(item, Number(e.target.value))
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1}>{x + 1}</option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col md={2}>
                      <Button
                        variant="light"
                        onClick={() => removeCartItem(item._id)}
                      >
                        <FaTrash />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col md={4}>
            <ListGroup>
              <ListGroup.Item>
                <h4>
                  Total ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                  Products
                </h4>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Net Total</Col>
                  <Col>
                    {discount === 5 ? (
                      <>
                        <s>${itemPrice.toFixed(2)}</s> $
                        <b style={{color: 'green'}}>{(itemPrice - discount).toFixed(2)}</b>
                      </>
                    ) : (
                      `$${itemPrice.toFixed(2)}`
                    )}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping Charge</Col>
                  <Col>
                    {totalPrice >= 100 ? (
                      <em>*Free Shipping</em>
                    ) : (
                      `$${shippingCharge}`
                    )}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <strong>Total</strong>
                  </Col>
                  <Col>
                    <strong>${totalPrice - discount}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Promo:</Col>
                </Row>
                <Row>
                  <Col>
                    <input
                      type="text"
                      placeholder="Enter Promo code..."
                      maxLength="6"
                      value={promo}
                      onChange={(e) => setPromo(e.target.value)}
                    ></input>
                  </Col>
                  <Col>
                    <Button
                      variant="success"
                      onClick={promoHandler}
                      disabled={discount == 5}
                    >
                      Apply
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Link to="../login?redirect=/shipping">
                  <Button>Checkout</Button>
                </Link>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      )}
    </>
  );
};

export default CartPage;
