import AdminSidebar from "@/Layout/AdminSidebar";
import { Outlet } from "react-router-dom";
import { Bell } from "lucide-react";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#F7F7F2]">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Right Container */}
      <div className="flex-1 ml-64 flex flex-col">
        
        {/* 🔥 Top Header */}
        <header className="h-16 border-b border-gray-200 bg-[#F3F3EC] flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">
              Welcome back, manage your platform efficiently
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Bell className="h-5 w-5 text-gray-600 cursor-pointer hover:text-black" />

            {/* Profile Icon */}
            <img
              src="https://i.pravatar.cc/35"
              alt="User Avatar"
              className="h-9 w-9 rounded-full border-2 border-white shadow"
            />
          </div>
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
