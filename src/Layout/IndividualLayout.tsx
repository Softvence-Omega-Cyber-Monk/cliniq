import React, { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  Users,
  BarChart,
  Settings,
  HelpCircle,
  Zap,
  // Bell,
  Menu,
  Calendar,
  LogOut,
  BookOpen,
  User,
} from "lucide-react";
import { useGetProfileQuery, useLogoutMutation } from "@/store/api/AuthApi";
import { toast } from "sonner";
import { useAppDispatch } from "@/hooks/useRedux";
import { logOut } from "@/store/Slices/AuthSlice/authSlice";
import { ScrollToTop } from "@/common/ScrollToTop";
import EditPersonalInfoModal from "@/modals/EditPersonalInfoModal";

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
    href: "/private-practice-admin",
  },
  {
    id: 2,
    label: "Therapists",
    icon: Users,
    href: "/private-practice-admin/therapists",
  },
  {
    id: 3,
    label: "Appointments",
    icon: Calendar,
    href: "/private-practice-admin/appointments",
  },
  {
    id: 8,
    label: "Clients",
    icon: Users,
    href: "/private-practice-admin/clients",
  },
  {
    id: 9,
    label: "Reports",
    icon: BarChart,
    href: "/private-practice-admin/reports",
  },
  {
    id: 11,
    label: "Materials",
    icon: BookOpen,
    href: "/private-practice-admin/materials",
  },
  {
    id: 6,
    label: "Settings",
    icon: Settings,
    href: "/private-practice-admin/settings",
  },
  {
    id: 7,
    label: "Support",
    icon: HelpCircle,
    href: "/private-practice-admin/support",
  },
];

interface SidebarLinkProps {
  item: NavItem;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ item }) => {
  const Icon = item.icon;
  const location = useLocation();
  const isDashboard = item.href === "/private-practice-admin";
  const isActive = isDashboard
    ? location.pathname === "/private-practice-admin"
    : location.pathname.startsWith(item.href);

  return (
    <NavLink
      to={item.href}
      className={`
        flex items-center space-x-3 p-3 rounded-xl transition-colors duration-200
        ${
          isActive
            ? "bg-sky-500 text-white shadow-lg"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }
      `}
    >
      <Icon
        className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500"}`}
      />
      <span className="font-medium text-sm">{item.label}</span>
    </NavLink>
  );
};

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const avatarUrl = "https://placehold.co/40x40/fbcfe8/be185d?text=Dr";
  const { data } = useGetProfileQuery({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    console.log("Logging out...");

    try {
      await logout({});
      dispatch(logOut());
    } catch {
      toast.error("Failed to logout. Please try again.");
    }
    setDropdownOpen(false);
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
    setDropdownOpen(false);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 md:py-6 md:px-8 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-900">Welcome</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Welcome back, {data?.user?.fullName}. Here's your overview for
            today.
          </p>
        </div>

        <div className="flex items-center space-x-4 relative">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full dark:text-gray-300 dark:hover:bg-gray-700 transition"
            aria-label="Toggle navigation"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* <button
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full dark:text-gray-300 dark:hover:bg-gray-700 transition"
            aria-label="Notifications"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 block h-2 w-2 rounded-full ring-2 ring-white bg-pink-400 dark:ring-gray-900"></span>
          </button> */}

          {/* Avatar with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-pink-400 cursor-pointer"
            >
              <img
                src={avatarUrl}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  {/* <p className="text-sm font-medium text-gray-900 truncate">
                    {data?.user?.fullName}
                  </p> */}
                  <button
                    onClick={handleEditProfile}
                    className=" flex gap-2 w-full cursor-pointer"
                  >
                    <User size={18} /> Profile
                  </button>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <EditPersonalInfoModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </header>
  );
};

const IndividualLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const sidebarClasses = `
    fixed left-0 top-0 h-full
    w-64 z-20
    bg-white border-r border-gray-200
    p-4 flex flex-col
    transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
  `;

  return (
    <div className="flex">
      <aside className={sidebarClasses}>
        <div className="flex items-center px-2 py-4 mb-8">
          <Zap className="h-6 w-6 text-sky-500 mr-2" />
          <span className="text-xl font-bold text-gray-800">
            Private Practice Admin
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <SidebarLink key={item.id} item={item} />
          ))}
        </nav>
      </aside>

      <div className="flex flex-col flex-1 bg-[#f3f3ec] md:ml-64">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1">
          <ScrollToTop />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default IndividualLayout;
