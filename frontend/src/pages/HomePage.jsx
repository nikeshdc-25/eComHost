import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import { useParams } from "react-router-dom";
import { useGetProductsQuery } from "../slices/productSlice";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import Meta from "../components/Meta";
import { Fab } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useState, useEffect } from "react";

const HomePage = () => {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({
    pageNumber,
    keyword,
  });

  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 500) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Meta />
      {!keyword && <ProductCarousel />}
      {keyword ? (
        <h2>Search Results for {keyword}</h2>
      ) : (
        <h2>Latest Products</h2>
      )}
      {isLoading ? (
        <h1>Loading...</h1>
      ) : error ? (
        <Message variant="danger">{error?.data?.error || error.error}</Message>
      ) : (
        <>
          <Row>
            {data.products.map((product) => (
              <Col xs={6} sm={6} md={4} lg={3} xl={3} key={product._id}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            page={data.page}
            pages={data.pages}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
      {showScroll && (
        <Fab
          color="success"
          aria-label="scroll to top"
          onClick={scrollToTop}
          className={showScroll ? "fab-hidden" : ""}
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1,
            borderRadius: 5,
            width: "40px",
            height: "40px",
          }}
        >
          <ArrowUpwardIcon />
        </Fab>
      )}
    </>
  );
};

export const dataLoader = async () => {
  let resp = await fetch("/api/v1/products");
  let data = await resp.json();
  return data;
};

export default HomePage;
