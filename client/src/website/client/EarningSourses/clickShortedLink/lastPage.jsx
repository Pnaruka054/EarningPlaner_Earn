import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LastPage = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const referrer = document.referrer; // User kaha se aaya hai?
        console.log(referrer);
        if (!referrer) {
            // Agar direct aaya hai to error message show karo
            setErrorMessage("Error: You cannot access this page directly!");
        } else {
            // Agar kisi URL se aaya hai, to uss URL ko server par patch request bhejo
            axios.patch(`${import.meta.env.VITE_SERVER_URL}/userIncomeRoute/user_shortlink_lastPage_data_patch`, { referrerUrl: referrer }, { withCredentials: true })
                .then(() => {
                    // Browser history remove karke back button ko disable karo
                    window.history.pushState(null, null, window.location.href);
                    window.addEventListener("popstate", () => {
                        window.history.pushState(null, null, window.location.href);
                    });
                })
                .catch((error) => {
                    console.error("Error in sending patch request:", error);
                    setErrorMessage("Error: Something went wrong while tracking!");
                });
        }
    }, []);

    return (
        <div>
            {errorMessage ? (
                <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>
            ) : (
                <p>Welcome to the last page!</p>
            )}
        </div>
    );
};

export default LastPage;
