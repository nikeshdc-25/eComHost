import { Navbar, Container, Nav, Badge, NavDropdown } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import logo from "../assets/react.svg";
import { logout } from "../slices/authSlice";
import { useUserLogoutMutation } from "../slices/userApiSlice";
import { LinkContainer } from "react-router-bootstrap";
import SearchBox from "./SearchBox";

function Header() {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [userLogout, { isLoading }] = useUserLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutHandler = async () => {
    try {
      let resp = await userLogout().unwrap();
      dispatch(logout());
      toast.success(resp.message);
      navigate("/signin");
    } catch (err) {
      toast.error(err.data.error);
    }
  };

  console.log(cartItems);
  return (
    <header>
      <Navbar variant="dark" bg="dark" expand="md" collapseOnSelect>
        <Container>
          <NavLink to="/" className="navbar-brand">
            <img src={logo} alt="logo" /> Broadway
          </NavLink>
          <Navbar.Toggle aria-controls="navbar" />

          <Navbar.Collapse id="navbar">
            <Nav className="ms-auto">
              <SearchBox />
              <NavLink to="/cart" className="nav-link">
                <FaShoppingCart /> Cart{" "}
                {cartItems.length > 0 && (
                  <Badge bg="success" pill>
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                  </Badge>
                )}
              </NavLink>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="profile-dropdown">
                  <NavDropdown.Item
                    onClick={() => {
                      navigate("/profile");
                    }}
                  >
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <NavLink to="/signin" className="nav-link">
                  <FaUser /> Signin
                </NavLink>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown
                  title="admin"
                  id="admin-routes"
                  variant="dark"
                  bg="dark"
                >
                  <LinkContainer to="/admin/orders">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/products">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
