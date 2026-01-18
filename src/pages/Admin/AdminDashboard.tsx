import AdminSidebar from "@/Layout/AdminSidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { Bell, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { logOut } from "@/store/Slices/AuthSlice/authSlice";

const AdminLayout = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logOut());
    // Implement your logout logic here
    navigate("/login");
  };
  return (
    <div className="flex min-h-screen bg-[#F7F7F2]">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Right Container */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* 🔥 Top Header */}
        <header className="h-16 border-b border-gray-200 bg-[#F3F3EC] flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Welcome back, manage your platform efficiently
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Bell className="h-5 w-5 text-gray-600 cursor-pointer hover:text-black" />

            {/* Profile Icon */}
            <div ref={dropdownRef}>
            <button
             
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <img
                src="https://i.pravatar.cc/35"
                alt="User Avatar"
                className="h-9 w-9 rounded-full border-2 border-white shadow"
              />
            </button>
            </div>
          </div>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          )}
        </header>

        {/* 🔥 Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
