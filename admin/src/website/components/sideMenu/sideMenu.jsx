import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, LayoutDashboard, PlayCircle, Link as LinkIcon, FileText, DollarSign, LogOut } from "lucide-react";
import EarnWizLogo from '../../../assets/EarnWizLogo.png';

const SideMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full ${isOpen ? "w-full" : "w-64"
          } md:w-64 p-5 bg-gray-900 backdrop-blur-lg shadow-lg border-r border-gray-700 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 md:translate-x-0 z-50`}
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
          <NavItem to="/admin/view-ads" icon={<PlayCircle />} label="View Ads" />
          <NavItem to="/admin/shorten-links" icon={<LinkIcon />} label="Shorten Links" />
          <NavItem to="/admin/surveys" icon={<FileText />} label="Surveys" />
          <NavItem to="/admin/withdrawals" icon={<DollarSign />} label="Withdrawals" />

          {/* Logout Button */}
          <button className="sidebar-item text-red-400 hover:bg-red-500/20 hover:text-red-300 mt-10 transition duration-200 px-4 py-2 rounded-md flex items-center w-full">
            <LogOut className="mr-2" /> Logout
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64">
        {/* Header */}
        <div className="fixed top-0 left-0 md:left-64 w-full md:w-[calc(100%-16rem)] bg-gray-900 text-white shadow-md flex items-center justify-between px-6 py-4 z-40">
          {/* Left Side - Menu Toggle Button (Mobile Only) */}
          <button
            className={`md:hidden text-white p-2 rounded-full hover:bg-gray-800 transition ${isOpen ? "hidden" : "block"}`}
            onClick={() => setIsOpen(true)}
          >
            <Menu size={24} />
          </button>
          {/* Center on Desktop, Right on Mobile - Website Logo */}
          <div className="flex-1 flex justify-center md:justify-center sm:justify-end">
            <img src={EarnWizLogo} alt="Website Logo" className="h-10 w-auto" />
          </div>
        </div>
      </div>
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
