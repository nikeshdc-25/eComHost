import { Container } from "react-bootstrap";

function Footer() {
  let currentYear = new Date().getFullYear();
  return (
    <footer>
      <Container>
        <hr></hr>
        <p className="text-center py-3">vShop Nepal &copy; {currentYear}</p>
      </Container>
    </footer>
  );
}

export default Footer;
