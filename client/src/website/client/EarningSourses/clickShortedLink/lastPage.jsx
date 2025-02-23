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
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    window.history.replaceState(null, "", location.pathname);

    if (!uniqueToken) {
      showSwal("error", "Invalid Request", "Unique token is missing.");
      navigateAndClearHistory("/member/click-shorten-link");
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          sendRequest();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [uniqueToken, navigate]);

  const sendRequest = () => {
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
          showSwal("success", "Earnings Added!", `₹${amountEarned} successfully added!`);
        } else {
          setIcon("⚠️");
          setMessage(response.data.message || "Something went wrong!");
          showSwal("warning", "Error!", response.data.message || "Something went wrong!");
        }
      })
      .catch((error) => {
        setLoading(false);
        setIcon("🚨");
        setMessage("Request failed. Please try again.");
        console.error("Error in sending patch request:", error);
        showSwal("error", "Request Failed", "Please try again.");
      })
      .finally(() => {
        // ✅ ✅ ✅ **Navigate and Clear History**
        setTimeout(() => {
          navigateAndClearHistory("/member/click-shorten-link");
        }, 3000);
      });
  };

  const showSwal = (icon, title, text) => {
    Swal.fire({
      icon,
      title,
      text,
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      customClass: { popup: "swal-auto-position" },
    });
  };

  const navigateAndClearHistory = (path) => {
    window.location.replace(path); // ✅ Direct replace, no history
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-gray-200 p-6">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full text-center">
        {loading ? (
          <div className="flex flex-col items-center">
            <p className="text-3xl font-bold text-blue-600">{countdown}</p>
            <p className="mt-2 text-gray-700 text-lg font-semibold">Please wait...</p>
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
