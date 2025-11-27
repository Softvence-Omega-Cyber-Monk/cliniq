import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useState, useCallback } from "react";

const Layout: React.FC = () => {
  const mainContentOffset = "md:ml-64";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const setActiveItemAndClose = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f3ec]">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar setActiveItemId={setActiveItemAndClose} isOpen={isSidebarOpen} />

      <div
        className={`flex flex-col min-h-screen ${mainContentOffset} transition-all duration-300`}
      >
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-1  ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
