import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import { useAppContext } from "./context/AppContext";
import Login from "./components/Login";
import AllProducts from "./pages/AllProducts";
import ProductCategory from "./pages/ProductCategory";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import AddAddress from "./pages/AddAddress";
import MyOrders from "./pages/MyOrders";
import SellerLogin from "./components/Seller/SellerLogin";
import SellerLayout from "./pages/Seller/SellerLayout";
import ProductsList from "./pages/Seller/ProductsList";
import AddProduct from "./pages/Seller/AddProduct";
import OrdersList from "./pages/Seller/OrdersList";
import Dashboard from "./pages/Seller/Dashboard";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccess from "./pages/OrderSuccess";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";

const App = () => {
  const isSellerPath = useLocation().pathname.includes("seller");
  const { showUserLogin, isSeller } = useAppContext();

  return (
    <div>
      {isSellerPath ? null : <Navbar />}
      {showUserLogin ? <Login /> : null}

      <Toaster />

      <div
        className={`${isSellerPath ? "" : ""} px-6 md:px-16 lg:px-24 xl:px-32`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/contact" element={<Contact />} />

          <Route
            path="/seller"
            element={
              isSeller ? (
                <SellerLayout>
                  <Dashboard />
                </SellerLayout>
              ) : (
                <SellerLogin />
              )
            }
          ></Route>
          <Route
            path="/seller/add-product"
            element={
              isSeller ? (
                <SellerLayout>
                  <AddProduct />
                </SellerLayout>
              ) : (
                <SellerLogin />
              )
            }
          />
          <Route
            path="/seller/products"
            element={
              isSeller ? (
                <SellerLayout>
                  <ProductsList />
                </SellerLayout>
              ) : (
                <SellerLogin />
              )
            }
          />
          <Route
            path="/seller/orders"
            element={
              isSeller ? (
                <SellerLayout>
                  <OrdersList />
                </SellerLayout>
              ) : (
                <SellerLogin />
              )
            }
          />
        </Routes>
      </div>
      {!isSellerPath && <Footer />}
    </div>
  );
};

export default App;
