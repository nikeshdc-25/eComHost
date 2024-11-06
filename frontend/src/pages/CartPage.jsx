import React, { useState } from "react";
import { Col, ListGroup, Row, Image, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addItem, removeItem } from "../slices/cartSlice";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Message from "../components/Message";
import { toast } from "react-toastify";
import { TbTruckDelivery } from "react-icons/tb";
import "./CartPage.css";
import { nepaliRupeesFormat } from "../utils/rupeesUtils";
 

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
                    <Col md={3}>
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
                            Rs.<s>{nepaliRupeesFormat(item.qty * item.price)}</s>
                            <span>
                              {" "}
                              {nepaliRupeesFormat(item.qty * item.discountedPrice)}
                            </span>
                          </>
                        ) : (
                          <span>{nepaliRupeesFormat(item.qty * item.price)}</span>
                        )}
                      </span>
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
                  <Col>
                    {discount === 5 ? (
                      <>
                        Rs.<s>{nepaliRupeesFormat(itemPrice)}</s>
                        <b style={{ color: "green" }}>
                          {nepaliRupeesFormat(itemPrice - discount)}
                        </b>
                      </>
                    ) : (
                      `Rs.${nepaliRupeesFormat(itemPrice)}`
                    )}
                  </Col>
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
                    <strong>Rs. {nepaliRupeesFormat(totalPrice - discount)}</strong>
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
                  <Button variant="dark">Checkout</Button>
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
