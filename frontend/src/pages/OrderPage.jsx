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
import esewaIcon from "../assets/esewasvg.png";
import khaltiIcon from "../assets/khaltisvg.png";
import { Button } from "@mui/material";
import { Avatar, Grid } from "@mui/joy";
import { nepaliRupeesFormat } from "../utils/rupeesUtils";

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
  console.log(order);
  const handleEsewaPayment = () => {
    window.location.href = `https://esewa.com.np/epay/main`;
  };

  const handleKhaltiPayment = () => {
    window.location.href = `https://khalti.com/payment`;
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
            <hr></hr>
            <p>
              Name: {order.shippingAddress.recipient}
              {order.shippingAddress.phone}
              <br />
              Address: {order.shippingAddress.address} |{" "}
              {order.shippingAddress.city}
              <br />
              Phone: {order.shippingAddress.primaryPhone} |{" "}
              {order.shippingAddress.secondaryPhone}
            </p>
            {order.isDelivered ? (
              <Message variant="success">
                Delivered at {order.deliveredAt}
              </Message>
            ) : (
              <Message variant="danger">Not Delivered</Message>
            )}
          </ListGroup.Item>
          <ListGroup.Item>
            <h3>Payment</h3>
            <p>Mode: {order.paymentMethod || "Cash on Delivery"}</p>{" "}
            {order.isPaid ? (
              <Message variant="success">
                Paid Rs. {nepaliRupeesFormat(order.totalPrice)} via{" "}
                {order.paymentMethod}
              </Message>
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
                    <Link to={`/product/${item.product}`} className="nav-link">
                      <strong>{item.name}</strong>
                    </Link>
                    <Row>
                      <Col>
                        {item.flavour && (
                          <>
                            <b>Flavour:</b> {item.flavour}
                          </>
                        )}{" "}
                      </Col>
                      <Row>
                        <Col>
                          {item.nicotine && (
                            <>
                              <b>Nicotine:</b> {item.nicotine}mg
                            </>
                          )}
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          {" "}
                          {item.color && (
                            <>
                              <b>Color:</b> {item.color}
                            </>
                          )}
                        </Col>
                      </Row>
                    </Row>
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
                <Col>Item</Col>
                <Col>Rs. {nepaliRupeesFormat(order.itemPrice)}</Col>
              </Row>
              <Row>
                <Col>Shipping</Col>
                <Col>Rs. {nepaliRupeesFormat(order.shippingCharge)}</Col>
              </Row>
              <Row>
                <Col>Total</Col>
                <Col>Rs. {nepaliRupeesFormat(order.totalPrice)}</Col>
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
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Cancelled</option>
                      <option>Delivered</option>
                      <option>Refunded</option>
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
            {!order.isPaid && (
              <ListGroup.Item>
                <Row>
                  <Col>Payment Method</Col>
                  <Col>
                    <Grid container spacing={1}>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={handleEsewaPayment}
                          startIcon={
                            <Avatar
                              src={esewaIcon}
                              alt="eSewa"
                              sx={{ width: 30, height: 30, marginLeft: 1 }}
                            />
                          }
                        ></Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "#8e44ad",
                            "&:hover": {
                              backgroundColor: "#732d91",
                            },
                          }}
                          onClick={handleKhaltiPayment}
                          startIcon={
                            <Avatar
                              src={khaltiIcon}
                              alt="Khalti"
                              sx={{ width: 30, height: 30, marginLeft: 1 }}
                            />
                          }
                        ></Button>
                      </Grid>
                    </Grid>
                  </Col>
                </Row>
              </ListGroup.Item>
            )}
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
}

export default OrderPage;
