import React, { useEffect, useState } from "react";
import { Col, ListGroup, Row, Image, Card, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useAddOrderMutation } from "../slices/orderSlice";
import { toast } from "react-toastify";
import { nepaliRupeesFormat } from "../utils/rupeesUtils";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

function BuyNowPage() {
  const { productDetails, itemPrice, shippingCharge, totalPrice } = useSelector(
    (state) => state.buynow
  );
  const { shippingAddress } = useSelector((state) => state.shippingAddress);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [addOrder, { isLoading }] = useAddOrderMutation();
  const navigate = useNavigate();

  useEffect(() => {
    const initialOptions = {
      color: productDetails.color ? productDetails.color[0] : null,
      flavour: productDetails.flavour ? productDetails.flavour[0] : null,
      nicotine: productDetails.nicotine ? productDetails.nicotine[0] : null,
    };
    setSelectedOptions(initialOptions);
  }, [productDetails]);

  const handleSelectChange = (field, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const placeOrderHandler = async () => {
    try {
      let res = await addOrder({
        orderItems: [
          {
            ...productDetails,
            color: selectedOptions.color || null,
            flavour: selectedOptions.flavour || null,
            nicotine: selectedOptions.nicotine || null,
          },
        ],
        shippingAddress,
        itemPrice,
        shippingCharge,
        totalPrice,
      }).unwrap();
      toast.success(res.message);
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
            <hr />
            <h3>User Details:</h3>
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
            <Row>
              <Col md={2}>
                <Image src={productDetails.image} fluid rounded />
              </Col>
              <Col>
                <Link to={`/product/${productDetails._id}`} className="nav-link">
                  <strong>{productDetails.name}</strong>
                </Link>
                <Col>
                  {productDetails.color && productDetails.color.length > 1 && (
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="color-select">Color</InputLabel>
                      <Select
                        labelId="color-select"
                        value={selectedOptions.color || ""}
                        label="Color"
                        onChange={(e) => handleSelectChange("color", e.target.value)}
                      >
                        {productDetails.color.map((color) => (
                          <MenuItem key={color} value={color}>
                            {color}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                  {productDetails.flavour && productDetails.flavour.length > 1 && (
                    <FormControl margin="normal">
                      <InputLabel id="flavour-select">Flavour</InputLabel>
                      <Select
                        labelId="flavour-select"
                        value={selectedOptions.flavour || ""}
                        label="Flavour"
                        onChange={(e) => handleSelectChange("flavour", e.target.value)}
                      >
                        {productDetails.flavour.map((flavour) => (
                          <MenuItem key={flavour} value={flavour}>
                            {flavour}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                  {productDetails.nicotine && productDetails.nicotine.length > 1 && (
                    <FormControl fullWidth margin="normal" sx={{ width: '100px', marginLeft: "10px" }}>
                      <InputLabel id="nicotine-select">Nicotine</InputLabel>
                      <Select
                        labelId="nicotine-select"
                        value={selectedOptions.nicotine || ""}
                        label="Nicotine"
                        onChange={(e) => handleSelectChange("nicotine", e.target.value)}
                      >
                        {productDetails.nicotine.map((nicotine) => (
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
                  {productDetails.qty} X Rs.{nepaliRupeesFormat(productDetails.discountedPrice)} = Rs.
                  {nepaliRupeesFormat(productDetails.qty * productDetails.discountedPrice)}
                </strong>
              </Col>
            </Row>
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

export default BuyNowPage;
