import { Link } from 'react-router-dom';

const Signup = () => {
    return (
        <div className='flex h-[90vh] items-center justify-center'>
            <div className='md:w-[45%] sm:w-[90%] w-[97%]'>
                <h1 className='text-3xl font-medium text-center mb-5 select-none'>Sign Up</h1>
                <input type="text" placeholder='Enter your name' required className='w-full rounded outline-none border-2 px-2 py-1 inline-block mb-2 focus:border-blue-400' />
                <input type="text" placeholder='Enter your mobile number' required className='w-full rounded outline-none border-2 px-2 py-1 inline-block mb-2 focus:border-blue-400' />
                <input type="text" placeholder='Enter your email' required className='w-full rounded outline-none border-2 px-2 py-1 inline-block mb-2 focus:border-blue-400' />
                <input type="password" placeholder='Enter your password' required className='w-full rounded outline-none border-2 px-2 py-1 inline-block mb-2 focus:border-blue-400' />
                <input type="password" placeholder='Re-enter your password' required className='w-full rounded outline-none border-2 px-2 py-1 inline-block mb-2 focus:border-blue-400' />
                <div className='mb-2 space-x-2'>
                    <input type="checkbox" className='size-3' id='signupTerms' />
                    <label className='select-none cursor-pointer' htmlFor="signupTerms">I agree to the Terms of Use and Privacy Policy.</label>
                </div>
                <button className='w-full bg-blue-600 text-white rounded py-1 mb-2 hover:bg-blue-700 transition'>Sign Up</button>
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
        </div>
    );
}

export default Signup;
