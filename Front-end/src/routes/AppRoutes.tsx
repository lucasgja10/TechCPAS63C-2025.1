import { Routes, Route } from "react-router-dom";
import Register from "../pages/register";
import Login from "../pages/login";
import RegisterProduct from "../pages/registerProduct";
import PrivateRoute from "../components/PrivateRoute";
import PublicRoute from "../components/PublicRoute";
import AdminRoute from "../components/AdminRoute";
import RegisterEntry from "../pages/registerEntry";
import RegisterExit from "../pages/registerExit";
import ManageUsers from "../pages/manageUsers";

const AppRoutes = () => {
  return (    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/register-product" element={<RegisterProduct />} />
        <Route path="/register-entry" element={<RegisterEntry />} />
        <Route path="/register-exit" element={<RegisterExit />} />
      </Route>
      
      <Route element={<AdminRoute />}>
        <Route path="/manage-users" element={<ManageUsers />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;