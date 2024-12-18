import React from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import HomePage, { dataLoader } from "./pages/HomePage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import { Provider } from "react-redux";
import { store } from "./store.js";
import ShippingPage from "./pages/ShippingPage.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";
import PlaceOrderPage from "./pages/PlaceOrderPage.jsx";
import BuyNowPage from "./pages/BuyNowPage.jsx";
import OrderPage from "./pages/OrderPage.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import OrdersPage from "./pages/admin/OrdersPage.jsx";
import ProductsListPage from "./pages/admin/ProductsListPage.jsx";
import ProductEditPage from "./pages/admin/ProductEditPage.jsx";
import { HelmetProvider } from "react-helmet-async";
import UsersPage from "./pages/admin/UsersPage.jsx";
import ForgotPasswordPage from "./pages/ForgetPaswordPage.jsx";
import TNCPage from "./pages/TNCPage.jsx";
// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     children: [
//       {
//         path: "",
//         element: <HomePage />,
//       },
//       {
//         path: "product",
//         element: <ProductPage />,
//       },
//       {
//         path: "cart",
//         element: <CartPage />,
//       },
//       {
//         path: "signin",
//         element: <LoginPage />,
//       },
//     ],
//   },
// ]);

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<App />}>
      <Route path="" element={<HomePage />} loader={dataLoader} />
      <Route
        path="search/:keyword"
        element={<HomePage />}
        loader={dataLoader}
      />
      <Route
        path="search/:keyword/page/:pageNumber"
        element={<HomePage />}
        loader={dataLoader}
      />
      <Route
        path="page/:pageNumber"
        element={<HomePage />}
        loader={dataLoader}
      />
      <Route path="product/:id" element={<ProductPage />} />
      <Route path="cart" element={<CartPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="forgetpass" element={<ForgotPasswordPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="" element={<PrivateRoute />}>
        <Route path="shipping" element={<ShippingPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="placeorder" element={<PlaceOrderPage />} />
        <Route path="buynow" element={<BuyNowPage />} />
        <Route path="order/:id" element={<OrderPage />} />
      </Route>
      <Route path="" element={<AdminRoute />}>
        <Route path="admin/orders" element={<OrdersPage />} />
        <Route path="admin/products" element={<ProductsListPage />} />
        <Route path="admin/users" element={<UsersPage />} />
        <Route
          path="admin/products/page/:pageNumber"
          element={<ProductsListPage />}
        />
        <Route path="admin/product/:id/edit" element={<ProductEditPage />} />
      </Route>
    </Route>
    <Route path="/termsandcondition" element={<TNCPage />} />
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </HelmetProvider>
);
