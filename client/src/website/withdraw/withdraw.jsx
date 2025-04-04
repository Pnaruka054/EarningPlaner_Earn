import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Footer from '../components/footer/footer';
import axios from 'axios';
import ProcessBgBlack from '../components/processBgBlack/processBgBlack';
import { useNavigate } from 'react-router-dom';
import Pagination from '../components/pagination/pagination';
import { FaClipboard, FaClipboardCheck, FaCreditCard, FaRupeeSign, FaShare, FaSync, FaWallet } from "react-icons/fa";
import showNotificationWith_timer from '../components/showNotificationWith_timer';
import showNotification from '../components/showNotification';
import ProcessBgSeprate from '../components/processBgSeprate/processBgSeprate';
import { encryptData } from '../components/encrypt_decrypt_data';

import { Helmet } from 'react-helmet';

const Withdraw = ({ setAvailableBalance_forNavBar_state }) => {
    const [withdraw_amount_state, setWithdraw_amount_state] = useState(0);
    const [data_process_state, setData_process_state] = useState(false);
    const [submit_process_state, setSubmit_process_state] = useState(false);
    const [balanceData_state, setBalanceData_state] = useState({
        withdrawable_amount: '0.000',
        deposit_amount: '0.000',
        pending_withdrawal_amount: '0.000',
        total_withdrawal_amount: '0.000',
        available_amount: '0.000',
        withdrawal_method: undefined,
        withdrawal_account_information: '',
        withdrawal_Records: [],
        other_data_withdrawal_instructions: []
    });
    // Added missing state for current page
    const [currentPage_state, setCurrentPage_state] = useState(1);
    const navigation = useNavigate();

    const fetchData = async (blackBgProcess = false) => {
        if (blackBgProcess) {
            ProcessBgSeprate(true)
        } else {
            setData_process_state(true);
        }
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/userAmount/userBalanceData_get`, {
                withCredentials: true
            });
            if (response?.data?.msg) {
                setBalanceData_state(prev => ({
                    ...prev,
                    ...response.data.msg,
                    available_amount: (
                        parseFloat(response.data.msg.withdrawable_amount || 0) +
                        parseFloat(response.data.msg.deposit_amount || 0)
                    ).toFixed(3)
                }));
                setAvailableBalance_forNavBar_state((
                    parseFloat(response.data.msg.withdrawable_amount || 0) +
                    parseFloat(response.data.msg.deposit_amount || 0)
                ).toFixed(3));
            }
        } catch (error) {
            console.error(error);
            if (error.response.data.jwtMiddleware_token_not_found_error || error.response.data.jwtMiddleware_user_not_found_error) {
                navigation('/login');
            } else if (error?.response?.data?.jwtMiddleware_error) {
                showNotificationWith_timer(true, 'Your session has expired. Please log in again.', '/login', navigation);
            } else {
                showNotification(true, "Something went wrong, please try again.");
            }
        } finally {
            if (blackBgProcess) {
                ProcessBgSeprate(false)
            } else {
                setData_process_state(false);
            }
        }
    };

    useEffect(() => {
        fetchData();

        const handle_userOnline = () => {
            fetchData();
        };

        window.addEventListener('online', handle_userOnline);

        return () => {
            window.removeEventListener('online', handle_userOnline);
        };
    }, []);

    let dataBase_post_newWithdrawal = async (obj) => {
        setSubmit_process_state(true);
        try {
            let encryptedObj = await encryptData(obj)
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/userAmount/userWithdrawal_record_post`, { obj: encryptedObj }, {
                withCredentials: true
            });

            if (response.status === 200) {
                fetchData(true);
                Swal.fire({
                    icon: 'success',
                    title: 'Withdrawal Successful',
                    text: `Your withdrawal of ₹${obj.balance} has been successfully processed.`,
                    timer: 5000,
                    timerProgressBar: true,
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            console.error(error);
            if (error.response.data.jwtMiddleware_token_not_found_error) {
                Swal.fire({
                    title: 'Authentication Error',
                    text: 'Please log in again to continue.',
                    icon: 'error',
                    timer: 5000,
                    timerProgressBar: true,
                    confirmButtonText: 'OK',
                    didClose: () => {
                        navigation('/login');
                    }
                });
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
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Something went wrong with your withdrawal. Please try again later.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } finally {
            setSubmit_process_state(false);
        }
    };

    let handleUserWithdrawals = () => {
        if (balanceData_state.withdrawal_method === '' && balanceData_state.withdrawal_account_information === '') {
            return Swal.fire({
                icon: 'warning',
                title: 'Bind Payment Info',
                text: 'Please bind your payment information to proceed with withdrawals.',
                timerProgressBar: true,
                timer: 5000,
                didClose: () => {
                    navigation('/member/profile');
                },
                showConfirmButton: false,
                showCancelButton: false,
            });
        }

        if (!balanceData_state.withdrawal_method) {
            return Swal.fire({
                icon: 'warning',
                title: 'Bind Payment Info',
                text: 'Please bind Your payment information again',
                timerProgressBar: true,
                timer: 5000,
                didClose: () => {
                    navigation('/member/profile');
                },
                showConfirmButton: false,
                showCancelButton: false,
            });
        }

        if (parseFloat(withdraw_amount_state) < parseFloat(balanceData_state.withdrawalMethod_minimumAmount)) {
            return Swal.fire({
                icon: 'warning',
                title: 'Invalid Amount',
                timerProgressBar: true,
                text: `The minimum withdrawal amount for ${balanceData_state.withdrawal_method} is ₹${balanceData_state.withdrawalMethod_minimumAmount}. Please enter a valid amount.`
            });
        }

        if (parseFloat(withdraw_amount_state) > parseFloat(balanceData_state.withdrawable_amount)) {
            return Swal.fire({
                icon: 'warning',
                title: 'Insufficient Balance',
                text: `Your available balance is ₹${balanceData_state.withdrawable_amount}. Please enter a valid amount.`
            });
        }

        Swal.fire({
            title: 'Are you sure?',
            text: `You are about to withdraw ₹${withdraw_amount_state} via ${balanceData_state.withdrawal_method}. Do you want to proceed?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Withdraw',
            cancelButtonText: 'No, Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                dataBase_post_newWithdrawal({ balance: withdraw_amount_state, type: balanceData_state.withdrawal_method });
            }
        });
    };

    const withdrawArray = [...balanceData_state.withdrawal_Records].reverse();
    const itemsPerPage = 5;
    const indexOfLast = currentPage_state * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const current_index = withdrawArray?.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(withdrawArray?.length / itemsPerPage);

    return (
        <>
            <Helmet>
                <title>EarnWiz Member Withdrawal</title>
                <meta name="description" content="Withdraw your earnings securely via our member withdrawal page. Process your requests quickly and track your withdrawal status effortlessly on EarnWiz." />
            </Helmet>
            {data_process_state ? (
                <div className="ml-auto flex flex-col justify-between bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[93.3dvh] mt-[6.7dvh]">
                    <ProcessBgSeprate />
                </div>
            ) : (
                <div className="ml-auto flex flex-col justify-between bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[93.3dvh] mt-[6.7dvh] custom-scrollbar">
                    <div className='px-2 py-2'>
                        <div className='text-2xl text-blue-600 font-semibold my-4 mx-2 select-none flex justify-between'>
                            Withdraw Amount
                        </div>
                        <div className="sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 mb-4 sm:space-y-0 space-y-5">
                            <div className="bg-cyan-500 p-6 rounded-lg shadow-md text-white relative">
                                <div className="flex flex-col justify-center h-full">
                                    <h3 className="text-3xl font-semibold">
                                        ₹{
                                            isNaN(parseFloat(balanceData_state.available_amount))
                                                ? (parseFloat(balanceData_state.deposit_amount) || parseFloat(balanceData_state.withdrawable_amount) || "0.000")
                                                : parseFloat(balanceData_state.available_amount).toFixed(3)
                                        }
                                    </h3>
                                    <p className="text-lg">Available Balance</p>
                                </div>
                                <div className="absolute top-4 right-4 text-7xl opacity-[0.2]">
                                    <FaWallet className="text-6xl" />
                                </div>
                            </div>
                            <div className="bg-red-500 p-6 rounded-lg shadow-md text-white relative">
                                <div className="flex flex-col justify-between h-full">
                                    <h3 className="text-3xl font-semibold">₹{balanceData_state.pending_withdrawal_amount}</h3>
                                    <p className="text-lg">Pending Withdrawn</p>
                                </div>
                                <div className="absolute top-4 right-4 text-4xl opacity-[0.2]">
                                    <FaShare className="text-6xl" />
                                </div>
                            </div>
                            <div className="bg-green-500 p-6 rounded-lg shadow-md text-white relative">
                                <div className="flex flex-col justify-between h-full">
                                    <h3 className="text-3xl font-semibold">₹{balanceData_state.total_withdrawal_amount}</h3>
                                    <p className="text-lg">Total Withdraw</p>
                                </div>
                                <div className="absolute top-4 right-4 text-4xl opacity-[0.2]">
                                    <FaRupeeSign className="text-6xl" />
                                </div>
                            </div>
                        </div>
                        <div className='px-5'>
                            <input
                                type="text"
                                value={withdraw_amount_state}
                                onFocus={() => setWithdraw_amount_state('')}
                                onBlur={() => setWithdraw_amount_state((prev) => prev === '' ? '0' : prev)}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[^0-9]/g, '');
                                    setWithdraw_amount_state(val);
                                }}
                                required
                                className="block w-full my-3 pl-10 py-2 px-3 outline-none text-blue-600 no-arrows rounded-md rupees_symbol bg-no-repeat"
                            />
                            <div className='space-x-5 flex justify-center'>
                                <button onClick={handleUserWithdrawals} className='w-full py-2 bg-green-600 text-white'>Withdraw Now</button>
                                <button onClick={() => setWithdraw_amount_state(0)} className='w-full py-2 bg-red-600 text-white'>Clear</button>
                            </div>
                        </div>
                        <div className='bg-white my-5 pb-5 rounded-xl border border-green-800'>
                            <p className='text-center text-xl font-bold my-4'>Withdraw Instructions</p>
                            <hr className='w-[95%] m-auto border' />
                            <ul className='px-6 mt-2 space-y-4'>
                                {
                                    balanceData_state?.other_data_withdrawal_instructions?.map((value, index) => <li key={index} className='blue-right-list-image' dangerouslySetInnerHTML={{ __html: value }} />)
                                }
                            </ul>
                        </div>
                        <div className="my-5 pb-5">
                            <p className="text-center text-xl font-bold my-4">Withdraw History</p>
                            <hr className="mx-auto w-11/12 border border-gray-300" />
                            <ul className="mt-6 space-y-4">
                                {current_index?.map((record, index) => (
                                    <WithdrawalRow
                                        key={index}
                                        record={record}
                                    />
                                ))}
                            </ul>
                            {current_index.length === 0 && (
                                <div className="text-center h-32 flex items-center justify-center text-gray-500 font-semibold">
                                    🚫 No Withdrawals Yet
                                </div>
                            )}
                        </div>
                        {totalPages > 1 && (
                            <Pagination
                                totalPages={totalPages}
                                currentPage={currentPage_state}
                                onPageChange={setCurrentPage_state}
                            />
                        )}
                    </div>
                    {submit_process_state && <ProcessBgBlack />}
                    <div className='mt-3'>
                        <Footer />
                    </div>
                </div>
            )}
        </>
    );
};

const WithdrawalRow = ({ record }) => {
    const [copiedState, setCopiedState] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(record._id.toUpperCase());
        setCopiedState(true);
        setTimeout(() => setCopiedState(false), 2000);
    };

    return (
        <li className="bg-gray-50 p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
                <p className="px-3 py-1 rounded-md text-white bg-red-500 font-medium">
                    Withdraw
                </p>
                <p
                    className={`font-medium px-3 py-1 rounded-md ${record.withdrawal_status === "Pending"
                        ? "text-yellow-700 bg-yellow-100"
                        : record.withdrawal_status === "Success"
                            ? "text-green-700 bg-green-100"
                            : record.withdrawal_status === "Reject"
                                ? "text-red-700 bg-red-100"
                                : "bg-gray-100 text-gray-700"
                        }`}
                >
                    {record.withdrawal_status}
                </p>
            </div>
            <div className="mt-3 space-y-2">
                <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Balance</span>
                    <span className="text-blue-700 font-semibold">₹{record.balance}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Type</span>
                    <span className="text-gray-800 font-medium">{record.type}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Time</span>
                    <span className="text-gray-800 font-medium">{record.time}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Order Number</span>
                    <span className="text-gray-800 font-medium flex items-center space-x-2">
                        <span className='break-all text-[12px] sm:text-base sm:text-auto'>{record._id.toUpperCase()}</span>
                        <button onClick={handleCopy} className="text-gray-600">
                            {copiedState ? (
                                <FaClipboardCheck className="text-green-600" />
                            ) : (
                                <FaClipboard />
                            )}
                        </button>
                    </span>
                </div>
                {record.remark && (
                    <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Remark</span>
                        <span className="text-gray-800 font-medium">{record.remark}</span>
                    </div>
                )}
            </div>
        </li>
    );
};

export default Withdraw;
