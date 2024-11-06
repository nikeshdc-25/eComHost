import { Alert } from "react-bootstrap";

function Message({ variant = "warning", children }) {
  return <Alert variant={variant}>{children}</Alert>;
}

export default Message;
