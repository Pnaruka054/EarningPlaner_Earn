import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const LastPage = () => {
  const { uniqueToken } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Processing your request...");
  const [icon, setIcon] = useState(null);
  const [amount, setAmount] = useState(null);

  useEffect(() => {
    // 🛑 User ka back history clear karna
    window.history.replaceState(null, "", location.pathname);

    if (!uniqueToken) {
      Swal.fire({
        icon: "error",
        title: "Invalid Request",
        text: "Unique token is missing.",
      });
      navigate("/");
      return;
    }

    axios
      .patch(
        `${import.meta.env.VITE_SERVER_URL}/userIncomeRoute/user_shortlink_lastPage_data_patch`,
        { uniqueToken },
        { withCredentials: true }
      )
      .then((response) => {
        setLoading(false);
        if (response.data && response.data.message) {
          const amountEarned = response.data.amount || "0";
          setAmount(amountEarned);
          setIcon("🎉");
          setMessage(`You have earned ₹${amountEarned}!`);
          setTimeout(() => {
            window.history.replaceState(null, "", "/member/click-shorten-link");
            navigate("/member/click-shorten-link");
          }, 3000);
        } else {
          setIcon("⚠️");
          setMessage(response.data.message || "Something went wrong!");
        }
      })
      .catch((error) => {
        setLoading(false);
        setIcon("🚨");
        setMessage("Request failed. Please try again.");
        console.error("Error in sending patch request:", error);
      });
  }, [uniqueToken, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-gray-200 p-6">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full text-center">
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-600 border-opacity-75"></div>
            <p className="mt-4 text-gray-700 text-lg font-semibold">{message}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-4xl">{icon}</p>
            <p className="mt-4 text-gray-800 text-lg font-medium">{message}</p>
            {amount && (
              <p className="mt-2 text-green-600 text-xl font-bold">
                ₹{amount} Added!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LastPage;
