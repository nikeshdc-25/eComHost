import { Container, Navbar, Nav, Badge, NavDropdown, Image } from "react-bootstrap";
import logo from "../assets/vshopBlack.png";
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
import { useUserLogoutMutation } from "../slices/userApiSlice";
import SearchBox from "./SearchBox";
import MarqueeBanner from "./MarqueeBanner";
import { useState } from "react";

function Header() {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [userLogout, { isLoading }] = useUserLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const logoutHandler = async () => {
    try {
      let res = await userLogout().unwrap();
      dispatch(logout());
      toast.warn(res.message);
      navigate("/login");
    } catch (err) {
      toast.error(err.data.error);
    }
  };

  const handleNavClick = (path) => {
    setExpanded(false);
    navigate(path);
  };

  const collapseHandler = () => setExpanded(false); // Collapse function for SearchBox

  return (
    <header style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
      <MarqueeBanner />
      <Navbar
        expand="xl"
        style={{ backgroundColor: "#f8f9fa" }}
        variant="light"
        collapseOnSelect
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
      >
        <Container>
          <NavLink to="/" className="navbar-brand">
            <Image src={logo} alt="logo" width={50} />
            <span className="vapournepal">vapournepal</span>
          </NavLink>
          <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse id="navbar">
            <Nav className="ms-auto">
              <SearchBox collapseHandler={collapseHandler} />
              <NavLink to="" className="nav-link" onClick={() => handleNavClick("/")}>
                <FaHouseUser /> Home
              </NavLink>
              <NavLink to="/cart" className="nav-link" onClick={() => handleNavClick("/cart")}>
                <FaShoppingCart /> Cart{" "}
                {cartItems.length > 0 && (
                  <Badge bg="success" pill>{cartItems.length}</Badge>
                )}
              </NavLink>
              <NavLink to="/wishlist" className="nav-link" onClick={() => handleNavClick("/wishlist")}>
                <FaHeart /> Wishlist
              </NavLink>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="Profile-dropdown">
                  <NavDropdown.Item onClick={() => handleNavClick("/profile")}>
                    <FaUserEdit /> Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => handleNavClick("/activity")}>
                    <FiActivity /> Activity
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => handleNavClick("/settings")}>
                    <IoMdSettings /> Settings
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={logoutHandler}>
                    <FaSignOutAlt /> Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <NavLink to="/login" className="nav-link" onClick={() => handleNavClick("/login")}>
                  <FaUser /> Login
                </NavLink>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title={<FaUserCog />} id="admin-routes">
                  <NavDropdown.Item onClick={() => handleNavClick("/admin/orders")}>
                    <FaSitemap /> Orders
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => handleNavClick("/admin/users")}>
                    <FaUserEdit /> Users
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => handleNavClick("/admin/products")}>
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
