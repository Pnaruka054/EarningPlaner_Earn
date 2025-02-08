import React, { useState } from 'react';
import Footer from '../components/footer/footer';

const Deposit = ({ setShowBottomAlert_state }) => {
    const [deposit_amount_state, setDeposit_amount_state] = useState(0);

    const handleCopy = () => {
        const textToCopy = document.getElementById('copyText');
        navigator.clipboard.writeText(textToCopy.textContent).then(() => {
            setShowBottomAlert_state(true);
            setTimeout(() => setShowBottomAlert_state(false), 2000);
        });
    };

    const handleDeposit_btn = () => {

    }

    function deposit_amount_btn(e) {
        setDeposit_amount_state(e.currentTarget.children[1].innerText);
    }
    return (
        <div className="ml-auto flex flex-col justify-between  bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[94vh] mt-12">
            <div className='px-2 py-2'>
                <div className='text-2xl text-blue-600 font-semibold my-4 mx-2 select-none flex justify-between'>
                    Deposit Amount
                </div>
                <div className='text-center bg-gradient-to-r from-transparent via-teal-500 to-transparent py-2 text-white font-lexend mb-3'>
                    Deposit Balance - ₹100
                </div>
                <div className='flex justify-center'>
                    <ul className='flex flex-wrap justify-center gap-5'>
                        <li onClick={deposit_amount_btn} className='w-16 rounded-md px-2 flex justify-between border border-slate-300 cursor-pointer'>
                            <span className='text-slate-500'>₹</span>
                            <span className='text-red-500'>100</span>
                        </li>
                        <li onClick={deposit_amount_btn} className='w-16 rounded-md px-2 flex justify-between border border-slate-300 cursor-pointer'>
                            <span className='text-slate-500'>₹</span>
                            <span className='text-red-500'>500</span>
                        </li>
                        <li onClick={deposit_amount_btn} className='w-16 rounded-md px-2 flex justify-between border border-slate-300 cursor-pointer'>
                            <span className='text-slate-500'>₹</span>
                            <span className='text-red-500'>1000</span>
                        </li>
                        <li onClick={deposit_amount_btn} className='w-16 rounded-md px-2 flex justify-between border border-slate-300 cursor-pointer'>
                            <span className='text-slate-500'>₹</span>
                            <span className='text-red-500'>2000</span>
                        </li>
                        <li onClick={deposit_amount_btn} className='w-16 rounded-md px-2 flex justify-between border border-slate-300 cursor-pointer'>
                            <span className='text-slate-500'>₹</span>
                            <span className='text-red-500'>3000</span>
                        </li>
                    </ul>
                </div>
                <div className='px-5'>
                    <input type="number" value={deposit_amount_state} onFocus={(e) => setDeposit_amount_state((prev) => prev = '')} onBlur={(e) => setDeposit_amount_state((prev) => prev === '' ? prev = 0 : prev = prev)} onChange={(e) => setDeposit_amount_state((prev) => prev = e.target.value)} pattern='^[0-9]' required className='block w-full my-3 pl-10 py-2 px-3 outline-none text-blue-600 no-arrows rounded-md rupees_symbol bg-no-repeat' />
                    <div className='space-x-5 flex justify-center'>
                        <button onClick={handleDeposit_btn} className='w-full py-2 bg-green-600 text-white'>Deposit</button>
                        <button onClick={() => setDeposit_amount_state(0)} className='w-full py-2 bg-red-600 text-white'>Clear</button>
                    </div>
                </div>
                <div className='bg-white my-5 pb-5 rounded-xl border border-green-800'>
                    <p className='text-center text-lg my-3'>Deposit Instructions</p>
                    <hr className='w-[95%] m-auto border' />
                    <ul className='px-6 mt-2'>
                        <li className='deposit-list-image'>If the transfer time is up, please fill out the deposit form again.</li>
                        <li className='deposit-list-image'>The transfer amount must match the order you create, otherwise the money connot be credited successfully.</li>
                        <li className='deposit-list-image'>If you transfer the wrong amount, our company will not be respnsible for the lost amount!</li>
                        <li className='deposit-list-image'>Note: do not cancel the deposit order after the money has been transferred.</li>
                    </ul>
                </div>
                <div className='my-5 pb-5'>
                    <p className='text-center text-lg my-3'>Deposit History</p>
                    <hr className='w-full m-auto border border-gray-300 shadow-lg' />
                    <ul className='mt-4 space-y-4'>
                        <li className='bg-white px-3 py-5 rounded-lg text-[14px] sm:text-[16px] shadow-md mt-4'>
                            <div className='flex justify-between'>
                                <p className='px-3 cursor-pointer py-1 rounded-md text-white bg-red-500'>Deposit</p>
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
                                        <i onClick={(e) => {
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
        </div>
    );
}

export default Deposit;
