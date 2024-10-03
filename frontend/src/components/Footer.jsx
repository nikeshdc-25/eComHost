import { Container } from "react-bootstrap";

function Footer() {
  let currentYear = new Date().getFullYear();
  return (
    <footer>
      <Container>
        <p className="text-center py-3">Broadway &copy; {currentYear}</p>
      </Container>
    </footer>
  );
}

export default Footer;
