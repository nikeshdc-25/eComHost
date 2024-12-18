import React, { useState } from "react";
import { Col, ListGroup, Row, Image, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addItem, removeItem } from "../slices/cartSlice";
import { FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Message from "../components/Message";
import { TbTruckDelivery } from "react-icons/tb";
import "./CartPage.css";
import { nepaliRupeesFormat } from "../utils/rupeesUtils";

const CartPage = () => {
  const { cartItems, shippingCharge, totalPrice, itemPrice } = useSelector(
    (state) => state.cart
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const changeCartQty = (item, qty) => {
    dispatch(addItem({ ...item, qty }));
  };
  const removeCartItem = (id) => {
    dispatch(removeItem(id));
  };
  const checkoutHandling = () => {
    if (!userInfo) {
      navigate("/login", {
        state: { redirect: "/shipping", source: "CartPage" },
      });
    } else {
      navigate("/shipping", { state: { source: "CartPage" } });
    }
  };

  return (
    <>
      {cartItems.length === 0 ? (
        <Message>
          Your cart is currently empty. Browse <Link to="/">Products.</Link>
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
                    <Col md={4}>
                      <Link
                        to={`/product/${item._id}`}
                        className="nav-link mb-4"
                      >
                        <strong>{item.name}</strong>
                      </Link>
                      <strong> Price: </strong>
                      <span>
                        {item.discount > 0 ? (
                          <>
                            Rs.
                            <s>{nepaliRupeesFormat(item.qty * item.price)}</s>
                            <b>
                              {" "}
                              {nepaliRupeesFormat(
                                item.qty * item.discountedPrice
                              )}
                            </b>
                          </>
                        ) : (
                          <span>
                            Rs.{nepaliRupeesFormat(item.qty * item.price)}
                          </span>
                        )}
                      </span>
                    </Col>
                    <Col></Col>
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
            <b className="deliveryMsg">
              <TbTruckDelivery size={50} /> Free Delivery Above Rs. 500 Spent.
            </b>

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
                  <Col>Rs. {nepaliRupeesFormat(itemPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping Charge</Col>
                  <Col>
                    {!shippingCharge > 0 ? (
                      <em>*Free Shipping</em>
                    ) : (
                      `Rs. ${shippingCharge}`
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
                    <strong>
                      Rs. {nepaliRupeesFormat(totalPrice)}
                    </strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button variant="dark" onClick={checkoutHandling}>
                  Checkout
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      )}
    </>
  );
};

export default CartPage;
