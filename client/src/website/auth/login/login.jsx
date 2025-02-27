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
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigate();

    let dataBase_post_login = async (obj) => {
        try {
            let response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/userRoute/login`, obj, {
                withCredentials: true
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
                    withCredentials: true
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
                                                resolve();
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
        <div className='flex h-[92.5dvh] items-center justify-center bg-gray-100 overflow-auto custom-scrollbar'>
            <div className='md:w-[40%] sm:w-[80%] w-[90%] bg-white p-6 rounded-lg shadow-lg '>
                <h1 className='text-3xl font-semibold text-center mb-6 select-none text-gray-800'>Login</h1>
                <form onSubmit={handleLogin_submit}>
                    <div className="mb-4">
                        <input
                            type="text"
                            value={email_userName_state}
                            onChange={(e) => setEmail_userName_state(e.target.value)}
                            placeholder='Enter your email or username'
                            required
                            className='w-full rounded-lg border-2 px-4 py-2 focus:border-blue-400 outline-none'
                        />
                    </div>

                    <div className="mb-4 relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password_state}
                            onChange={(e) => setPassword_state(e.target.value)}
                            placeholder='Enter your password'
                            required
                            className='w-full rounded-lg border-2 px-4 py-2 focus:border-blue-400 outline-none pr-10'
                        />
                        <span
                            className="absolute right-3 top-3 cursor-pointer text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
                        </span>
                    </div>

                    <div className='mb-4 flex items-center space-x-2'>
                        <input
                            type="checkbox"
                            id="loginRememberCheck"
                            checked={loginRemember_state}
                            onChange={(e) => setLoginRemember_state(e.target.checked)}
                            className='size-4 cursor-pointer'
                        />
                        <label className='select-none cursor-pointer' htmlFor="loginRememberCheck">Remember Me</label>
                    </div>

                    <button type="submit" disabled={submit_process_state} className={`${submit_process_state ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"} w-full text-white rounded-lg py-2 font-medium transition`}>
                        {!submit_process_state ? "Login" : <i className="fa-solid fa-spinner fa-spin"></i>}
                    </button>
                </form>

                <button onClick={handleGoogleLogin} className='w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg flex items-center justify-center space-x-2 font-medium transition'>
                    <ion-icon name="logo-google"></ion-icon> <span>Login With Google</span>
                </button>

                <p onClick={handleForgotPassword} className='text-blue-600 mt-4 text-center underline cursor-pointer'>I Forgot My Password</p>
                <p className='mt-4 text-center'>
                    Don’t have an account? <Link to="/signup" className='text-blue-600 underline'>Register</Link>
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
