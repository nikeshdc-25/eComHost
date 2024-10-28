import { Container, Navbar, Nav, Badge, NavDropdown } from "react-bootstrap";
import logo from "../assets/react.svg";
import {
  FaShoppingCart,
  FaUser,
  FaHouseUser,
  FaHeart,
  FaSignOutAlt,
  FaUserCog,
  FaBoxes,
  FaUserEdit,
  FaSitemap,
} from "react-icons/fa";
import "./Header.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slices/authSlice";
import { toast } from "react-toastify";
import { IoMdSettings } from "react-icons/io";
import { FiActivity } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { useUserLogoutMutation } from "../slices/userApiSlice";
import SearchBox from "./SearchBox";

function Header() {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [userLogout, { isLoading }] = useUserLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      let res = await userLogout().unwrap();
      dispatch(logout()); // Dispatch the logout action
      toast.warn(res.message);
      navigate("/login");
    } catch (err) {
      toast.error(err.data.error);
    }
  };

  return (
    <header>
      <Navbar variant="dark" bg="dark" expand="md" collapseOnSelect>
        <NavLink to="/" className="navbar-brand">
          <Navbar.Brand className="px-2">
            <img src={logo} alt="logo" /> ECommerce
          </Navbar.Brand>
        </NavLink>
        <Container>
          <Navbar.Toggle aria-controls="navbar" />

          <Navbar.Collapse id="navbar">
            <Nav className="ms-auto">
              <SearchBox/>
              <NavLink to="" className="header-underline nav-link">
                <FaHouseUser /> Home
              </NavLink>
              <NavLink to="/cart" className="header-underline nav-link">
                <FaShoppingCart /> Cart{" "}
                {cartItems.length > 0 && (
                  <Badge bg="success" pill>
                    {cartItems.length}
                  </Badge>
                )}
              </NavLink>
              <NavLink to="/wishlist" className="header-underline nav-link">
                <FaHeart /> Wishlist
              </NavLink>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="Profile-dropdown">
                  <NavDropdown.Item onClick={() => navigate("/profile")}>
                    <CgProfile /> Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <FiActivity /> Activity
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <IoMdSettings /> Setting
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={logoutHandler}>
                    <FaSignOutAlt /> Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <NavLink to="/login" className="header-underline nav-link">
                  <FaUser /> Login
                </NavLink>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown
                  title={<FaUserCog />}
                  id="admin-routes"
                  variant="dark"
                  bg="dark"
                >
                  <NavDropdown.Item
                    onClick={() => {
                      navigate("/admin/orders");
                    }}
                  >
                    <FaSitemap /> Orders
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => {
                      navigate("/admin/users");
                    }}
                  >
                    <FaUserEdit /> Users
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => {
                      navigate("/admin/products");
                    }}
                  >
                    <FaBoxes /> Products
                  </NavDropdown.Item>
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
