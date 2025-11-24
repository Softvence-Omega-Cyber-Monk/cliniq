import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

const AdminRoute = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user || user.userType !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default AdminRoute;
