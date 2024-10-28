import React from "react";
import { Button, Card, CardFooter } from "react-bootstrap";
import Rating from "./Rating";
import "./product.css";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";

function Product({ product }) {
  return (
    <Card className="my-3 product-card">
      <Link
        to={`/product/${product._id}`}
        title={`${product.name}`}
        className="nav-link"
      >
        <Card.Img src={product.image} variant="top" />
      </Link>
      <Card.Body>
        <Card.Text as="div">
          <strong className="product-title">{product.name}</strong>
        </Card.Text>
        <Card.Text as="div">
          <Rating value={product.rating} text={product.numReviews}>
            {product.name}
          </Rating>
        </Card.Text>
        <Card.Text as="h3">${product.price}</Card.Text>
      </Card.Body>
      <CardFooter>
        <div className="d-flex justify-content-start gap-2">
          <Button variant='success'>Add to Cart</Button>
          <Button variant='warning'>Quick Pay</Button>
          <button className="btn ms-auto">
            <FaEye />
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default Product;
