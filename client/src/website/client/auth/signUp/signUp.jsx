import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { useState } from 'react';
import Error from '../../components/error/error';
import ProcessBgBlack from '../../components/processBgBlack/processBgBlack';

const Signup = ({ referral_status }) => {
    const [formData, setFormData] = useState({
        name: '',
        mobile_number: '',
        email_address: '',
        password: '',
        reenterPassword: '',
        signupTerms: false,
    });
    const navigation = useNavigate();
    let { id } = useParams();
    const [error, setError] = useState([]);
    let [submit_process_state, setSubmit_process_state] = useState(false);

    const dataBase_post_signUp = async (obj) => {
        try {
            let response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/userRoute/signUp`, obj);
            setSubmit_process_state(false);
            if (response.data.user) {
                navigation('/login');
            }
        } catch (error) {
            setSubmit_process_state(false);
            if (typeof (error.response.data.error_msg) === 'object') {
                let error_array = [];
                for (let a of error.response.data.error_msg) {
                    error_array.push(a.msg);
                }
                setError(error_array);
                setTimeout(() => {
                    setError("");
                }, 4000);
            } else {
                setError([error.response.data.error_msg]);
            }
        }
    };

    const handleSingUp_submit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.reenterPassword) {
            setError(["Password & confirm password do not match."]);
            setTimeout(() => {
                setError("");
            }, 5000);
            return;
        }

        let obj = {
            name: formData.name,
            mobile_number: Number(formData.mobile_number),
            email_address: formData.email_address,
            password: formData.password,
            ...(referral_status && { refer_by: id }),
        };
        dataBase_post_signUp(obj);
        setSubmit_process_state(true);
    };

    const handleInputChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: type === 'checkbox' ? checked : value,
        }));
    };

    return (
        <div className='flex h-[90vh] items-center justify-center'>
            <div className='md:w-[45%] sm:w-[90%] w-[97%]'>
                <h1 className='text-3xl font-medium text-center mb-5 select-none'>Sign Up</h1>
                <form onSubmit={handleSingUp_submit}>
                    <input type="text" id="name" value={formData.name} onChange={handleInputChange} placeholder='Enter your name' required className='w-full rounded outline-none border-2 px-2 py-1 inline-block mb-2 focus:border-blue-400' />
                    <input type="text" id="mobile_number" value={formData.mobile_number} onChange={handleInputChange} placeholder='Enter your mobile number' required className='w-full rounded outline-none border-2 px-2 py-1 inline-block mb-2 focus:border-blue-400' />
                    <input type="text" id="email_address" value={formData.gmail_address} onChange={handleInputChange} placeholder='Enter your email' required className='w-full rounded outline-none border-2 px-2 py-1 inline-block mb-2 focus:border-blue-400' />
                    <input type="password" id="password" value={formData.password} onChange={handleInputChange} placeholder='Enter your password' required className='w-full rounded outline-none border-2 px-2 py-1 inline-block mb-2 focus:border-blue-400' />
                    <input type="text" id="reenterPassword" value={formData.reenterPassword} onChange={handleInputChange} placeholder='Re-enter your password' required className='w-full rounded outline-none border-2 px-2 py-1 inline-block mb-2 focus:border-blue-400' />
                    <div className='mb-2 space-x-2'>
                        <input type="checkbox" id="signupTerms" checked={formData.signupTerms} onChange={handleInputChange} className='size-3' />
                        <label className='select-none cursor-pointer' htmlFor="signupTerms">I agree to the Terms of Use and Privacy Policy.</label>
                    </div>
                    <button type="submit" disabled={submit_process_state} className={`${submit_process_state ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"} w-full text-white rounded py-1 mb-2 transition`}>
                        {!submit_process_state ? "Sign Up" : <i className="fa-solid fa-spinner fa-spin"></i>}
                    </button>
                </form>
                <div className="text-center mt-3 relative">
                    <hr className="absolute border-slate-400" style={{ top: '0%', width: '45%' }} />
                    <span className="bg-white px-2 relative -top-3">or</span>
                    <hr className="absolute border-slate-400" style={{ top: '0%', width: '45%', right: "0" }} />
                </div>
                <button className='w-full mb-2 bg-red-500 text-white hover:bg-black transition py-1 rounded flex items-center justify-center space-x-2'>
                    <ion-icon name="logo-google"></ion-icon> <span>Sign Up With Google</span>
                </button>
                <Link to="/forget-password" className='text-blue-600 underline'>I Forgot My Password</Link>
                <p className='mt-2 select-none'>
                    Don’t have an account? <Link to="/signup" className='text-blue-600 underline' >Register a New Account</Link>
                </p>
            </div>
            {submit_process_state && <ProcessBgBlack />}
            {error.length > 0 && error.map((value, index) => (
                <Error key={index} color="yellow" text={value} />
            ))}
        </div>
    );
}

export default Signup;
