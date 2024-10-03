import { Image, Row, Col, ListGroup, Button, Form } from "react-bootstrap";
import axios from "axios";
import Rating from "../components/Rating";
import { useEffect, useState } from "react";
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

function ProductPage() {
  const { id } = useParams();
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  // const [product, setProduct] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useGetProductByIdQuery(id);
  const [addReview, { isLoading: reviewLoading }] = useAddReviewMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const addReviewHandler = async (e) => {
    e.preventDefault();
    try {
      let resp = await addReview({
        _id: product._id,
        rating,
        comment,
      }).unwrap();
      toast.success(resp.message);
    } catch (err) {
      toast.error(err.data.error);
    }
  };

  // useEffect(() => {
  //   axios
  //     .get("/api/v1/products/" + id) // `/api/v1/products/${id}`
  //     .then((resp) => setProduct(resp.data))
  //     .catch((err) => console.log(err.message));
  // }, []);

  const addToCartHandler = (item) => {
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
          <Link className="btn btn-light" to="/">
            Go Back
          </Link>
          <Row className="my-3">
            <Col md={5}>
              <Image src={product.image} fluid />
            </Col>
            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>${product.price}</strong>
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
                      <strong>{product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status</Col>
                    <Col>
                      <strong>
                        {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
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
                  <Button
                    variant="secondary"
                    disabled={product.countInStock <= 0}
                    onClick={() =>
                      addToCartHandler({ ...product, qty: Number(qty) })
                    }
                  >
                    Add To Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          <Row className="my-3">
            <Col md={6} className="reviews">
              <h2>Customer Reviews</h2>
              {product.reviews.length > 0 ? (
                product.reviews.map((review) => (
                  <>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.comment}</p>
                  </>
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
                      >
                        <option value={0}>Select Rating...</option>
                        <option value={1}>1 - Poor</option>
                        <option value={2}>2 - Satisfactory</option>
                        <option value={3}>3 - Good</option>
                        <option value={4}>4 - Very Good </option>
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
                      Add
                    </Button>
                  </Form>
                )
              ) : (
                <Message>
                  Please <Link to="/signin">Signin</Link> to review
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
