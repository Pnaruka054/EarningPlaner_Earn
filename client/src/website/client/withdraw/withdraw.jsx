import React, { useState } from 'react';
import Footer from '../components/footer/footer';

const Withdraw = ({ setShowBottomAlert }) => {
    const [withdraw_amount_state, setWithdraw_amount_state] = useState(0);
    const handleCopy = () => {
        const textToCopy = document.getElementById('copyText');
        navigator.clipboard.writeText(textToCopy.textContent).then(() => {
            setShowBottomAlert(true);
            setTimeout(() => setShowBottomAlert(false), 2000);
        });
    };
    return (
        <div className="ml-auto flex flex-col justify-between bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[94vh] mt-12">
            <div className='px-2 py-2'>
                <div className='text-2xl text-blue-600 font-semibold my-4 mx-2 select-none flex justify-between'>
                    Withdraw Amount
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 mb-4">
                    <div className="bg-teal-500 p-6 rounded-lg shadow-md text-white relative hover_on_image_with_div">
                        <div className="flex flex-col justify-between h-full">
                            <h3 className="text-3xl font-semibold">₹47</h3>
                            <p className="text-lg">Available Balance</p>
                        </div>
                        <div className="absolute top-4 right-4 text-4xl opacity-[0.2]">
                        <i className="fa-duotone fa-light fa-money-from-bracket hover_on_image"></i>
                        </div>
                    </div>
                    <div className="bg-red-500 p-6 rounded-lg shadow-md text-white relative hover_on_image_with_div">
                        <div className="flex flex-col justify-between h-full">
                            <h3 className="text-3xl font-semibold">₹47</h3>
                            <p className="text-lg">Pending Withdrawn</p>
                        </div>
                        <div className="absolute top-4 right-4 text-4xl opacity-[0.2]">
                            <i className="fa fa-share hover_on_image"></i>
                        </div>
                    </div>
                    <div className="bg-green-500 p-6 rounded-lg shadow-md text-white relative hover_on_image_with_div">
                        <div className="flex flex-col justify-between h-full">
                            <h3 className="text-3xl font-semibold">₹47</h3>
                            <p className="text-lg">Total Withdraw</p>
                        </div>
                        <div className="absolute top-4 right-4 text-4xl opacity-[0.2]">
                            <i className="fa-solid fa-indian-rupee-sign hover_on_image"></i>
                        </div>
                    </div>
                </div>
                <div className='px-5'>
                    <input type="number" value={withdraw_amount_state} onFocus={(e) => setWithdraw_amount_state((prev) => prev = '')} onBlur={(e) => setWithdraw_amount_state((prev) => prev === '' ? prev = 0 : prev = prev)} onChange={(e) => setWithdraw_amount_state((prev) => prev = e.target.value)} pattern='^[0-9]' required className='block w-full my-3 pl-10 py-2 px-3 outline-none text-blue-600 no-arrows rounded-md rupees_symbol bg-no-repeat' />
                    <div className='space-x-5 flex justify-center'>
                        <button className='w-full py-2 bg-green-600 text-white'>Withdraw Now</button>
                        <button onClick={() => setWithdraw_amount_state(0)} className='w-full py-2 bg-red-600 text-white'>Clear</button>
                    </div>
                </div>
                <div className='bg-white my-5 pb-5 rounded-xl border border-green-800'>
                    <p className='text-center text-lg my-3'>Withdraw Instructions</p>
                    <hr className='w-[95%] m-auto border' />
                    <ul className='px-6 mt-2'>
                        <li className='deposit-list-image'>If the transfer time is up, please fill out the deposit form again.</li>
                        <li className='deposit-list-image'>The transfer amount must match the order you create, otherwise the money connot be credited successfully.</li>
                        <li className='deposit-list-image'>If you transfer the wrong amount, our company will not be respnsible for the lost amount!</li>
                        <li className='deposit-list-image'>Note: do not cancel the deposit order after the money has been transferred.</li>
                    </ul>
                </div>
                <div className='my-5 pb-5'>
                    <p className='text-center text-lg my-3'>Withdraw History</p>
                    <hr className='m-auto border border-gray-300 shadow-lg' />
                    <ul className='mt-4'>
                        <li className='bg-white px-3 py-5 rounded-lg shadow-md text-[14px] sm:text-[16px]'>
                            <div className='flex justify-between'>
                                <p className='px-3 cursor-pointer py-1 rounded-md text-white bg-red-500'>Withdraw</p>
                                <p className='text-green-600 font-bold'>Completed</p>
                            </div>
                            <div className='mt-2'>
                                <div className='flex justify-between px-2'>
                                    <span className='text-gray-500 font-medium'>Balance</span>
                                    <span className='text-blue-600 font-medium'>₹328.00</span>
                                </div>
                                <div className='flex justify-between px-2'>
                                    <span className='text-gray-500 font-medium'>Type</span>
                                    <span className='text-gray-500 font-medium'>BANK CARD</span>
                                </div>
                                <div className='flex justify-between px-2'>
                                    <span className='text-gray-500 font-medium'>Time</span>
                                    <span className='text-gray-500 font-medium'>2025-01-24 06:24:11</span>
                                </div>
                                <div className='flex justify-between px-2'>
                                    <span className='text-gray-500 font-medium'>Order number</span>
                                    <span className='text-gray-500 font-medium space-x-1'>
                                        <span id='copyText'>WD20250125458KJSH4584</span>
                                        <i onClick={(e)=>{
                                            handleCopy()
                                            e.target.className = 'fa-solid fa-clipboard cursor-pointer'
                                            setTimeout(() => {
                                                e.target.className = 'fa-regular fa-clipboard cursor-pointer'
                                            }, 2000);
                                        }} className="fa-regular fa-clipboard cursor-pointer"></i>
                                    </span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div className='mt-3'>
                <Footer />
            </div>
        </div >
    );
}

export default Withdraw;
