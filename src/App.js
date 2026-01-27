import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import LandingPage from "./Pages/LandingPage";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import Verification from "./Pages/Auth/Verification";
import Address from "./Pages/Auth/Address";
import UserImage from "./Pages/Auth/UserImage";
import HomePage from "./Pages/HomePage";
import Categories from "./Pages/Categories";
import Category from "./Pages/Category";
import TechnicianPage from "./Pages/TechnicianPage";
import Overview from "./Pages/Overview";
import RequestService from "./Pages/RequestService";
import SendSuccess from "./Pages/SendSuccess";
import RequestDetails from "./Pages/RequestDetails";
import TechnicianDashboard from "./Pages/TechnicianDashboard/TechnicianDashboard";
import Dashboard from "./Pages/TechnicianDashboard/Dashboard";
import RequireAuth from "./Pages/Auth/RequireAuth";
import TechnicianRegister from "./Pages/Auth/TechnicianRegister";
import DashboardAdmin from "./Pages/Admin/Dashboard";
import OverviewAdmin from "./Pages/Admin/OverviewAdmin";
import CategoriesMangment from "./Pages/Admin/CategoriesMangment";
import TechnicianControl from "./Pages/Admin/TechniciansControl";
import USerControl from "./Pages/Admin/UsreControl";
import CreateDepartment from "./Pages/Admin/CreateDepartment";
import UpdateDepartment from "./Pages/Admin/UpdateDepartment";
import OrdersControl from "./Pages/Admin/OrdersControl";
import UserProfile from "./Pages/UserProfile";
import OrderDetailsComtrol from "./Pages/Admin/OrderDetailsComtrol";
import UpdateUserProfile from "./Pages/UpdateUserProfile";
import OrdersTechnicianControl from "./Pages/TechnicianDashboard/OrdersTechnicianControl";
import ScrollToTop from "./Components/ScrollToTop";
import AccountType from "./Pages/Auth/AccountType";
import MyOrders from "./Pages/MyOrders";
import UserRating from "./Pages/UserRating";

import RatingPageTechnician from "./Pages/RatingPageTechnician";
import ReviewsTechnicianDashboard from "./Pages/TechnicianDashboard/ReviewsTechnicianDashboard";
import Slide from "./Components/Slide";
import { useEffect, useState } from "react";
import AppLoading from "./Components/AppLoading";
import ForgetPassword from "./Pages/Auth/ForgetPassword";
import VerifyResetPassword from "./Pages/Auth/VerifyResetPassword";
import NewResetPassword from "./Pages/Auth/NewResetPassword";
import UserProfileView from "./Pages/UserProfileView";
import OverviewUser from "./Pages/OverviewUser";
import RatingPageUser from "./Pages/RatingPageUser";
import TechnicianRating from "./Pages/TechnicianDashboard/TechnicianRating";

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // هنا أي تجهيزات للموقع
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) return <AppLoading heading="جاري التحميل الموقع...." />;
  return (
    <div className="App">
      <ScrollToTop />
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/slide" element={<Slide />} />
        <Route path="/account-type" element={<AccountType />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verification />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route
          path="/verify-reset-password"
          element={<VerifyResetPassword />}
        />
        <Route path="/new-reset-password" element={<NewResetPassword />} />

        <Route element={<RequireAuth role={["User", "Technician", "Admin"]} />}>
          <Route path="/address" element={<Address />} />
          <Route path="/user-image" element={<UserImage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:id" element={<Category />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/technicians/:id" element={<TechnicianPage />}>
            <Route index element={<Overview />} />
            <Route path="rating" element={<RatingPageTechnician />} />
          </Route>
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/user-profile/update" element={<UpdateUserProfile />} />
          <Route path="/request-service/:id" element={<RequestService />} />
          <Route path="/request-success" element={<SendSuccess />} />
          <Route path="/my-orders/:id" element={<RequestDetails />} />
          <Route path="/order-rating/:id" element={<UserRating />} />
          <Route path="/user-profile/:id" element={<UserProfileView />}>
            <Route index element={<OverviewUser />} />
            <Route path="rating" element={<RatingPageUser />} />
          </Route>
        </Route>

        <Route element={<RequireAuth role="Technician" />}>
          <Route path="/technician-dashboard" element={<TechnicianDashboard />}>
            <Route index element={<Dashboard />} />
            <Route path="reviews" element={<ReviewsTechnicianDashboard />} />
            <Route path="orders" element={<OrdersTechnicianControl />} />
            <Route path="orders/:id" element={<OrderDetailsComtrol />} />
            <Route path="rating/:id" element={<TechnicianRating />} />
          </Route>
        </Route>

        <Route path="/tech-register" element={<TechnicianRegister />} />

        <Route element={<RequireAuth role="Admin" />}>
          <Route path="/admin-dashboard" element={<DashboardAdmin />}>
            <Route index element={<OverviewAdmin />} />
            <Route path="categories" element={<CategoriesMangment />} />
            <Route path="categories/create" element={<CreateDepartment />} />
            <Route path="categories/:id" element={<UpdateDepartment />} />
            <Route path="technicians" element={<TechnicianControl />} />
            <Route path="users" element={<USerControl />} />
            <Route path="orders" element={<OrdersControl />} />
            <Route path="orders/:id" element={<OrderDetailsComtrol />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
