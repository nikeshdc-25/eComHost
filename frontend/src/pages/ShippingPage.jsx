import { useState } from "react";
import FormContainer from "../components/FormContainer";
import { Form, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { saveShippingAddress } from "../slices/shippingAddressSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ShippingPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { shippingAddress } = useSelector((state) => state.shippingAddress);
  const [recipient, setRecipient] = useState(userInfo.name);
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [primaryPhone, setPrimaryPhone] = useState(userInfo.primaryPhone);
  const [secondaryPhone, setSecondaryPhone] = useState(shippingAddress.secondaryPhone || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const source = location.state?.source;

  const submitHandler = (e) => {
    e.preventDefault();
    const phonePattern = /^(98|97|96)\d{8}$/;

    if (secondaryPhone && !phonePattern.test(secondaryPhone)) {
      toast.error("Enter a valid phone number.");
      return;
    }
    dispatch(saveShippingAddress({ recipient, address, city, primaryPhone, secondaryPhone }));
    if (source === "CartPage") {
      navigate("/placeorder");
    } else if (source === "BuyNowPage") {
      navigate("/buynow");
    }
    else {
      toast.error("Invalid source detected.");
    }
  };

  return (
    <FormContainer>
      <h2>Shipping Address</h2><hr></hr>
      <Form onSubmit={submitHandler} className="my-4">
        <Form.Group controlId="recipient" className="my-2">
          <Form.Label>Recipient Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            readOnly
          />
        </Form.Group>
        <Form.Group controlId="primaryPhone" className="my-2">
          <Form.Label>Contact</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Contact"
            value={primaryPhone}
            onChange={(e) => setPrimaryPhone(e.target.value)}
            readOnly
          />
        </Form.Group>
        <Form.Group controlId="secondaryPhone" className="my-2">
          <Form.Label>Second Contact</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter phone"
            value={secondaryPhone}
            onChange={(e) => setSecondaryPhone(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="address" className="my-2">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="house no./building/street/area"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="city" className="my-2">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            placeholder="Province/City/District"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit" variant="dark" className="my-2">
          Proceed to Payment
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingPage;
