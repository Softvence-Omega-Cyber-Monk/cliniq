import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../store/store";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const token = localStorage.getItem("token");
  console.log(user);

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.userType)) {
    switch (user.userType) {
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
