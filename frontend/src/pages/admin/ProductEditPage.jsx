import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
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
  const [discount, setDiscount] = useState(0);
  const [countInStock, setCountInStock] = useState(0);
  const [nicotine, setNicotine] = useState([]);
  const [flavour, setFlavour] = useState([]);
  const [color, setColor] = useState([]);
  const [properties, setProperties] = useState([]);
  const { id } = useParams();
  const {
    data: product,
    isLoading: productLoading,
    refetch,
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
      setDiscount(product.discount);
      setCountInStock(product.countInStock);
      setNicotine(product.nicotine || []);
      setFlavour(product.flavour || []);
      setColor(product.color || []);
      setProperties(product.properties || []);
    }
  }, [product]);

  const updateProductHandler = async (e) => {
    e.preventDefault();
    const validatedProperties = properties.filter(
      (prop) => prop.key && prop.key.trim() !== ""
    );    

    try {
      let resp = await updateProduct({
        _id: product._id,
        name,
        brand,
        category,
        description,
        image,
        price,
        discount,
        countInStock,
        nicotine,
        flavour,
        color,
        properties: validatedProperties,
      }).unwrap();
      setProperties(validatedProperties);
      refetch();
      navigate("/admin/products");
      console.log(resp);
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

  const handlePropertyChange = (index, value) => {
    const updatedProperties = properties.map((prop, i) =>
      i === index ? { ...prop, value } : prop
    );
    setProperties(updatedProperties);
  };

  const handleNicotineChange = (value) => {
    setNicotine((prevNicotine) =>
      prevNicotine.includes(value)
        ? prevNicotine.filter((nic) => nic !== value)
        : [...prevNicotine, value]
    );
  };

  const handleColorChange = (value) => {
    setColor((prevColor) =>
      prevColor.includes(value)
        ? prevColor.filter((col) => col !== value)
        : [...prevColor, value]
    );
  };

  const addFlavour = () => {
    setFlavour((prevFlavours) => [...prevFlavours, ""]);
  };

  const handleFlavourInputChange = (index, value) => {
    const updatedFlavours = [...flavour];
    updatedFlavours[index] = value;
    setFlavour(updatedFlavours);
  };

  return (
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
          <Form.Control as="input" type="text" value={category} readOnly />
        </Form.Group>

        <Form.Group controlId="image" className="my-2">
          <Form.Label>Image</Form.Label>
          <Form.Control type="file" onChange={uploadImageHandler} />
        </Form.Group>
        <Form.Group controlId="price" className="my-2">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="discount" className="my-2">
          <Form.Label>Discount</Form.Label>
          <Form.Control
            type="text"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
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

        {category === "Disposable Vape" || category === "Liquid" ? (
          <>
            <Form.Group className="my-2">
              <Form.Label>Nicotine</Form.Label>
              {["0", "3", "6", "9", "20", "30", "40", "50"].map((value) => (
                <Form.Check
                  type="checkbox"
                  key={value}
                  label={`${value}mg`}
                  checked={nicotine.includes(value)}
                  onChange={() => handleNicotineChange(value)}
                />
              ))}
            </Form.Group>

            {category === "Disposable Vape" || category === "Liquid" ? (
              <>
                <Form.Group controlId="flavour" className="my-2">
                  <Button variant="dark" onClick={addFlavour} className="my-2">
                    Add Flavour
                  </Button>
                </Form.Group>
                {flavour.map((flavourItem, index) => (
                  <Form.Group
                    key={index}
                    controlId={`flavour-${index}`}
                    className="my-2"
                  >
                    <Form.Control
                      type="text"
                      value={flavourItem}
                      onChange={(e) =>
                        handleFlavourInputChange(index, e.target.value)
                      }
                    />
                  </Form.Group>
                ))}
              </>
            ) : null}
          </>
        ) : null}

        {category === "Pod" || category === "Mod" ? (
          <Form.Group className="my-2">
            <Form.Label>Color</Form.Label>
            {[
              "gold",
              "pink",
              "blue",
              "orange",
              "red",
              "white",
              "brown",
              "purple",
              "green",
              "black",
            ].map((value) => (
              <Form.Check
                type="checkbox"
                key={value}
                label={value}
                checked={color.includes(value)}
                onChange={() => handleColorChange(value)}
              />
            ))}
          </Form.Group>
        ) : null}

        {properties &&
          properties.length > 0 &&
          properties.map((prop, index) => (
            <div key={index} className="mb-3">
              <Form.Label>{prop.key}</Form.Label>
              <Form.Control
                type="text"
                value={prop.value}
                onChange={(e) => handlePropertyChange(index, e.target.value)}
              />
            </div>
          ))}

        <Button
          type="submit"
          variant="dark"
          className="my-3"
        >   
          Update Product
        </Button>
      </Form>
    </FormContainer>
  );
}

export default ProductEditPage;
