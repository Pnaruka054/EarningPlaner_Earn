import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, LayoutDashboard, Users, Settings, LogOut } from "lucide-react";

const SideMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 p-5 bg-gray-900 bg-opacity-80 backdrop-blur-lg shadow-lg border-r border-gray-700 transform ${
          isOpen ? "translate-x-0" : "-translate-x-64"
        } transition-transform duration-300 md:translate-x-0`}
      >
        {/* Close Button (Mobile) */}
        <button
          className="md:hidden absolute top-4 right-4 text-gray-300 hover:text-white transition"
          onClick={() => setIsOpen(false)}
        >
          <X size={24} />
        </button>

        {/* Sidebar Header */}
        <div className="text-2xl font-semibold text-white flex items-center mb-6">
          <LayoutDashboard className="mr-3 text-blue-400" /> Admin Panel
        </div>

        {/* Menu Items */}
        <nav className="space-y-2">
          <NavItem to="/admin/dashboard" icon={<LayoutDashboard />} label="Dashboard" />
          <NavItem to="/admin/users" icon={<Users />} label="Users" />
          <NavItem to="/admin/settings" icon={<Settings />} label="Settings" />
          <button className="sidebar-item text-red-400 hover:bg-red-500/20 hover:text-red-300 mt-10 transition duration-200 px-4 py-2 rounded-md flex items-center w-full">
            <LogOut className="mr-2" /> Logout
          </button>
        </nav>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 bg-gray-900 text-white p-2 rounded-full shadow-lg hover:bg-gray-800 transition"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={24} />
      </button>
    </div>
  );
};

/* Reusable NavItem Component */
const NavItem = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center text-gray-300 hover:text-white hover:bg-blue-500/20 transition duration-200 px-4 py-2 rounded-md"
  >
    <span className="mr-3 text-blue-400">{icon}</span> {label}
  </Link>
);

export default SideMenu;
