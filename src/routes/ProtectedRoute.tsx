import { useAppSelector } from "@/hooks/useRedux";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles: "ADMIN" | "THERAPIST" | "CLINIC" | "INDIVIDUAL_THERAPIST";
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const userType = useAppSelector((state) => state.auth.userType);
  const token = localStorage.getItem("token");
  console.log(userType);

  if (!userType || !token) {
    return <Navigate to="/login" replace />;
  }

  if (!userType) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(userType)) {
    switch (userType) {
      case "ADMIN":
        return <Navigate to="/admin-dashboard" replace />;

      case "THERAPIST":
        return <Navigate to="/individual-therapist-dashboard" replace />;

      case "CLINIC":
        return <Navigate to="/private-practice-admin" replace />;
      case "INDIVIDUAL_THERAPIST" :
        return <Navigate to="/individual-therapist-dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
