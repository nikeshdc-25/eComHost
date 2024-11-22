import React, { useEffect, useState } from "react";
import { Col, ListGroup, Row, Image, Card, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useAddOrderMutation } from "../slices/orderSlice";
import { toast } from "react-toastify";
import { removeCart } from "../slices/cartSlice";
import { nepaliRupeesFormat } from "../utils/rupeesUtils";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

function PlaceOrderPage() {
  const { cartItems, itemPrice, totalPrice, shippingCharge } = useSelector(
    (state) => state.cart
  );
  const { shippingAddress } = useSelector((state) => state.shippingAddress);
  const [addOrder, { isLoading }] = useAddOrderMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedOptions, setSelectedOptions] = useState({});
  
  useEffect(() => {
    const initialOptions = {};
    cartItems.forEach((item) => {
      initialOptions[item._id] = {
        color: item.color ? item.color[0] : null,
        flavour: item.flavour ? item.flavour[0] : null,
        nicotine: item.nicotine ? item.nicotine[0] : null,
      };
    });
    setSelectedOptions(initialOptions);
  }, [cartItems]);

  {
    /*Its for product nicotine or flavour or color selection from user. */
  }
  const handleSelectChange = (itemId, field, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
      },
    }));
  };

  const placeOrderHandler = async () => {
    try {
      let res = await addOrder({
        orderItems: cartItems.map((item) => ({
          ...item,
          color: selectedOptions[item._id]?.color || null,
          flavour: selectedOptions[item._id]?.flavour || null,
          nicotine: selectedOptions[item._id]?.nicotine || null,
        })),
        shippingAddress,
        itemPrice,
        shippingCharge,
        totalPrice,
      }).unwrap();
      toast.success(res.message);
      dispatch(removeCart());
      navigate("/order/" + res.orderId);
    } catch (err) {
      toast.error(err.data.error);
    }
  };
  return (
    <Row>
      <Col md={8}>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <h1>Shipping</h1>
            <hr></hr>
            <br /> <h3>User Details:</h3>
            <p>
              <strong>Name: </strong>
              {shippingAddress.recipient} <br />
              <strong>Phone {shippingAddress.secondaryPhone && 1}: </strong>
              {shippingAddress.primaryPhone} <br />
              {shippingAddress.secondaryPhone && (
                <>
                  <strong>Phone 2: </strong>
                  {shippingAddress.secondaryPhone} <br />
                </>
              )}
              <strong>Address: </strong>
              {shippingAddress.address} <br />
              <strong>City: </strong>
              {shippingAddress.city} <br />
            </p>
          </ListGroup.Item>
          <ListGroup.Item>
            {cartItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row>
                  <Col md={3}>
                    <Image src={item.image} fluid rounded />
                  </Col>
                  <Col>
                    <Link to={`/product/${item._id}`} className="nav-link">
                      <strong>{item.name}</strong>
                    </Link>
                    <Col>
                      {item.color && item.color.length > 1 && (
                        <FormControl fullWidth margin="normal">
                          <InputLabel id={`color-select-${item._id}`}>
                            Color
                          </InputLabel>
                          <Select
                            labelId={`color-select-${item._id}`}
                            label="Color"
                            value={selectedOptions[item._id]?.color || ""}
                            onChange={(e) =>
                              handleSelectChange(
                                item._id,
                                "color",
                                e.target.value
                              )
                            }
                          >
                            {item.color.map((color) => (
                              <MenuItem key={color} value={color}>
                                {color}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                      {item.flavour && item.flavour.length > 1 && (
                        <FormControl margin="normal">
                          <InputLabel id={`flavour-select-${item._id}`}>
                            Flavour
                          </InputLabel>
                          <Select
                            labelId={`flavour-select-${item._id}`}
                            label="Flavour"
                            value={selectedOptions[item._id]?.flavour || ""}
                            onChange={(e) =>
                              handleSelectChange(
                                item._id,
                                "flavour",
                                e.target.value
                              )
                            }
                          >
                            {item.flavour.map((flavour) => (
                              <MenuItem key={flavour} value={flavour}>
                                {flavour}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                      {item.nicotine && item.nicotine.length > 1 && (
                        <FormControl fullWidth margin="normal" sx={{ width: '100px', marginLeft: "10px" }}>
                          <InputLabel id={`nicotine-select-${item._id}`}>
                            Nicotine
                          </InputLabel>
                          <Select
                            labelId={`nicotine-select-${item._id}`}
                            value={selectedOptions[item._id]?.nicotine || ""}
                            label="Nicotine"
                            onChange={(e) =>
                              handleSelectChange(
                                item._id,
                                "nicotine",
                                e.target.value
                              )
                            }
                          >
                            {item.nicotine.map((nicotine) => (
                              <MenuItem key={nicotine} value={nicotine}>
                                {nicotine}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    </Col>
                  </Col>
                  <Col md={3}>
                    <strong>
                      {item.qty} X Rs.{nepaliRupeesFormat(item.discountedPrice)}{" "}
                      = Rs.
                      {nepaliRupeesFormat(item.qty * item.discountedPrice)}
                    </strong>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup.Item>
        </ListGroup>
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup>
            <ListGroup.Item>
              <h2>Order Summary</h2>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <b>Price:</b>
                </Col>
                <Col>Rs. {nepaliRupeesFormat(itemPrice)}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <b>Shipping Fee:</b>
                </Col>
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
                  <b>Total:</b>
                </Col>
                <Col>Rs. {nepaliRupeesFormat(totalPrice)}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Button variant="dark" onClick={placeOrderHandler}>
                  Place Order
                </Button>
              </Row>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
}

export default PlaceOrderPage;
