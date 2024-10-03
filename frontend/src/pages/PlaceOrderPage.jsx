import { Row, Col, Image, ListGroup, Button, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAddOrderMutation } from "../slices/orderSlice";

function PlaceOrderPage() {
  const { cartItems, shippingAddress, itemPrice, shippingCharge, totalPrice } =
    useSelector((state) => state.cart);
  const [addOrder, { isLoading }] = useAddOrderMutation();
  const navigate = useNavigate();
  const placeOrderHandler = async () => {
    try {
      let resp = await addOrder({
        orderItems: cartItems,
        shippingAddress,
        itemPrice,
        shippingCharge,
        totalPrice,
      }).unwrap();
      navigate("/order/" + resp.orderId);
      toast.success(resp.message);
    } catch (err) {
      toast.error(err.data.error);
    }
  };
  return (
    <Row>
      <Col md={8}>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <h2>Shipping</h2>
            <p>
              Name: {shippingAddress.recipient} | {shippingAddress.phone}
              <br />
              Address: {shippingAddress.address} | {shippingAddress.city}
            </p>
          </ListGroup.Item>
          <ListGroup.Item>
            {cartItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} fluid rounded />
                  </Col>
                  <Col>
                    <Link to={`/product/${item._id}`}>
                      <strong>{item.name}</strong>
                    </Link>
                  </Col>
                  <Col>
                    <strong>
                      {item.qty} X {item.price} = $
                      {(item.qty * item.price).toFixed(2)}
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
                <Col>Item</Col>
                <Col>${itemPrice}</Col>
              </Row>
              <Row>
                <Col>Shipping</Col>
                <Col>${shippingCharge}</Col>
              </Row>
              <Row>
                <Col>Total</Col>
                <Col>${totalPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button variant="dark" onClick={placeOrderHandler}>
                Place Order
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
}
export default PlaceOrderPage;
