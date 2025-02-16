import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProcessBgBlack from '../../components/processBgBlack/processBgBlack';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useGoogleLogin } from "@react-oauth/google";

const Login = () => {
    const [email_userName_state, setEmail_userName_state] = useState('');
    const [password_state, setPassword_state] = useState('');
    const [loginRemember_state, setLoginRemember_state] = useState(false);
    const [error, setError] = useState([]);
    let [submit_process_state, setSubmit_process_state] = useState(false);
    let [data_process_state, setData_process_state] = useState(false);
    const navigation = useNavigate();

    const fetchData = async () => {
        setData_process_state(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/userRoute/userLoginCheckGet`, {
                withCredentials: true
            });
            if (response.data.success && response.data.message) {
                // If the user is already logged in
                Swal.fire({
                    title: 'You Already Logged In',
                    text: 'Please Continue Earning',
                    icon: 'error',
                    timer: 5000,
                    timerProgressBar: true,
                    confirmButtonText: 'OK',
                    didClose: () => {
                        // Navigate to the dashboard after the modal closes
                        navigation('/member/dashboard');
                    }
                });
            }
        } catch (error) {
            console.error(error);
            if (error.response.data.jwtMiddleware_token_not_found_error || error.response.data.jwtMiddleware_user_not_found_error) {
                navigation('/login');
            } else if (error.response.data.jwtMiddleware_error) {
                Swal.fire({
                    title: 'Session Expired',
                    text: 'Your session has expired. Please log in again.',
                    icon: 'error',
                    timer: 5000,
                    timerProgressBar: true,
                    confirmButtonText: 'OK',
                    didClose: () => {
                        navigation('/login');
                    }
                });
            }
        } finally {
            setData_process_state(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    let dataBase_post_login = async (obj) => {
        try {
            let response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/userRoute/login`, obj, {
                withCredentials: true // This ensures cookies are sent with the request
            })
            setError([])
            if (response) {
                navigation('/member/dashboard')
            }
            setSubmit_process_state(false)
        } catch (error) {
            setSubmit_process_state(false)
            console.log(error);
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
                    navigation('/member/dashboard')
                }
                setSubmit_process_state(false)
            } else {
                throw new Error(authResult);
            }
        } catch (error) {
            setSubmit_process_state(false)
            console.log(error);
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

    return (
        <div className='flex h-[90vh] items-center justify-center'>
            <div className='md:w-[45%] sm:w-[90%] w-[97%]'>
                <h1 className='text-3xl font-medium text-center mb-5 select-none'>Login</h1>
                <form onSubmit={handleLogin_submit}>
                    <input type="text" id="emailOrUsername" value={email_userName_state} onChange={(e) => setEmail_userName_state(e.target.value)} placeholder='Enter your email or username' required className='w-full rounded outline-none border-2 px-2 py-1 inline-block mb-2 focus:border-blue-400' />
                    <input type="password" id="password" value={password_state} onChange={(e) => setPassword_state(e.target.value)} placeholder='Enter your password' required className='w-full rounded outline-none border-2 px-2 py-1 inline-block mb-2 focus:border-blue-400' />
                    <div className='mb-2 space-x-2'>
                        <input type="checkbox" id="loginRemember" checked={loginRemember_state} onChange={(e) => setLoginRemember_state(e.target.checked)} className='size-3' />
                        <label className='select-none cursor-pointer' htmlFor="loginRemember">Remember Me</label>
                    </div>
                    <button type="submit" disabled={submit_process_state} className={`${submit_process_state ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"} w-full text-white rounded py-1 mb-2 transition`}>
                        {!submit_process_state ? "Login" : <i className="fa-solid fa-spinner fa-spin"></i>}
                    </button>
                </form>
                <button onClick={handleGoogleLogin} className='w-full mb-2 bg-transparent hover:bg-black transition hover:text-white py-1 rounded border-2 border-black flex items-center justify-center space-x-2'>
                    <ion-icon name="logo-google"></ion-icon> <span>Login With Google</span>
                </button>
                <Link to="/forget-password" className='text-blue-600 underline'>I Forgot My Password</Link>
                <p className='mt-2 select-none'>
                    Don’t have an account? <Link to="/signup" className='text-blue-600 underline' >Register a New Account</Link>
                </p>
            </div>
            {(submit_process_state || data_process_state) && <ProcessBgBlack />}
            {error.length > 0 && error.map((value, index) => (
                <Error key={index} color="yellow" text={value} />
            ))}
        </div>
    );
}

export default Login;
