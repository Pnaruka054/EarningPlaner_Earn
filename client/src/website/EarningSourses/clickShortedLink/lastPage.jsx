import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import earningSound from '../../components/earningSound';
import { getItemWithExpiry } from '../../components/handle_localStorage';
import ProcessBgBlack from "../../components/processBgBlack/processBgBlack";
import { Helmet } from "react-helmet";

const LastPage = () => {
  const { uniqueToken } = useParams();
  const navigate = useNavigate();
  const [loading_state, setLoading_state] = useState(true);
  const [message_state, setMessage_state] = useState("Now Claim Your Income Fast");
  const [icon_state, setIcon_state] = useState(null);
  const [amount_state, setAmount_state] = useState(null);
  const [countdown_state, setCountdown_state] = useState(10);
  const [isSoundPlay_state, setIsSoundPlay_state] = useState(true);
  const [showButton_state, setShowButton_state] = useState(false);
  const [adBlockDetected_state, setAdBlockDetected_state] = useState(false);
  const [data_process_state, setData_process_state] = useState(false);
  const [vpn_detected_state, setVpn_detected_state] = useState(false);

  // Countdown timer useEffect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown_state((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          setShowButton_state(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check for uniqueToken and clear history
  useEffect(() => {
    window.history.replaceState(null, "", location.pathname);
    if (!uniqueToken) {
      showSwal_state("error", "Invalid Request", "Unique token is missing.");
      navigateAndClearHistory_state("/member/click-shorten-link");
      return;
    }
  }, [uniqueToken, navigate]);

  // Set loading_state to false when countdown ends
  useEffect(() => {
    if (countdown_state === 0) {
      setLoading_state(false);
    }
  }, [countdown_state]);

  // Function to show Swal alerts
  const showSwal_state = (icon, title, text) => {
    Swal.fire({
      icon,
      title,
      text,
      position: "top-end", // Options: "top", "bottom", "center"
      showConfirmButton: false,
      timer: 3000, // Auto close after 3 sec
      allowOutsideClick: true,
      allowEscapeKey: true,
      background: "#fff",
      toast: true,
    });
  };

  // Function to navigate and clear browser history
  const navigateAndClearHistory_state = (path) => {
    window.history.replaceState(null, "", location.pathname);
    navigate(path);
  };

  // Send request and process response
  const sendRequest_state = () => {
    setMessage_state("Processing your request...");
    setShowButton_state(false);
    setData_process_state(true)
    axios
      .patch(
        `${import.meta.env.VITE_SERVER_URL}/userIncomeRoute/user_shortlink_lastPage_data_patch`,
        { uniqueToken },
        { withCredentials: true }
      )
      .then((response) => {
        if (response.data && response.data.message) {
          const amountEarned = response.data.amount || "0";
          setAmount_state(amountEarned);
          setIcon_state("🎉");
          setMessage_state(`You have earned ₹${amountEarned}!`);
          if (isSoundPlay_state) earningSound(true, true);
          showSwal_state("success", "Earnings Added!", `₹${amountEarned} successfully added!`);
        } else {
          if (isSoundPlay_state) earningSound(true, false);
          setIcon_state("⚠️");
          setMessage_state(response.data.message || "Something went wrong!");
          showSwal_state("warning", "Error!", response.data.message || "Something went wrong!");
        }
      })
      .catch((error) => {
        console.error("Error in sending patch request:", error);
        if (isSoundPlay_state) earningSound(true, false);
        setIcon_state("🚨");
        setMessage_state("Request failed. Please try again.");
        showSwal_state("error", "Request Failed", "Please try again.");
      })
      .finally(() => {
        setData_process_state(false)
        setTimeout(() => {
          window.history.replaceState(null, "", location.pathname);
          window.location.replace("/member/click-shorten-link");
        }, 3000);
      });
  };

  // Determine sound state from localStorage
  useEffect(() => {
    const vpnChecker = async () => {
      setData_process_state(true)
      try {
        let response = await axios.get("https://bitcotasks.com/promote/41234")
        if (response.data.trim() === "Proxy Detected!") {
          setVpn_detected_state(true)
        }
      } catch (error) {
        console.error(response)
      } finally {
        setData_process_state(false)
      }
    }
    vpnChecker()
    const soundStart = getItemWithExpiry("sound");
    if (soundStart) {
      setIsSoundPlay_state(false);
    } else {
      setIsSoundPlay_state(true);
    }
  }, []);

  // Load external ad scripts and detect ad blockers
  useEffect(() => {
    const scripts = [
      { src: "https://kulroakonsu.net/88/tag.min.js", attributes: { 'data-zone': '140468', 'data-cfasync': 'false' } },
      { src: "https://js.onclckmn.com/static/onclicka.js", attributes: { 'data-admpid': '287247' } },
      { src: "https://js.wpadmngr.com/static/adManager.js", attributes: { 'data-admpid': '287339' } }
    ];

    let loadedScripts = 0;
    const scriptElements = scripts.map(({ src, attributes }) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      Object.entries(attributes).forEach(([key, value]) => {
        script.setAttribute(key, value);
      });

      // If script loads successfully
      script.onload = () => {
        loadedScripts++;
      };

      // If script fails to load (likely blocked by an ad blocker)
      script.onerror = () => {
        setAdBlockDetected_state(true);
      };

      document.body.appendChild(script);
      return script;
    });

    return () => {
      scriptElements.forEach(script => {
        document.body.removeChild(script);
      });
    };
  }, []);
  // Load external ad scripts for hilltop ads.
  useEffect(() => {
    const scriptContainer = document.getElementById("script-container");

    // Pehli Script
    const script1 = document.createElement("script");
    script1.src = "\/\/shady-ride.com\/bNXOVXs.doGwlj0aY\/WvdtiLYdWw5kunZ\/XrII\/ZeEmJ9\/urZFULlJkyPSTQYpxeNyzGcMxhMhDng-t\/Nej\/EU3JNkz\/ElwjOfQT";
    script1.async = true;
    script1.referrerPolicy = "no-referrer-when-downgrade";

    // Dusri Script
    const script2 = document.createElement("script");
    script2.src = "\/\/bechipivy.com\/c\/D\/9s6lb.2Z5\/l\/SQW-Qo9GNSjAEC3\/NqzsEUyuMaCQ0Y2jMeT\/c_3xMqTCIfxx";
    script2.async = true;
    script2.referrerPolicy = "no-referrer-when-downgrade";

    // Scripts ko add karna
    scriptContainer.appendChild(script1);
    scriptContainer.appendChild(script2);

    return () => {
      // Cleanup: Scripts remove karna
      scriptContainer.removeChild(script1);
      scriptContainer.removeChild(script2);
    };
  }, []);

  // If ad blocker is detected, render an error page
  if (adBlockDetected_state) {
    return (
      <>
        <Helmet>
          <title>Ad Blocker Detected</title>
        </Helmet>
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
            <AlertTriangle className="text-red-600 w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-red-600 mb-2">Ad Blocker Detected</h2>
            <p className="text-lg text-gray-700">
              It appears that you are using an ad blocker. Please disable your ad blocker to continue your earnings.
            </p>
          </div>
        </div>
      </>
    );
  }

  if (vpn_detected_state) {
    useEffect(() => {
      let timeoutId = setTimeout(() => {
        window.history.replaceState(null, "", location.pathname);
        window.location.replace("/member/click-shorten-link");
      }, 3000);

      return () => {
        clearTimeout(timeoutId);  // ✅ Correct way to clear timeout
      };
    }, []);

    return (
      <>
        <Helmet>
          <title>Proxy Detected</title>
        </Helmet>
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
            <AlertTriangle className="text-red-600 w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-red-600 mb-2">Proxy Detected</h2>
            <p className="text-lg text-gray-700">
              We have detected that you are using a Proxy. Please disable your Proxy to continue your earnings.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-gray-200 p-6">
      <div className='mb-5' id="script-container"></div>
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full text-center">
        {loading_state ? (
          <div className="flex flex-col items-center">
            <p className="text-3xl font-bold text-blue-600">{countdown_state}</p>
            <p className="mt-2 text-gray-700 text-lg font-semibold">Please wait...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-4xl">{icon_state}</p>
            {!amount_state && <p className="mt-4 text-red-600 text-lg font-medium">{message_state}</p>}
            {amount_state && (
              <p className="mt-2 text-green-600 text-xl font-bold">
                ₹{amount_state} Added! in Your Wallet
              </p>
            )}
          </div>
        )}

        {showButton_state && (
          <button
            className="mt-6 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
            onClick={sendRequest_state}
          >
            Claim Your Earnings
          </button>
        )}
      </div>
      {data_process_state && <ProcessBgBlack />}
    </div>
  );
};

export default LastPage;
