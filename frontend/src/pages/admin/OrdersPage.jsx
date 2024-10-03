import React from "react";
import { useGetAllOrdersQuery } from "../../slices/orderSlice";
import Message from "../../components/Message";
import { Table, Button } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
const OrdersPage = () => {
  const { data: orders, isLoading, error } = useGetAllOrdersQuery();
  return (
    <>
      <h2 className="mb-3">Orders</h2>
      {isLoading ? (
        <h1>Loading...</h1>
      ) : error ? (
        <Message variant="danger">{error.data.error}</Message>
      ) : (
        <Table responsive striped hover className="table-sm">
          <thead>
            <tr>
              <th>Id</th>
              <th>User</th>
              <th>Date</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Delivered</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
                <td>
                  <Link to={`/order/${order._id}`}>
                    <Button variant="light" size="sm">
                      Details
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrdersPage;
