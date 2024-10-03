import { ListGroup, Row, Col, Card, Image, Badge, Form } from "react-bootstrap";
import Message from "../components/Message";
import { useParams, Link } from "react-router-dom";
import {
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
} from "../slices/orderSlice";
import { orderStatusColor } from "../utils/orderStatusColors";
import { useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import { useState } from "react";
import { toast } from "react-toastify";

function OrderPage() {
  const [isEdit, setIsEdit] = useState(false);
  let { id } = useParams();
  let { data: order, isLoading, refetch, error } = useGetOrderByIdQuery(id);
  const [updateOrderStatus, { isLoading: updateLoading }] =
    useUpdateOrderStatusMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const updateStatusHandler = async (id, status) => {
    try {
      let resp = await updateOrderStatus({ id, status }).unwrap();
      refetch();
      setIsEdit(false);
      toast.success(resp.message);
    } catch (err) {
      toast.error(err.data.error);
    }
  };

  return isLoading ? (
    <h1>Loading...</h1>
  ) : error ? (
    <Message variant="danger">{error.data.error}</Message>
  ) : (
    <Row>
      <Col md={8}>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <h3>Shipping</h3>
            <p>
              Name: {order.shippingAddress.recipient} |{" "}
              {order.shippingAddress.phone}
              <br />
              Address: {order.shippingAddress.address} |{" "}
              {order.shippingAddress.city}
            </p>
            {order.isDelivered ? (
              <Message>Delivered at {order.deliveredAt}</Message>
            ) : (
              <Message variant="danger">Not Delivered</Message>
            )}
          </ListGroup.Item>
          <ListGroup.Item>
            <h3>Payment</h3>
            <p>Mode: COD</p>
            {order.isPaid ? (
              <Message>Paid ${order.totalPrice}</Message>
            ) : (
              <Message variant="danger">Not Paid</Message>
            )}
          </ListGroup.Item>
          <ListGroup.Item>
            {order.orderItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} fluid rounded />
                  </Col>
                  <Col>
                    <Link to={`/product/${item.product}`}>
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
                <Col>${order.itemPrice}</Col>
              </Row>
              <Row>
                <Col>Shipping</Col>
                <Col>${order.shippingCharge}</Col>
              </Row>
              <Row>
                <Col>Total</Col>
                <Col>${order.totalPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Status</Col>
                <Col md={6}>
                  {isEdit ? (
                    <Form.Control
                      as="select"
                      onChange={(e) =>
                        updateStatusHandler(order._id, e.target.value)
                      }
                    >
                      <option>pending</option>
                      <option>in progress</option>
                      <option>cancelled</option>
                      <option>delivered</option>
                    </Form.Control>
                  ) : (
                    <Badge bg={orderStatusColor[order.status]}>
                      {order.status}
                    </Badge>
                  )}
                </Col>
                {userInfo && userInfo.isAdmin && !order.isDelivered && (
                  <Col>
                    <FaEdit onClick={() => setIsEdit(true)} />
                  </Col>
                )}
              </Row>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
}

export default OrderPage;
