import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <div className='flex h-[90vh] items-center justify-center'>
            <div className='md:w-[45%] sm:w-[90%] w-[97%]'>
                <h1 className='text-3xl font-medium text-center mb-5 select-none'>Login</h1>
                <input type="text" placeholder='Enter your email or username' required className='w-full rounded outline-none border-2 px-2 py-1 inline-block mb-2 focus:border-blue-400' />
                <input type="password" placeholder='Enter your password' required className='w-full rounded outline-none border-2 px-2 py-1 inline-block mb-2 focus:border-blue-400' />
                <div className='mb-2 space-x-2'>
                    <input type="checkbox" className='size-3' id='loginRemember' />
                    <label className='select-none cursor-pointer' htmlFor="loginRemember">Remember Me</label>
                </div>
                <button className='w-full bg-blue-600 text-white rounded py-1 mb-2 hover:bg-blue-700 transition'>Login</button>
                <button className='w-full mb-2 bg-transparent hover:bg-black transition hover:text-white py-1 rounded border-2 border-black flex items-center justify-center space-x-2'>
                    <ion-icon name="logo-google"></ion-icon> <span>Login With Google</span>
                </button>
                <Link to="/forget-password" className='text-blue-600 underline'>I Forgot My Password</Link>
                <p className='mt-2 select-none'>
                    Don’t have an account? <Link to="/signup" className='text-blue-600 underline' >Register a New Account</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
