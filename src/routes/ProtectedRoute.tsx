import { useAppSelector } from "@/hooks/useRedux";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles: "ADMIN" | "THERAPIST" | "CLINIC" | "INDIVIDUAL_THERAPIST";
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const userType = useAppSelector((state) => state.auth.userType);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);

  // Check if user is authenticated
  if (!userType || (!accessToken && !refreshToken)) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role matches the allowed role
  if (userType !== allowedRoles) {
    console.log("Role mismatch - redirecting based on userType:", userType);
    switch (userType) {
      case "ADMIN":
        return <Navigate to="/admin-dashboard" replace />;
      case "THERAPIST":
        return <Navigate to="/therapist" replace />;
      case "CLINIC":
        return <Navigate to="/private-practice-admin" replace />;
      case "INDIVIDUAL_THERAPIST":
        return <Navigate to="/individual-therapist-dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  // If role matches, render the protected content
  return <Outlet />;
};

export default ProtectedRoute;
