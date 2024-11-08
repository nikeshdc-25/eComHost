import React from "react";
import { Col, ListGroup, Row, Image, Card, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useAddOrderMutation } from "../slices/orderSlice";
import { toast } from "react-toastify";
import { nepaliRupeesFormat } from "../utils/rupeesUtils";


function BuyNowPage() {
  const { productDetails, itemPrice, shippingCharge, totalPrice } =
    useSelector((state) => state.buynow);
    const {shippingAddress} = useSelector((state) => state.shippingAddress)
  const [addOrder, { isLoading }] = useAddOrderMutation();
  const navigate = useNavigate();
  const placeOrderHandler = async () => {
    try {
      let res = await addOrder({
        orderItems: [
          {
            id: productDetails._id,
            qty,
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
            <h1>Shipping</h1><hr></hr>
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
              <ListGroup.Item>
                <Row>
                  <Col md={2}>
                    <Image src={productDetails.image} fluid rounded />
                  </Col>
                  <Col>
                    <Link to={`/product/${productDetails._id}`} className="nav-link">
                      <strong>{productDetails.name}</strong>
                    </Link>
                  </Col>
                  <Col>
                    <strong>
                      {productDetails.qty} X Rs.{nepaliRupeesFormat(productDetails.discountedPrice)} = Rs.
                      {nepaliRupeesFormat(productDetails.qty * productDetails.discountedPrice)}
                    </strong>
                  </Col>
                </Row>
              </ListGroup.Item>
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
                <Col><b>Price:</b></Col>
                <Col>Rs. {nepaliRupeesFormat(itemPrice)}</Col>
              </Row>
              </ListGroup.Item>
              <ListGroup.Item>
              <Row>
                <Col><b>Shipping Fee:</b></Col>
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
                <Col><b>Total:</b></Col>
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
