import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./context/Login";
import Landing from "./pages/landingpage/Landing";
import Registration from "./context/Registration";
import Products from "./pages/product/Product";
import ProductDetails from "./pages/product/ProductDetails";
import AboutPage from "./pages/About";
import WishlistPage from "./pages/wishlist/WishlistPage";
import Profile from "./pages/Profile/profile";
import CartPage from "./pages/Cart/CartPage";
import CallPay from "./pages/payment/CallPay";
import OrderConfirmation from "./pages/Orders/OrderConfirmation";
import OrderList from "./pages/Orders/OrderList";
import AdminDashboard from "./pages/AdminPanal/pages/AdminDashboard";
import ClientManagement from "./pages/AdminPanal/pages/ClientManagement";
import OrdersManagement from "./pages/AdminPanal/pages/OrderManagement";
import CollectionsManagement from "./pages/AdminPanal/pages/CollectionManagement";
import Navbar from "./components/Navbar";
import RoleBasedRoute from "./RoleBasedRoute";

function App(){
  const location=useLocation();
   const hideNav=['/admincollection',
    '/adminorders',
    '/adminclient',
    '/admindashboard',
    '/admin',
    '/order-list',
    '/login',
    '/order-confirmation',
    '/registration',
    "/payment"]
  return(
    <>
    {!hideNav.includes(location.pathname) && <Navbar /> }

 <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<AboutPage />} />

        {/* USER-only routes */}
        <Route element={<RoleBasedRoute allowedRoles={['user']} redirectTo="/admindashboard" />}>
          <Route path="/products" element={<Products />} />
          <Route path="/productdetails/:id" element={<ProductDetails />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/payment" element={<CallPay />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/order-list" element={<OrderList />} />
        </Route>

        {/* ADMIN-only routes */}
        <Route element={<RoleBasedRoute allowedRoles={['admin']} redirectTo="/login" />}>
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/adminclient" element={<ClientManagement />} />
          <Route path="/adminorders" element={<OrdersManagement />} />
          <Route path="/admincollection" element={<CollectionsManagement />} />
        </Route>
      </Routes>

</>  )
}
export default App