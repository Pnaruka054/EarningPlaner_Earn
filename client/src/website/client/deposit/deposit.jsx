import React, { useEffect, useState } from 'react';
import Footer from '../components/footer/footer';
import ProcessBgBlack from '../components/processBgBlack/processBgBlack';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Deposit = ({ setShowBottomAlert_state, setAvailableBalance_forNavBar_state }) => {
    const [deposit_amount_state, setDeposit_amount_state] = useState(0);
    let [data_process_state, setData_process_state] = useState(false);
    let [submit_process_state, setSubmit_process_state] = useState(false);
    const navigation = useNavigate();
    let [balanceData_state, setBalanceData_state] = useState({
        withdrawable_amount: '0.000',
        deposit_amount: '0.000',
        pending_withdrawal_amount: '0.000',
        total_withdrawal_amount: '0.000',
        available_amount: '0.000',
        withdrawal_method: '',
        withdrawal_account_information: '',
        withdrawal_Records: [],
        withdrawal_methodsData: []
    });
    const handleCopy = () => {
        const textToCopy = document.getElementById('copyText');
        navigator.clipboard.writeText(textToCopy.textContent).then(() => {
            setShowBottomAlert_state(true);
            setTimeout(() => setShowBottomAlert_state(false), 2000);
        });
    };

    const fetchData = async () => {
        setData_process_state(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/userWithdraw/userBalanceData_get`, {
                withCredentials: true
            });
            setBalanceData_state((prev) => ({
                ...prev,
                ...response.data.msg,
                available_amount: (parseFloat(response.data.msg.withdrawable_amount) + parseFloat(response.data.msg.deposit_amount)).toFixed(3)  // Calculate and update available_amount
            }));
            setAvailableBalance_forNavBar_state((parseFloat(response.data.msg.withdrawable_amount) + parseFloat(response.data.msg.deposit_amount)).toFixed(3))
        } catch (error) {
            console.error(error);
            if (error.response.data.jwtMiddleware_token_not_found_error) {
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
                <div className='text-center bg-gradient-to-r from-teal-400 via-teal-600 to-teal-400 py-3 px-6 rounded-lg shadow-lg text-white font-lexend mb-4'>
                    Deposit Balance - ₹{balanceData_state.deposit_amount || 0.000}
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
                        <li className='blue-right-list-image'>If the transfer time is up, please fill out the deposit form again.</li>
                        <li className='blue-right-list-image'>The transfer amount must match the order you create, otherwise the money connot be credited successfully.</li>
                        <li className='blue-right-list-image'>If you transfer the wrong amount, our company will not be respnsible for the lost amount!</li>
                        <li className='blue-right-list-image'>Note: do not cancel the deposit order after the money has been transferred.</li>
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
            {(data_process_state || submit_process_state) && <ProcessBgBlack />}
            <div className='mt-3'>
                <Footer />
            </div>
        </div>
    );
}

export default Deposit;
