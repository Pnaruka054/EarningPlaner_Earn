import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProcessBgBlack from '../../components/processBgBlack/processBgBlack';
import axios from 'axios';
import Swal from 'sweetalert2';
import showNotification from '../../components/showNotification'
import { useGoogleLogin } from "@react-oauth/google";
import formatTime from '../../components/formatTime'

const Login = () => {
    const [email_userName_state, setEmail_userName_state] = useState('');
    const [password_state, setPassword_state] = useState('');
    const [loginRemember_state, setLoginRemember_state] = useState(false);
    const [error_state, setError_state] = useState([]);
    let [submit_process_state, setSubmit_process_state] = useState(false);
    const navigation = useNavigate();

    let dataBase_post_login = async (obj) => {
        try {
            let response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/userRoute/login`, obj, {
                withCredentials: true // This ensures cookies are sent with the request
            })
            setError_state([])
            if (response) {
                showNotification(false, 'Login Success!')
                navigation('/member/dashboard')
            }
        } catch (error) {
            console.error(error);
            if (error?.response?.data?.error_msg) {
                showNotification(true, error?.response?.data?.error_msg)
            } else {
                showNotification(true, "Something went wrong, please try again.");
            }
        } finally {
            setSubmit_process_state(false);
        }
    }

    const handleLogin_submit = (e) => {
        e.preventDefault();
        const obj = {
            email_userName: email_userName_state,
            password: password_state,
            loginRemember_state,
        };
        dataBase_post_login(obj)
        setSubmit_process_state(true)
    };

    const responseGoogle = async (authResult) => {
        try {
            if (authResult["code"]) {
                let response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/userRoute/user_signUp_login_google?google_code=${authResult.code}&referral_id_signup=undefined`, {
                    withCredentials: true // This ensures cookies are sent with the request
                });
                if (response) {
                    showNotification(false, 'success!')
                    navigation('/member/dashboard')
                }
            } else {
                throw new Error(authResult);
            }
        } catch (error) {
            console.log(error);
            if (error?.response?.data?.error_msg) {
                showNotification(true, error?.response?.data?.error_msg);
            } else {
                showNotification(true, "Something went wrong, please try again.");
            }
        } finally {
            setSubmit_process_state(false);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: responseGoogle,
        flow: "auth-code",
    });

    const handleGoogleLogin = async (e) => {
        e.preventDefault();
        googleLogin();
        setSubmit_process_state(true)
    };

    // forgot password handle
    const handleForgotPassword = () => {
        Swal.fire({
            title: "Forgot Password",
            input: "email",
            inputLabel: "Enter your email",
            inputPlaceholder: "Enter your email address",
            showCancelButton: true,
            confirmButtonText: "Send Reset Link",
            preConfirm: (email) => {
                if (!email) {
                    Swal.showValidationMessage("Email is required!");
                }
                return fetch(`${import.meta.env.VITE_SERVER_URL}/userRoute/userLoginforgot_password_send_mail`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (!data?.success) {
                            let timeLeftMs = data?.time_left || 0;

                            // Show Swal alert with countdown
                            return new Promise((resolve, reject) => {
                                Swal.fire({
                                    title: "Error",
                                    html: `<strong>${data?.error_msg}</strong><br>
                                           <p>Try again after <span id="countdown">${formatTime(timeLeftMs)}</span></p>`,
                                    icon: "error",
                                    timer: timeLeftMs,
                                    showConfirmButton: false,
                                    didOpen: () => {
                                        const countdownEl = document.getElementById("countdown");

                                        let interval = setInterval(() => {
                                            timeLeftMs -= 1000;
                                            countdownEl.innerText = formatTime(timeLeftMs);

                                            if (timeLeftMs <= 0) {
                                                clearInterval(interval);
                                                Swal.close();
                                                resolve(); // Resolve promise after countdown
                                            }
                                        }, 1000);
                                    }
                                });
                            });
                        }
                        return data;
                    })
                    .catch((error) => {
                        console.log(error);
                        Swal.showValidationMessage(`Request failed: ${error.message}`);
                    });
            },
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("Success!", "Password reset link sent successfully.", "success");
            }
        });
    };

    return (
        <div className='flex h-[90vh] items-center justify-center'>
            <div className='md:w-[45%] sm:w-[90%] w-[97%]'>
                <h1 className='text-3xl font-medium text-center mb-5 select-none'>Login</h1>
                <form onSubmit={handleLogin_submit}>
                    <input
                        type="text"
                        value={email_userName_state}
                        onChange={(e) => setEmail_userName_state(e.target.value)}
                        placeholder='Enter your email or username'
                        required
                        className='w-full rounded outline-none border-2 px-2 py-1 inline-block mb-2 focus:border-blue-400'
                    />

                    <input
                        type="password"
                        value={password_state}
                        onChange={(e) => setPassword_state(e.target.value)}
                        placeholder='Enter your password'
                        required
                        className='w-full rounded outline-none border-2 px-2 py-1 inline-block mb-2 focus:border-blue-400'
                    />

                    <div className='mb-2 space-x-2'>
                        <input
                            type="checkbox"
                            id="loginRememberCheck"
                            checked={loginRemember_state}
                            onChange={(e) => setLoginRemember_state(e.target.checked)}
                            className='size-3'
                        />
                        <label className='select-none cursor-pointer' htmlFor="loginRememberCheck">Remember Me</label>
                    </div>

                    <button type="submit" disabled={submit_process_state} className={`${submit_process_state ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"} w-full text-white rounded py-1 mb-2 transition`}>
                        {!submit_process_state ? "Login" : <i className="fa-solid fa-spinner fa-spin"></i>}
                    </button>
                </form>
                <button onClick={handleGoogleLogin} className='w-full mb-2 bg-transparent hover:bg-black transition hover:text-white py-1 rounded border-2 border-black flex items-center justify-center space-x-2'>
                    <ion-icon name="logo-google"></ion-icon> <span>Login With Google</span>
                </button>
                <p onClick={handleForgotPassword} className='text-blue-600 underline cursor-pointer'>I Forgot My Password</p>
                <p className='mt-2 select-none'>
                    Don’t have an account? <Link to="/signup" className='text-blue-600 underline' >Register a New Account</Link>
                </p>
            </div>
            {submit_process_state && <ProcessBgBlack />}
            {error_state.length > 0 && error_state.map((value, index) => (
                <Error key={index} color="yellow" text={value} />
            ))}
        </div>
    );
}

export default Login;
