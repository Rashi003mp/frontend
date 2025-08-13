import React, { Suspense, lazy } from "react";
import {  Routes, Route, useLocation } from "react-router-dom"; // Keep BrowserRouter

import Navbar from "./components/Navbar";
import RoleBasedRoute from "./RoleBasedRoute";


// ✅ Lazy-loaded imports
const Login = lazy(() => import("./context/Login"));
const Registration = lazy(() => import("./context/Registration"));
const Landing = lazy(() => import("./pages/landingpage/Landing"));
const AboutPage = lazy(() => import("./pages/About"));
const Products = lazy(() => import("./pages/product/Product"));
const ProductDetails = lazy(() => import("./pages/product/ProductDetails"));
const WishlistPage = lazy(() => import("./pages/wishlist/WishlistPage"));
const Profile = lazy(() => import("./pages/Profile/profile"));
const CartPage = lazy(() => import("./pages/Cart/CartPage"));
const CallPay = lazy(() => import("./pages/payment/CallPay"));
const OrderConfirmation = lazy(() => import("./pages/Orders/OrderConfirmation"));
const OrderList = lazy(() => import("./pages/Orders/OrderList"));
const AdminDashboard = lazy(() => import("./pages/AdminPanal/pages/AdminDashboard"));
const ClientManagement = lazy(() => import("./pages/AdminPanal/pages/ClientManagement"));
const OrdersManagement = lazy(() => import("./pages/AdminPanal/pages/OrderManagement"));
const CollectionsManagement = lazy(() => import("./pages/AdminPanal/pages/CollectionManagement"));
const NotFound = lazy(() => import("./NotFount"));

function App() { // Renamed App to AppContent
  const location = useLocation();
  const hideNav = [
    '/admincollection',
    '/adminorders',
    '/adminclient',
    '/admindashboard',
    '/admin', // Assuming this is an admin entry point, might be covered by /admindashboard
    '/order-list',
    '/login',
    '/order-confirmation',
    '/registration',
    "/payment"
  ];

  return (
    <>
      {!hideNav.includes(location.pathname) && <Navbar />}

      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-screen text-lg">
            Loading...
          </div>
        }
      >
        <Routes>
          {/* Public Routes - accessible to everyone, no auth required */}
          {/* If a logged-in user tries to access login/register, they are redirected by RoleBasedRoute */}
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<AboutPage />} />
          
          {/* Publicly accessible product routes (can be viewed by guests and logged-in users) */}
          <Route path="/products" element={<Products />} />
          <Route path="/productdetails/:id" element={<ProductDetails />} />

          {/* Guest-only routes: Only accessible if NOT logged in. If logged in, redirects. */}
          <Route element={<RoleBasedRoute allowedRoles={['guest']} />}>
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
          </Route>

          {/* User-only routes: Only accessible if logged in as 'user'. */}
          {/* If a user is 'admin', they will be redirected away from these routes by RoleBasedRoute's internal logic. */}
          <Route element={<RoleBasedRoute allowedRoles={['user']} />}>
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/payment" element={<CallPay />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/order-list" element={<OrderList />} />
          </Route>

          {/* Admin-only routes: Only accessible if logged in as 'admin'. */}
          {/* If a user is 'user', they will be redirected away from these routes by RoleBasedRoute's internal logic. */}
          <Route element={<RoleBasedRoute allowedRoles={['admin']} />}>
            <Route path="/admindashboard" element={<AdminDashboard />} />
            <Route path="/adminclient" element={<ClientManagement />} />
            <Route path="/adminorders" element={<OrdersManagement />} />
            <Route path="/admincollection" element={<CollectionsManagement />} />
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
