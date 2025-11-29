import { Outlet } from "react-router-dom";
import { useState, useCallback } from "react";
import Navbar from "./Navbar"; // Your top navbar component
import TherapistSideBar from "./TherapistSideBar";

const TherapistLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle sidebar (mobile)
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  // Close sidebar on navigation (mobile)
  const handleSidebarClose = () => {
    if (isSidebarOpen) setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-[#f3f3ec]">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <TherapistSideBar
        isOpen={isSidebarOpen}
        setActiveItemId={handleSidebarClose}
      />

      {/* Main content area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "ml-64 md:ml-64" : "ml-0 md:ml-64"
        }`}
      >
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Page content */}
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TherapistLayout;
