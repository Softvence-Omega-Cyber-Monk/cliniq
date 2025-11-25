import React from "react";
import { Bell, Menu } from "lucide-react";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const avatarUrl = "https://placehold.co/40x40/fbcfe8/be185d?text=Dr";

  return (
    <header
      className="
            sticky top-0 z-10
            bg-white
            border-b border-gray-200
            p-4 md:py-6 md:px-8
            shadow-sm
        "
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-900">Welcome</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Welcome back, Dr. Thompson. Here's your overview for today.
          </p>
        </div> 

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full dark:text-gray-300 dark:hover:bg-gray-700 transition"
            aria-label="Toggle navigation"
          >
            <Menu className="w-6 h-6" />
          </button>

          <button
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full dark:text-gray-300 dark:hover:bg-gray-700 transition"
            aria-label="Notifications"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 block h-2 w-2 rounded-full ring-2 ring-white bg-pink-400 dark:ring-gray-900"></span>
          </button>

          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-pink-400">
            <img
              src={avatarUrl}
              alt="User Avatar"
              className="w-full h-full object-cover"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.style.display = "none";
              }}
            />
            <div
              className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs bg-pink-400"
              style={{ display: "none" }}
            >
              DR
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
