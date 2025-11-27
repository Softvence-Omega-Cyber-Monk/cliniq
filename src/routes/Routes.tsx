import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import IndividualLayout from "../Layout/IndividualLayout";
import About from "../pages/About";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Form from "@/pages/Form";
import Services from "@/pages/Services";
import Clients from "@/pages/Clients";
import Appointments from "@/pages/Appointments";
import UserDashboardReportsPage from "../pages/UserDashboardReports";
import Therapists from "../pages/Therapist/Therapists";
import Sessions from "../pages/Sessions";
import DashboardContent from "@/components/IndividualDashboard/DashboardContent";
import PlatformSettings from "@/pages/PlatformSettings";
import SupportTickets from "@/pages/SupportTickets";
import ReportsTwo from "../pages/ReportsTwo";
import Billing from "../pages/Billing";
import Materials from "../pages/Materials";
import IndividualTherapistDashboard from "../pages/IndividualTherapist/IndividualTherapistDashboard";
import IndividualTherapistClients from "../pages/IndividualTherapist/IndividualTherapistClients";
import IndividualTherapistAppointments from "../pages/IndividualTherapist/IndividualTherapistAppointments";
import IndividualTherapistOldreport from "../pages/IndividualTherapist/IndividualTherapistOldreport";
import IndividualTherapistSettings from "../pages/IndividualTherapist/IndividualTherapistSettings";
import IndividualTherapistSupport from "../pages/IndividualTherapist/IndividualTherapistSupport";
import TherapistClientDetails from "@/pages/IndividualTherapist/TherapistClientDetails ";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        element: <ProtectedRoute allowedRoles={["THERAPIST"]} />,
        children: [
          {
            index: true,
            element: <Navigate to="/individual-therapist-dashboard" replace />,
          },
          {
            path: "individual-therapist-dashboard",
            element: <IndividualTherapistDashboard />,
          },
          { path: "clients", element: <IndividualTherapistClients /> },
          {
            path: "clients/:id",
            element: <TherapistClientDetails></TherapistClientDetails>,
          },
          {
            path: "appointments",
            element: <IndividualTherapistAppointments />,
          },
          { path: "reports", element: <IndividualTherapistOldreport /> },
          { path: "settings", element: <IndividualTherapistSettings /> },
          { path: "support", element: <IndividualTherapistSupport /> },
          { path: "about", element: <About /> },
          { path: "contact", element: <Contact /> },
          { path: "services", element: <Services /> },
          { path: "form", element: <Form /> },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
    children: [{ path: "", element: <AdminDashboard /> }],
  },
  {
    path: "/private-practice-admin",
    element: <ProtectedRoute allowedRoles={["CLINIC"]} />,
    children: [
      {
        path: "",
        element: <IndividualLayout />,
        children: [
          { index: true, element: <DashboardContent /> },
          { path: "therapists", element: <Therapists /> },
          { path: "sessions", element: <Sessions /> },
          { path: "clients", element: <Clients /> },
          { path: "appointments", element: <Appointments /> },
          { path: "reports", element: <UserDashboardReportsPage /> },
          { path: "reportstwo", element: <ReportsTwo /> },
          { path: "settings", element: <PlatformSettings /> },
          { path: "support", element: <SupportTickets /> },
          { path: "billing", element: <Billing /> },
          { path: "materials", element: <Materials /> },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
