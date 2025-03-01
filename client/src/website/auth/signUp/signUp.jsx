import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { useEffect, useState } from 'react';
import Error from '../../components/error/error';
import ProcessBgBlack from '../../components/processBgBlack/processBgBlack';
import showNotification from '../../components/showNotification'
import { useGoogleLogin } from "@react-oauth/google";
import ReCAPTCHA from 'react-google-recaptcha';

const Signup = ({ referral_status }) => {
    const [formData_state, setFormData_state] = useState({
        name: '',
        mobile_number: '',
        email_address: '',
        password: '',
        reenterPassword: '',
        signupTerms: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showReenterPassword, setShowReenterPassword] = useState(false);
    const navigation = useNavigate();
    let { id } = useParams();
    const [error_state, setError_state] = useState([]);
    let [submit_process_state, setSubmit_process_state] = useState(false);
    const [captchaValue, setCaptchaValue] = useState(null);

    const onCaptchaChange = (value) => {
        setCaptchaValue(value);
    };

    const dataBase_post_signUp = async (obj) => {
        try {
            let response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/userRoute/signUp`, obj);
            if (response.data.user) {
                showNotification(false, 'user registered successfully!')
                navigation('/login');
            }
        } catch (error) {
            console.log(error);
            if (typeof (error?.response?.data?.error_msg) === 'object') {
                let error_array = [];
                for (let a of error?.response?.data?.error_msg) {
                    error_array.push(a.msg);
                }
                setError_state(error_array);
                setTimeout(() => {
                    setError_state("");
                }, 4000);
            } else if (error?.response?.data?.error_msg === 'Already Registered') {
                showNotification(true, "User Already Registered Please Login")
                navigation('/login')
            } else if (error?.response?.data?.error_msg) {
                showNotification(true, error?.response?.data?.error_msg)
            } else if (error?.response?.data?.msg) {
                showNotification(false, "Something went wrong please try again after sometime")
            }
        } finally {
            setSubmit_process_state(false);
        }
    };

    // singUp button click handle
    const handleSingUp_submit = async (e) => {
        e.preventDefault();
        if (!captchaValue) {
            showNotification(true, 'Please verify that you are a human!')
            return;
        }
        if (formData_state.password !== formData_state.reenterPassword) {
            setError_state(["Password & confirm password do not match."]);
            setTimeout(() => {
                setError_state("");
            }, 5000);
            return;
        }

        let obj = {
            name: formData_state.name,
            mobile_number: parseInt(formData_state.mobile_number),
            email_address: formData_state.email_address,
            password: formData_state.password,
            ...(referral_status && { refer_by: id }),
        };
        dataBase_post_signUp(obj);
        setSubmit_process_state(true);
    };

    const handleInputChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData_state((prevData) => ({
            ...prevData,
            [id]: type === 'checkbox' ? checked : value,
        }));
    };

    const responseGoogle = async (authResult) => {
        try {
            if (authResult["code"]) {
                let response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/userRoute/user_signUp_login_google?google_code=${authResult.code}&referral_id_signup=${id}`, {
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
            if (error?.response?.data?.error_msg === "Missing credentials") {
                showNotification(true, "Missing credentials");
            } else if (error?.response?.data?.error_msg === "Please Login With Password") {
                showNotification(true, "You Already Registered Please Login With Password");
                navigation('/login')
            } else if (error?.response?.data?.error_msg === "Your Registration Link is invalid") {
                showNotification(true, "Your Registration Link is invalid");
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

    // sighup with google button click handle
    const handleGoogleSingUp = async (e) => {
        e.preventDefault();
        if (!captchaValue) {
            showNotification(true, 'Please verify that you are a human!')
            return;
        }
        googleLogin();
        setSubmit_process_state(true)
    };

    return (
        <div className='flex h-[92.5dvh] items-center justify-center bg-gray-100 overflow-auto custom-scrollbar'>
            <div className='md:w-[40%] sm:w-[80%] w-[90%] bg-white p-6 rounded-lg shadow-lg'>
                <h1 className='text-3xl font-semibold text-center mb-6 select-none text-gray-800'>Sign Up</h1>
                <form onSubmit={handleSingUp_submit}>
                    <div className="mb-4">
                        <input
                            type="text"
                            id="name"
                            value={formData_state.name}
                            onChange={handleInputChange}
                            placeholder='Enter your name'
                            required
                            className='w-full rounded-lg border-2 px-4 py-2 focus:border-blue-400 outline-none'
                        />
                    </div>

                    <div className="mb-4">
                        <input
                            type="text"
                            pattern="^\d{10}$"
                            title="Please enter a valid 10-digit Indian mobile number"
                            id="mobile_number"
                            value={formData_state.mobile_number}
                            onChange={handleInputChange}
                            placeholder='Enter your mobile number'
                            required
                            className='w-full rounded-lg border-2 px-4 py-2 focus:border-blue-400 outline-none'
                        />
                    </div>

                    <div className="mb-4">
                        <input
                            type="text"
                            id="email_address"
                            value={formData_state.gmail_address}
                            onChange={handleInputChange}
                            placeholder='Enter your email'
                            required
                            className='w-full rounded-lg border-2 px-4 py-2 focus:border-blue-400 outline-none'
                        />
                    </div>

                    <div className="mb-4 relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={formData_state.password}
                            onChange={handleInputChange}
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

                    <div className="mb-4 relative">
                        <input
                            type={showReenterPassword ? "text" : "password"}
                            id="reenterPassword"
                            value={formData_state.reenterPassword}
                            onChange={handleInputChange}
                            placeholder='Re-enter your password'
                            required
                            className='w-full rounded-lg border-2 px-4 py-2 focus:border-blue-400 outline-none pr-10'
                        />
                        <span
                            className="absolute right-3 top-3 cursor-pointer text-gray-600"
                            onClick={() => setShowReenterPassword(!showReenterPassword)}
                        >
                            {showReenterPassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
                        </span>
                    </div>

                    <div className='mb-4 flex items-center space-x-2'>
                        <input
                            type="checkbox"
                            id="signupTerms"
                            required
                            checked={formData_state.signupTerms}
                            onChange={handleInputChange}
                            className='size-4 cursor-pointer'
                        />
                        <label className='select-none cursor-pointer' htmlFor="signupTerms">I agree to the Terms of Use and Privacy Policy.</label>
                    </div>
                    <ReCAPTCHA
                        sitekey={import.meta.env.VITE_GOOGLE_RECAPTCHA_SITEKEY}
                        onChange={onCaptchaChange}
                    />
                    <button type="submit" disabled={submit_process_state} className={`${submit_process_state ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"} w-full text-white rounded-lg py-2 mt-3 font-medium transition`}>
                        {!submit_process_state ? "Sign Up" : <i className="fa-solid fa-spinner fa-spin"></i>}
                    </button>
                </form>

                <button onClick={handleGoogleSingUp} className='w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg flex items-center justify-center space-x-2 font-medium transition'>
                    <ion-icon name="logo-google"></ion-icon> <span>Sign Up With Google</span>
                </button>

            </div>
            {submit_process_state && <ProcessBgBlack />}
            {error_state.length > 0 && error_state.map((value, index) => (
                showNotification(true, value)
            ))}
        </div>
    );

}

export default Signup;
