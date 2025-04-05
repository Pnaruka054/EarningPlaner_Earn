import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LayoutDashboard, PlayCircle, Link as LinkIcon, FileText, DollarSign, LogOut, ShieldCheck, FileWarning, FileLock } from "lucide-react";
import EarnWizLogo from '../../../assets/EarnWizLogo.png';
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2';
import axios from 'axios';
import ProcessBgBlack from "../processBgBlack/processBgBlack";
import showNotification from "../showNotification";
import { Users } from "lucide-react";

const SideMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  let [data_process_state, setData_process_state] = useState(false);
  const navigation = useNavigate();

  const logOut = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to log out?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Logout!",
      });

      if (!result.isConfirmed) return;

      setData_process_state(true);

      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/admin/adminLogout`,
        { withCredentials: true }
      );

      if (response?.data?.msg) {
        showNotification(false, response.data.msg);
        navigation('/')
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      if (error.response?.data?.error_msg) {
        showNotification(true, error.response.data.error_msg);
      } else if (error.response?.data?.adminJWT_error_msg) {
        showNotification(true, error.response.data.adminJWT_error_msg);
        navigation('/')
      } else {
        showNotification(true, "Something went wrong, please try again.");
      }
    } finally {
      setData_process_state(false);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full ${isOpen ? "w-full" : "w-64"} md:w-64 p-5 bg-gray-900 backdrop-blur-lg shadow-lg border-r border-gray-700 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 md:translate-x-0 z-50`}
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
          <NavItem to="/admin/ptc-ads" icon={<PlayCircle />} label="PTC Ads" />
          <NavItem to="/admin/shorten-links" icon={<LinkIcon />} label="Shorten Links" />
          <NavItem to="/admin/offer-walls" icon={<FileText />} label="OfferWall" />
          <NavItem to="/admin/withdrawals" icon={<DollarSign />} label="Withdrawals" />

          {/* Logout Button */}
          <button onClick={logOut} className="sidebar-item text-red-400 hover:bg-red-500/20 hover:text-red-300 mt-10 transition duration-200 px-4 py-2 rounded-md flex items-center w-full">
            <LogOut className="mr-2" /> Logout
          </button>
        </nav>

        {/* Privacy & Legal Links */}
        <div className="mt-10 border-t border-gray-700 pt-4 space-y-2 text-gray-400 text-sm">
          <NavItem to="/admin/privacy-policy" icon={<ShieldCheck />} label="Privacy Policy" />
          <NavItem to="/admin/terms-of-use" icon={<FileWarning />} label="Terms of Use" />
          <NavItem to="/admin/dmca" icon={<FileLock />} label="DMCA" />
        </div>
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
          {data_process_state && <ProcessBgBlack />}
        </div>
      </div>
    </div>
  );
};

/* Reusable NavItem Component */
const NavItem = ({ to, icon, label }) => {
  const location = useLocation(); // Get current route
  const isActive = location.pathname === to; // Check if route is active

  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-2 rounded-md transition duration-200 ${isActive ? "bg-blue-500 text-white" : "text-gray-300 hover:text-white hover:bg-blue-500/20"
        }`}
    >
      <span className={`mr-3 ${isActive ? "text-white" : "text-blue-400"}`}>{icon}</span> {label}
    </Link>
  );
};

export default SideMenu;
