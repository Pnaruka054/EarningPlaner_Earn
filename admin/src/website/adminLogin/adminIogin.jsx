import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // ✅ Success message state

  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/admin/adminLogin`, {
        userName,
        password,
      }, {
        withCredentials: true // This ensures cookies are sent with the request
      });

      console.log("Login Successful:", response.data);
      setSuccess("Login Successful! Redirecting..."); // ✅ Success message show karo

      setTimeout(() => {
        navigate("/admin/dashboard"); // ✅ 3 sec baad redirect hoga
      }, 3000);

    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Login Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Admin Login
        </h2>

        {/* ✅ Success Message */}
        {success && <p className="text-green-600 text-sm text-center mb-4">{success}</p>}

        {/* ❌ Error Message */}
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-600 font-medium">Username</label>
          <div className="flex items-center border rounded-lg p-2 mt-1">
            <FaUser className="text-gray-500 mx-2" />
            <input
              type="text"
              placeholder="Enter Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
