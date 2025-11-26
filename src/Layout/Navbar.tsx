import React, { useState, useRef, useEffect } from "react";
import { Bell, Menu, LogOut, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { logout } from "@/store/Slices/AuthSlice/authSlice";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const avatarUrl = user?.photoUrl || null;
  const initials =
    user?.fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "US";

  const [dropdownOpen, setDropdownOpen] = useState(false);
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
    dispatch(logout());
    // Implement your logout logic here
    console.log("Logout clicked");
  };

  const handleProfile = () => {
    // Redirect to profile page or open modal
    console.log("Profile clicked");
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 md:py-6 md:px-8 shadow-sm">
      <div className="flex justify-between items-start">
        {/* Welcome message */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {user?.fullName || "User"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{user?.email || ""}</p>
        </div>

        {/* Right controls */}
        <div className="flex items-center space-x-4 relative">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition"
            aria-label="Toggle navigation"
          >
            <Menu className="w-6 h-6" />
          </button>

          <button
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition"
            aria-label="Notifications"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 block h-2 w-2 rounded-full ring-2 ring-white bg-pink-400"></span>
          </button>

          {/* Avatar */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-400 flex items-center justify-center bg-pink-400 text-white font-bold text-xs"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                  onError={(
                    e: React.SyntheticEvent<HTMLImageElement, Event>
                  ) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.style.display = "none";
                  }}
                />
              ) : (
                <span>{initials}</span>
              )}
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                <button
                  onClick={handleProfile}
                  className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                >
                  <User size={18} /> Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
