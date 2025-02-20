import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const LastPage = () => {
  const { uniqueToken } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // ✅ Loader ke liye state

  useEffect(() => {
    if (!uniqueToken) {
      Swal.fire({
        icon: "error",
        title: "Invalid Request",
        text: "Unique token is missing.",
      });
      navigate("/"); // ✅ Invalid token ho to home par redirect karo
      return;
    }

    axios
      .patch(
        `${import.meta.env.VITE_SERVER_URL}/userIncomeRoute/user_shortlink_lastPage_data_patch`,
        { uniqueToken },
        { withCredentials: true }
      )
      .then((response) => {
        setLoading(false); // ✅ Request complete hone par loader hatao

        if (response.data && response.data.message) {
          const amountEarned = response.data.amount || "0"; // ✅ Amount received from backend

          Swal.fire({
            icon: "success",
            title: "Congratulations!",
            html: `<b>You have earned ₹${amountEarned}!</b>`, // ✅ Amount bold me dikhayega
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
          }).then(() => {
            window.history.replaceState(null, "", "/member/click-shorten-link");
            navigate("/member/click-shorten-link"); // ✅ Navigate after success
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed",
            text: response.data.message || "Something went wrong!",
          });
        }
      })
      .catch((error) => {
        setLoading(false); // ✅ Error aane par bhi loader hatao
        Swal.fire({
          icon: "error",
          title: "Request Failed",
          text: "Error in sending request. Please try again.",
        });
        console.error("Error in sending patch request:", error);
      });
  }, [uniqueToken, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {loading ? (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-75"></div>
          <p className="mt-4 text-gray-600 text-lg">Processing your request...</p>
        </div>
      ) : (
        <p className="text-gray-700 text-lg">Welcome to the last page!</p>
      )}
    </div>
  );
};

export default LastPage;
