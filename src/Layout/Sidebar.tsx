import React from "react";
import {
  LayoutGrid,
  Users,
  Calendar,
  BarChart,
  Settings,
  HelpCircle,
  Zap,
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface NavItem {
  id: number;
  label: string;
  icon: React.ElementType;
  href: string;
}

const navItems: NavItem[] = [
  {
    id: 1,
    label: "Dashboard",
    icon: LayoutGrid,
    href: "/individual-therapist-dashboard",
  },
  {
    id: 2,
    label: "Clients",
    icon: Users,
    href: "individual-therapist/clients",
  },
  {
    id: 3,
    label: "Appointments",
    icon: Calendar,
    href: "individual-therapist/appointments",
  },
  {
    id: 4,
    label: "Reports",
    icon: BarChart,
    href: "individual-therapist/reports",
  },
  {
    id: 5,
    label: "Settings",
    icon: Settings,
    href: "individual-therapist/settings",
  },
  {
    id: 7,
    label: "Support",
    icon: HelpCircle,
    href: "individual-therapist/support",
  },
];

interface SidebarLinkProps {
  item: NavItem;
  onClick: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ item, onClick }) => {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.href}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center space-x-3 p-3 rounded-xl transition-colors duration-200 ${
          isActive
            ? "bg-sky-500 text-white "
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500"}`}
          />
          <span className="font-medium text-sm">{item.label}</span>
        </>
      )}
    </NavLink>
  );
};

interface SidebarProps {
  isOpen: boolean;
  setActiveItemId: (id: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setActiveItemId }) => {
  const sidebarClasses = `
    fixed left-0 top-0 h-full
    w-64 z-20
    bg-white border-r border-gray-200
    p-4 flex flex-col
    transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
    bg-gray-800 
  `;

  return (
    <div className={sidebarClasses}>
      {/* Logo/Header Section */}
      <div className="flex items-center px-2 py-4 mb-8">
        <Zap className="h-6 w-6 text-sky-500 mr-2" />
        <span className="text-xl font-bold text-gray-800">
          Individual Therapist
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <SidebarLink
            key={item.id}
            item={item}
            onClick={() => setActiveItemId(item.id)}
          />
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
