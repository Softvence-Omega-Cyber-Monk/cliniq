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

if (!user) return <Navigate to="/login" replace />;

if (allowedRoles && !allowedRoles.includes(user.userType)) {
  switch (user.userType) {
    case "ADMIN":
      return <Navigate to="/admin-dashboard" replace />;

    case "THERAPIST":
      // Redirect based on clinicId existence
      if (user.clinicId) {
        return <Navigate to="/private-practice-dashboard" replace />;
      } else {
        return <Navigate to="/individual-therapist-dashboard" replace />;
      }
      case "CLINIC":
      return <Navigate to="/private-practice-admin" replace />;

    default:
      return <Navigate to="/login" replace />;
  }
}


  return <Outlet />;
};

export default ProtectedRoute;
