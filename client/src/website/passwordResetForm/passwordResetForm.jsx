import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ProcessBgBlack from "../components/processBgBlack/processBgBlack";
import showNotificationWith_timer from '../components/showNotificationWith_timer'
import showNotification from '../components/showNotification'
import { Helmet } from 'react-helmet';
import { encryptData } from '../components/encrypt_decrypt_data'

const PasswordResetForm = () => {
    const [password_state, setPassword_state] = useState("");
    const [confirmPassword_state, setConfirmPassword_state] = useState("");
    const [submit_process_state, setSubmit_process_state] = useState(false);
    const [data_process_state, setData_process_state] = useState(false);
    const [isTokenValid, setIsTokenValid] = useState(false); // State to check token validity
    let { token } = useParams();
    const navigation = useNavigate();

    // Token verification on page load
    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_SERVER_URL}/userRoute/verify_reset_token?token=${token}`,
                    {
                        method: "GET",
                    }
                );

                const data = await response.json(); // ✅ Ab safe hai JSON parse karna    
                if (data.success) {
                    setIsTokenValid(true);
                    showNotificationWith_timer(false, data.msg, '', navigation);
                } else {
                    showNotificationWith_timer(true, data.error_msg, '/login', navigation);
                }
            } catch (error) {
                console.error("Token Verification Error:", error.message); // ✅ Debug ke liye
                showNotification(true, 'Token Verification Failed!')
                navigation("/login");
            }
        };

        verifyToken();
    }, [token, navigation]);

    const handlePasswordUpdate_submit = async (e) => {
        e.preventDefault();
        setSubmit_process_state(true);

        // 🛑 Password Matching Validation
        if (password_state !== confirmPassword_state) {
            showNotification(true, 'Passwords do not match. Please enter the same password in both fields.')
            setSubmit_process_state(false);
            return;
        }

        try {
            let obj = await encryptData({
                password: password_state,
                token
            })
            const response = await fetch(
                `${import.meta.env.VITE_SERVER_URL}/userRoute/reset_password_form_post`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ obj }),
                }
            );

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || "Password reset failed.");
            } else if (data.error_msg) {
                showNotificationWith_timer(true, data.error_msg, '', navigation);
            } else if (data.success) {
                showNotificationWith_timer(false, data.msg, '/', navigation);
            }

        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: err.message || "Something went wrong.",
                toast: true,
                position: "top-right",
                timer: 4000,
                timerProgressBar: true, // ⏳ Progress bar added
                showConfirmButton: false,
            });
        } finally {
            setSubmit_process_state(false);
        }
    };

    // If token is not valid, do not render the form
    if (!isTokenValid) {
        return <div>Redirecting to login...</div>;
    }

    return (
        <>
            <Helmet>
                <title>EarnWiz - Password Reset Form</title>
                <meta name="description" content="Reset your EarnWiz password quickly and securely. Enter your email to receive a reset link and update your credentials for uninterrupted access." />
            </Helmet>
            <div className="flex h-[90vh] items-center justify-center">
                <div className="md:w-[45%] sm:w-[90%] w-[97%]">
                    <h1 className="text-3xl font-medium text-center mb-5 select-none">
                        Reset Password
                    </h1>
                    <form onSubmit={handlePasswordUpdate_submit}>
                        <input
                            type="password"
                            value={password_state}
                            onChange={(e) => setPassword_state(e.target.value)}
                            placeholder="Enter new password"
                            required
                            className="w-full rounded outline-none border-2 px-2 py-1 inline-block mb-2 focus:border-blue-400"
                        />
                        <input
                            type="password"
                            value={confirmPassword_state}
                            onChange={(e) => setConfirmPassword_state(e.target.value)}
                            placeholder="Confirm new password"
                            required
                            className="w-full rounded outline-none border-2 px-2 py-1 inline-block mb-2 focus:border-blue-400"
                        />
                        <button
                            type="submit"
                            disabled={submit_process_state}
                            className={`${submit_process_state ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
                                } w-full text-white rounded py-1 mb-2 transition`}
                        >
                            {!submit_process_state ? "Reset Password" : <i className="fa-solid fa-spinner fa-spin"></i>}
                        </button>
                    </form>
                    <Link to="/login" className="text-blue-600 underline">
                        I Remember My Password
                    </Link>
                </div>
                {(submit_process_state || data_process_state) && <ProcessBgBlack />}
            </div>
        </>
    );
};

export default PasswordResetForm;
