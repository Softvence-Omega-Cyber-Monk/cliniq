import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../store/store";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const userType = useSelector((state: RootState) => state.auth.userType);
  const token = localStorage.getItem("token");
  console.log(userType);

  if (!userType || !token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userType)) {
    switch (userType) {
      case "ADMIN":
        return <Navigate to="/admin-dashboard" replace />;
      case "THERAPIST":
        return <Navigate to="/private-practice-admin" replace />;
      case "PRIVATE_PRACTICE":
        return <Navigate to="/client-dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
