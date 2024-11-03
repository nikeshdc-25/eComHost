import { Container, Row, Col } from "react-bootstrap";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <Header />
      <Container className="my-3">
        <Outlet />
      </Container>
      <Footer />
      <ToastContainer />
    </>
  );
}

export default App;
