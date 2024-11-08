import { Row, Col, ListGroup, Form } from "react-bootstrap";
import Rating from "../components/Rating";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { addItem } from "../slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import Meta from "../components/Meta";
import {
  useAddReviewMutation,
  useGetProductByIdQuery,
} from "../slices/productSlice";
import Message from "../components/Message";
import { toast } from "react-toastify";
import { MdCancel } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { SideBySideMagnifier } from "@datobs/react-image-magnifiers";
import { nepaliRupeesFormat } from "../utils/rupeesUtils";
import { Button, ButtonGroup, Divider } from "@mui/joy";
import BoltIcon from "@mui/icons-material/Bolt";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

function ProductPage() {
  const { id } = useParams();
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useGetProductByIdQuery(id);
  const [addReview, { isLoading: reviewLoading }] = useAddReviewMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [reviews, setReviews] = useState([]);
  const cartItems = useSelector((state) => state.cart.cartItems);


  useEffect(() => {
    if (product && product.reviews) {
      setReviews(product.reviews);
    }
  }, [product]);

  const addReviewHandler = async (e) => {
    e.preventDefault();
    try {
      let resp = await addReview({
        _id: product._id,
        rating,
        comment,
      }).unwrap();
      toast.success(resp.message);
      setReviews([...reviews, { name: userInfo.name, rating, comment }]); // Update local reviews
    } catch (err) {
      toast.error(err.data.error);
    }
  };

  const addToCartHandler = (item) => {
    const itemExists = cartItems.some((cartItem) => cartItem._id === item._id);
    if (itemExists) {
      toast.error(`Product is already in your cart.`);
    } else {
      dispatch(addItem(item));
      toast.success(`Added ${item.name} to your cart.`);
    };
  };
  const buyNowHandler = (item) => {
      dispatch(addItem(item));
      navigate("/cart");
  };
  return (
    <>
      {isLoading ? (
        <h1>Loading...</h1>
      ) : error ? (
        <Message variant="danger">{error?.data?.error || error.error}</Message>
      ) : (
        <>
          <Meta title={product.name} description={product.description} />
          <Row className="my-3">
            <Col md={5}>
              <SideBySideMagnifier
                imageSrc={product.image}
                alwaysInPlace={true}
                overlayOpacity={0.5}
                zoomContainerSize={{ width: "200px", height: "200px" }}
                zoomContainerBorder="1px solid #ddd"
                zoomContainerBoxShadow="0px 4px 8px rgba(0, 122, 18, 0.2)"
              />
            </Col>
            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Brand</strong>
                    </Col>
                    <Col>{product.brand}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Category</strong>
                    </Col>
                    <Col>{product.category}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Total Puffs</strong>
                    </Col>
                    <Col>N/A</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating value={product.rating} text={product.numReviews} />
                </ListGroup.Item>
                <ListGroup.Item>
                  <span>{product.description}</span>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <ListGroup>
                <ListGroup.Item>
                  <Row>
                    <Col>Price</Col>
                    <Col>
                      <strong>Rs. {nepaliRupeesFormat(product.price)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status</Col>
                    <Col>
                      <strong>
                        {product.countInStock > 0 ? (
                          <x>
                            In Stock <FaCheckCircle color="green" size={20} />
                          </x>
                        ) : (
                          <x>
                            Out of Stock <MdCancel color="red" size={20} />
                          </x>
                        )}
                      </strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Form.Control
                    as="select"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                  >
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1}>{x + 1}</option>
                    ))}
                  </Form.Control>
                </ListGroup.Item>
                <ListGroup.Item>
                  <ButtonGroup
                    color="success"
                    sx={{
                      "--ButtonGroup-radius": "40px",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="danger"
                      disabled={product.countInStock <= 0}
                      onClick={() =>
                        addToCartHandler({ ...product, qty: Number(qty) })
                      }
                    >
                      <AddShoppingCartIcon style={{ fontSize: "1.4rem" }} /> Add
                      to Cart
                    </Button>
                    <Divider />
                    <Button
                      variant="solid"
                      color="success"
                      disabled={product.countInStock <= 0}
                      className="ml-5"
                      onClick={() =>
                        buyNowHandler({ ...product, qty: Number(qty) })
                      }
                    >
                      <BoltIcon />
                      Buy Now
                    </Button>
                  </ButtonGroup>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          <Row className="my-3">
            <Col md={6} className="reviews">
              <h2>Customer Reviews</h2>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.comment}</p>
                    <hr />
                  </div>
                ))
              ) : (
                <Message>No Reviews Yet</Message>
              )}
              <h2 className="my-4">Add Review</h2>
              {userInfo ? (
                !userInfo.isAdmin && (
                  <Form onSubmit={addReviewHandler}>
                    <Form.Group controlId="rating" className="my-3">
                      <Form.Label>Rating</Form.Label>
                      <Form.Control
                        as="select"
                        onChange={(e) => setRating(e.target.value)}
                        required
                      >
                        <option value="">Select Rating...</option>
                        <option value={1}>1 - Poor</option>
                        <option value={2}>2 - Satisfactory</option>
                        <option value={3}>3 - Good</option>
                        <option value={4}>4 - Very Good</option>
                        <option value={5}>5 - Excellent</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="comment" className="my-3">
                      <Form.Label>Comment</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Write Comment"
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </Form.Group>
                    <Button type="submit" variant="dark" className="my-3">
                      Add Review
                    </Button>
                  </Form>
                )
              ) : (
                <Message>
                  Please <Link to="/login">Signin</Link> to review
                </Message>
              )}
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

export default ProductPage;
