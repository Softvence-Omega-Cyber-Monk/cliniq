import {
  LayoutGrid,
  Users,
  Calendar,
  FileText,
  BarChart,
  Settings,
  HelpCircle,
  Zap,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { id: 1, label: "Dashboard", icon: LayoutGrid, href: "/admin-dashboard", exact: true },
  { id: 2, label: "Therapists", icon: Users, href: "/admin-dashboard/admin-therapists" },
  { id: 3, label: "Sessions", icon: Calendar, href: "/admin-dashboard/admin-sessions" },
  { id: 4, label: "Content Management", icon: FileText, href: "/admin-dashboard/admin-content" },
  { id: 5, label: "Reports", icon: BarChart, href: "/admin-dashboard/admin-reports" },
  { id: 6, label: "Settings", icon: Settings, href: "/admin-dashboard/admin-settings" },
  { id: 7, label: "Support", icon: HelpCircle, href: "/admin-dashboard/admin-support" },
];

// SidebarLink Component
const SidebarLink = ({ item }: any) => {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.href}
      end={item.exact} 
      className={({ isActive }) =>
        `group flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-sky-500 text-white shadow-lg"
            : "text-[#575A62] hover:bg-sky-500 hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={`w-5 h-5 transition-colors duration-200 ${
              isActive
                ? "text-white"
                : "text-[#575A62] group-hover:text-white"
            }`}
          />
          <span className="font-medium text-sm">{item.label}</span>
        </>
      )}
    </NavLink>
  );
};

// Main Component
const AdminSidebar = () => {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-[#F3F3EC] border-r border-gray-200 p-4 flex flex-col">
      <div className="flex items-center px-2 py-4 mb-8">
        <Zap className="h-6 w-6 text-sky-500 mr-2" />
        <span className="text-xl font-bold text-[#575A62]">Admin Panel</span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <SidebarLink key={item.id} item={item} />
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
