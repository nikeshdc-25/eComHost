import React from "react";
import { useGetAllOrdersQuery, useDeleteOrderMutation } from "../../slices/orderSlice";
import Message from "../../components/Message";
import { Table, Button, Modal } from "react-bootstrap";
import { FaTimes, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const OrdersPage = () => {
  const { data: orders, isLoading, error, refetch  } = useGetAllOrdersQuery();
  const [deleteOrder] = useDeleteOrderMutation();
  console.log(orders)
  const deleteOrderHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete the order?")) {
      try {
        let resp = await deleteOrder(id).unwrap();
        toast.success(resp.message);
        refetch();
      } catch (err) {
        toast.error(err.data.error);
      }
    }
  };
  
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user.username}</td>
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
                    <Button variant="light" size="sm" className="mr-2">
                      Details
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteOrderHandler(order._id)}
                  >
                    <FaTrash />
                  </Button>
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
