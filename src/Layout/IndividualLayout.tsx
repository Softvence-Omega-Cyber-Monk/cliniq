
import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutGrid, Users, BarChart, Settings, HelpCircle, Zap, Bell, Menu, Calendar, CreditCard, Book } from 'lucide-react';

interface NavItem {
  id: number;
  label: string;
  icon: React.ElementType;
  href: string;
}

const navItems: NavItem[] = [
  { id: 1, label: 'Dashboard', icon: LayoutGrid, href: '/private-practice-admin' },
  { id: 2, label: 'Therapists', icon: Users, href: '/private-practice-admin/therapists' },
  { id: 3, label: 'Appointments', icon: Calendar, href: '/private-practice-admin/appointments' },
  { id: 8, label: 'Clients', icon: Users, href: '/private-practice-admin/clients' },
  { id: 9, label: 'Reports', icon: BarChart, href: '/private-practice-admin/reportstwo' },
  { id: 10, label: 'Billing', icon: CreditCard, href: '/private-practice-admin/billing' },
  { id: 11, label: 'Materials', icon: Book, href: '/private-practice-admin/materials' },
  { id: 6, label: 'Settings', icon: Settings, href: '/private-practice-admin/settings' },
  { id: 7, label: 'Support', icon: HelpCircle, href: '/private-practice-admin/support' },
];

interface SidebarLinkProps {
  item: NavItem;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ item }) => {
  const Icon = item.icon;
  const location = useLocation();

  // Special handling for Dashboard - only active when exactly on '/private-practice-admin'
  const isDashboard = item.href === '/private-practice-admin';
  const isActive = isDashboard 
    ? location.pathname === '/private-practice-admin'
    : location.pathname.startsWith(item.href);

  return (
    <NavLink
      to={item.href}
      className={`
        flex items-center space-x-3 p-3 rounded-xl transition-colors duration-200
        ${isActive
          ? 'bg-sky-500 text-white shadow-lg'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }
      `}
    >
      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
      <span className="font-medium text-sm">{item.label}</span>
    </NavLink>
  );
};

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const avatarUrl = "https://placehold.co/40x40/fbcfe8/be185d?text=Dr"; 

  return (
    <header className="
      sticky top-0 z-10
      bg-white
      border-b border-gray-200
      p-4 md:py-6 md:px-8
      shadow-sm
    ">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome
          </h1>
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
                target.style.display = 'none';
              }}
            />
            <div 
              className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs bg-pink-400"
              style={{ display: 'none' }} 
            >
              DR
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

const IndividualLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const sidebarClasses = `
    fixed left-0 top-0 h-full
    w-64 z-20
    bg-white border-r border-gray-200
    p-4 flex flex-col
    transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0
  `;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Individual Sidebar */}
      <aside className={sidebarClasses}>
        {/* Logo/Header Section */}
        <div className="flex items-center px-2 py-4 mb-8">
          <Zap className="h-6 w-6 text-sky-500 mr-2" />
          <span className="text-xl font-bold text-gray-800">
            Private Practice Admin
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <SidebarLink
              key={item.id}
              item={item}
            />
          ))}
        </nav>
      </aside>

      <div className="flex flex-col flex-1 md:ml-64">
        {/* Individual Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default IndividualLayout;