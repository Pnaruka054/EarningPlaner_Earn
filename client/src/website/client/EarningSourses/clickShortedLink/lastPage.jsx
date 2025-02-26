import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import earningSound from '../../components/earningSound'
import { getItemWithExpiry } from '../../components/handle_localStorage'

const LastPage = () => {
  const { uniqueToken } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Now Claim Your Income Fast");
  const [icon, setIcon] = useState(null);
  const [amount, setAmount] = useState(null);
  const [countdown, setCountdown] = useState(10);
  const [isSoundPlay_state, setIsSoundPlay_state] = useState(true);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          setShowButton(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    window.history.replaceState(null, "", location.pathname);
    if (!uniqueToken) {
      showSwal("error", "Invalid Request", "Unique token is missing.");
      navigateAndClearHistory("/member/click-shorten-link");
      return;
    }
  }, [uniqueToken, navigate]);

  useEffect(() => {
    if (countdown === 0) {
      setLoading(false)
    }
  }, [countdown]);

  const showSwal = (icon, title, text) => {
    Swal.fire({
      icon,
      title,
      text,
      position: "top-end", // 🟢 Yaha position set kar sakte ho: "top", "bottom", "center"
      showConfirmButton: false,
      timer: 3000, // 3 sec ke baad Swal khud close ho jayega
      allowOutsideClick: true, // 🟢 Click karne se Swal band ho jayega
      allowEscapeKey: true, // 🟢 Escape key press karne se Swal band ho jayega
      background: "#fff", // 🟢 Light mode ke liye
      toast: true, // 🟢 Chhoti alert box banane ke liye
    });
  };

  const sendRequest = () => {
    setMessage("Processing your request...")
    setShowButton(false);
    axios
      .patch(
        `${import.meta.env.VITE_SERVER_URL}/userIncomeRoute/user_shortlink_lastPage_data_patch`,
        { uniqueToken },
        { withCredentials: true }
      )
      .then((response) => {
        if (response.data && response.data.message) {
          const amountEarned = response.data.amount || "0";
          setAmount(amountEarned);
          setIcon("🎉");
          setMessage(`You have earned ₹${amountEarned}!`);
          if (isSoundPlay_state) earningSound(true, true);

          // ✅ Swal success alert
          showSwal("success", "Earnings Added!", `₹${amountEarned} successfully added!`);
        } else {
          if (isSoundPlay_state) earningSound(true, false);
          setIcon("⚠️");
          setMessage(response.data.message || "Something went wrong!");

          // ✅ Swal warning alert
          showSwal("warning", "Error!", response.data.message || "Something went wrong!");
        }
      })
      .catch((error) => {
        console.error("Error in sending patch request:", error);
        if (isSoundPlay_state) earningSound(true, false);
        setIcon("🚨");
        setMessage("Request failed. Please try again.");

        // ✅ Swal error alert
        showSwal("error", "Request Failed", "Please try again.");
      }).finally(() => {
        // ✅ ✅ ✅ **Navigate and Clear History**
        setTimeout(() => {
          window.history.replaceState(null, "", location.pathname)
          window.location.replace("/member/click-shorten-link");
        }, 3000);
      });
  };

  useEffect(() => {
    const soundStart = getItemWithExpiry("sound");
    if (soundStart) {
      setIsSoundPlay_state(false)
    } else if (!soundStart) {
      setIsSoundPlay_state(true)
    }
  }, []);

  // for ads
  useEffect(() => {
    const scripts = [
        { src: "https://kulroakonsu.net/88/tag.min.js", attributes: { 'data-zone': '132939', 'data-cfasync': 'false' } },
        { src: "https://js.onclckmn.com/static/onclicka.js", attributes: { 'data-admpid': '287247' } },
        { src: "https://js.wpadmngr.com/static/adManager.js", attributes: { 'data-admpid': '287339' } }
    ];

    const scriptElements = scripts.map(({ src, attributes }) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;

        // Additional attributes set karna
        Object.entries(attributes).forEach(([key, value]) => {
            script.setAttribute(key, value);
        });

        document.body.appendChild(script);
        return script;
    });

    // Cleanup function to remove all scripts on unmount
    return () => {
        scriptElements.forEach(script => document.body.removeChild(script));
    };
}, []);

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
            {!amount && <p className="mt-4 text-red-600 text-lg font-medium">{message}</p>}
            {amount && (
              <p className="mt-2 text-green-600 text-xl font-bold">
                ₹{amount} Added! in Your Wallet
              </p>
            )}
          </div>
        )}

        {showButton && (
          <button
            className="mt-6 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
            onClick={sendRequest}
          >
            Claim Your Earnings
          </button>
        )}
      </div>
    </div>
  );
};

export default LastPage;
