import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Admin Login
        </h2>
        
        <div className="mb-4">
          <label className="block text-gray-600 font-medium">Username</label>
          <div className="flex items-center border rounded-lg p-2 mt-1">
            <FaUser className="text-gray-500 mx-2" />
            <input
              type="text"
              placeholder="Enter Username"
              className="w-full outline-none border-none text-gray-700"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 font-medium">Password</label>
          <div className="flex items-center border rounded-lg p-2 mt-1">
            <FaLock className="text-gray-500 mx-2" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              className="w-full outline-none border-none text-gray-700"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 focus:outline-none"
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </div>

        <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
          Login
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Forgot Password? <a href="#" className="text-blue-600">Click here</a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
