import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import FormContainer from "../../components/FormContainer";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from "../../slices/productSlice";
import { toast } from "react-toastify";

function ProductEditPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState(0);
  const [countInStock, setCountInStock] = useState(0);
  const { id } = useParams();
  const {
    data: product,
    isLoading: productLoading,
    error,
  } = useGetProductByIdQuery(id);
  const navigate = useNavigate();

  const [updateProduct, { isLoading: updateLoading }] =
    useUpdateProductMutation();

  const [uploadProductImage, { isLoading: imageLoading }] =
    useUploadProductImageMutation();
  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setBrand(product.brand);
      setCategory(product.category);
      setPrice(product.price);
      setCountInStock(product.countInStock);
    }
  }, [product]);
  const updateProductHandler = async (e) => {
    e.preventDefault();
    try {
      let resp = await updateProduct({
        _id: product._id,
        name,
        brand,
        category,
        description,
        image,
        price,
        countInStock,
      }).unwrap();
      navigate("/admin/products");
      toast.success(resp.message);
    } catch (err) {
      toast.error(err.data.error);
    }
  };
  const uploadImageHandler = async (e) => {
    try {
      let formData = new FormData();
      formData.append("image", e.target.files[0]);
      let resp = await uploadProductImage(formData).unwrap();
      setImage(resp.path);
      toast.success(resp.message);
    } catch (err) {
      toast.error(err.data.error);
    }
  };
  return (
    <>
      <FormContainer>
        <h1 className="mb-2">Edit Product</h1>
        <Form onSubmit={updateProductHandler}>
          <Form.Group controlId="name" className="my-2">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="brand" className="my-2">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="category" className="my-2">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" onChange={uploadImageHandler} />
            </Form.Group>
          </Form.Group>
          <Form.Group controlId="price" className="my-2">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="countInStock" className="my-2">
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              type="text"
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="description" className="my-2">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </Form.Group>
          <Button type="submit" variant="dark" className="my-2">
            Update
          </Button>
        </Form>
      </FormContainer>
    </>
  );
}

export default ProductEditPage;
