import React, { useState } from "react";
import {
  useAddProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
} from "../../slices/productSlice";
import { Row, Col, Button, Table, Form } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import Message from "../../components/Message";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import Paginate from "../../components/Paginate";
import { nepaliRupeesFormat } from "../../utils/rupeesUtils";

const ProductsListPage = () => {
  const { pageNumber } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({ pageNumber });
  const [addProduct, { isLoading: productLoading }] = useAddProductMutation();
  const [deleteProduct, { isLoading: deleteLoading }] =
    useDeleteProductMutation();

  const [category, setCategory] = useState(0);

  const addProductHandler = async (e) => {
    e.preventDefault();
    try {
      let resp = await addProduct({ category }).unwrap();
      toast.success(resp.message);
    } catch (err) {
      toast.error(err.data.error);
    }
  };

  const deleteProductHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete the product?")) {
      try {
        let resp = await deleteProduct(id).unwrap();
        toast.success(resp.message);
      } catch (err) {
        toast.error(err.data.error);
      }
    }
  };

  return (
    <>
      <Row className="align-items-center mb-3">
        <Col>
          <h3>Products</h3>
        </Col>
        <Col className="text-end">
          <Form.Select
            aria-label="Select Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="me-2"
            style={{ width: "200px" }}
          >
            <option value="">Select Category</option>{" "}
            <option value="Liquid">Liquid</option>
            <option value="Pod">Pod</option>
            <option value="Mod">Mod</option>
            <option value="Coil">Coil</option>
            <option value="Disposable Vape">Disposable Vape</option>
          </Form.Select>
          {/* Create Product Button */}
          <Button
            size="sm"
            variant="dark"
            onClick={addProductHandler}
            disabled={!category}
          >
            <FaEdit className="mb-1" /> Create Product
          </Button>
        </Col>
      </Row>
      <>
        {isLoading ? (
          <h1>Loading...</h1>
        ) : error ? (
          <Message variant="danger">{error.data.error}</Message>
        ) : (
          <>
            <Table responsive hover striped className="table-sm">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.products.map((product) => (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>Rs. {nepaliRupeesFormat(product.price)}</td>
                    <td>Rs. {nepaliRupeesFormat(product.discount)}</td>
                    <td>{product.brand}</td>
                    <td>{product.category}</td>
                    <td>{product.countInStock}</td>
                    <td>
                      <Button
                        as={Link}
                        size="sm"
                        variant="light"
                        to={`/admin/product/${product._id}/edit`}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        className="ms-2"
                        onClick={() => deleteProductHandler(product._id)}
                      >
                        <FaTrash style={{ color: "white" }} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Paginate page={data.page} pages={data.pages} admin={true} />
          </>
        )}
      </>
    </>
  );
};

export default ProductsListPage;
