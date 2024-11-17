import React, { useState } from "react";
import Message from "../../components/Message";
import { Table, Button, Modal } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useDeleteUserMutation, useGetUserQuery, useUpdateUserAdminMutation } from "../../slices/userApiSlice";

const UsersPage = () => {
  const { data: users, isLoading, error, refetch } = useGetUserQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUserAdmin] = useUpdateUserAdminMutation();

  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  const { userInfo } = useSelector((state) => state.auth);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (id) => {
    setUserIdToDelete(id);
    setShowModal(true);
  };

  const deleteUserHandler = async () => {
    if (userIdToDelete) {
      try {
        let resp = await deleteUser(userIdToDelete).unwrap();
        toast.success(resp.message);
        setShowModal(false);
        refetch();
      } catch (err) {
        toast.error(err.data.error);
      }
    }
  };

  const toggleAdminHandler = async (id) => {
    try {
      let response = await updateUserAdmin(id).unwrap();
      toast.success(response.message);
      refetch();
    } catch (err) {
      toast.error(err.data.error);
    }
  };

  return (
    <>
      <h2 className="mb-3">Users</h2>
      {isLoading ? (
        <h1>Loading...</h1>
      ) : error ? (
        <Message variant="danger">{error.data.error}</Message>
      ) : (
        <Table responsive striped hover className="table-sm">
          <thead>
            <tr>
              <th>Id</th>
              <th>Username</th>
              <th>Email</th>
              <th>Primary Phone</th>
              <th>Is Admin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.primaryPhone}</td>
                <td>{user.isAdmin ? "Yes" : "No"}</td>
                <td>
                  {user.email === "nutternikexdx@gmail.com" ? (
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      SUPREME
                    </span>
                  ) : (
                    <>
                      {userInfo && userInfo.email === "nutternikexdx@gmail.com" && (
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => toggleAdminHandler(user._id)}
                          className="mr-2"
                        >
                          {user.isAdmin ? "Demote" : "Promote"}
                        </Button>
                      )}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleShowModal(user._id)}
                      >
                        <FaTrash />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this user?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteUserHandler}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UsersPage;
