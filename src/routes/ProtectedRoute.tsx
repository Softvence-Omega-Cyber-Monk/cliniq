import { useAppSelector } from "@/hooks/useRedux";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles: "ADMIN" | "THERAPIST" | "CLINIC" | "INDIVIDUAL_THERAPIST";
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const userType = useAppSelector((state) => state.auth.userType);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);

  // Allow access if either accessToken OR refreshToken exists
  if (!userType || (!accessToken && !refreshToken)) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userType)) {
    switch (userType) {
      case "ADMIN":
        return <Navigate to="/admin-dashboard" replace />;
      case "THERAPIST":
        return <Navigate to="/therapist-dashboard" replace />;
      case "CLINIC":
        return <Navigate to="/private-practice-admin" replace />;
      case "INDIVIDUAL_THERAPIST":
        return <Navigate to="/individual-therapist-dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;  