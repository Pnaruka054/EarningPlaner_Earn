import React, { useEffect, useState } from 'react';
import Pagination from '../components/pagination/pagination';
import ProcessBgBlack from '../components/processBgBlack/processBgBlack';
import Footer from '../components/footer/footer';
import { FaClipboard, FaClipboardCheck, FaCreditCard, FaRupeeSign, FaSync, FaWallet } from 'react-icons/fa';
import ProcessBgSeprate from '../components/processBgSeprate/processBgSeprate';
import { Helmet } from 'react-helmet';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { encryptData } from '../components/encrypt_decrypt_data';

const BalanceConverter = ({ setAvailableBalance_forNavBar_state }) => {
    const [convert_amount_state, setConvert_amount_state] = useState(0);
    const [data_process_state, setData_process_state] = useState(false);
    const [submit_process_state, setSubmit_process_state] = useState(false);
    const [conversionType_state, setConversionType_state] = useState("");
    const [errorOn_conversionType_state, setErrorOn_conversionType_state] = useState(false);
    const [balanceData_state, setBalanceData_state] = useState({
        withdrawable_amount: '0.000',
        deposit_amount: '0.000',
        available_amount: '0.000',
        convertAmount_Records: [],
        other_data_convertBalance_instructions: []
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
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/userAmount/userConvertBalance_get`, {
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

    function handelDeposit_to_withdrawal() {
        let dataBase_balance_convert_patch = async (balanceToConvert, charge, conversionType_state) => {
            setSubmit_process_state(true);
            try {
                let obj = await encryptData({ balanceToConvert, charge, conversionType_state })
                const response = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/userAmount/userBalanceConvertPatch`, { obj }, {
                    withCredentials: true,
                });

                if (response.status === 200) {
                    await fetchData(true);
                    Swal.fire({
                        title: "Success!",
                        text: "Your balance has been successfully converted.",
                        icon: "success",
                    });
                } else {
                    Swal.fire({
                        title: "Error",
                        text: "There was an issue with the conversion process. Please try again later.",
                        icon: "error"
                    });
                }
            } catch (error) {
                console.error(error);
                Swal.fire({
                    title: "Error",
                    text: "Network error or server issue. Please try again later.",
                    icon: "error"
                });
            } finally {
                setSubmit_process_state(false);
            }
        };

        const balanceToConvert = parseFloat(convert_amount_state);
        if (!isNaN(balanceToConvert) && balanceToConvert > 0) {
            if (!conversionType_state) {
                setErrorOn_conversionType_state(true)
            } else if (conversionType_state === "depositToWithdraw") {
                if (balanceToConvert <= balanceData_state.deposit_amount) {
                    const charge = balanceToConvert * 0.05;
                    const finalAmount = balanceToConvert - charge;
                    Swal.fire({
                        title: "Conversion Details",
                        html: `
                                You are converting ₹${balanceToConvert}<br>
                                Conversion Charge (5%): ₹${charge.toFixed(2)}<br>
                                Final Amount after Charges: ₹${finalAmount.toFixed(2)}<br>
                                Are you sure you want to proceed with this conversion?`,
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonText: "Yes, Convert it!",
                        cancelButtonText: "Cancel"
                    }).then((confirmationResult) => {
                        if (confirmationResult.isConfirmed) {
                            setErrorOn_conversionType_state(false)
                            dataBase_balance_convert_patch(balanceToConvert, charge, conversionType_state);
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Insufficient Balance',
                        timerProgressBar: true,
                        text: `Your requested amount exceeds your deposit balance of ₹${balanceData_state.deposit_amount}. Please enter a valid amount.`
                    });
                }
            } else if (conversionType_state === "withdrawToDeposit") {
                if (balanceToConvert <= balanceData_state.withdrawable_amount) {
                    Swal.fire({
                        title: "Are you sure?",
                        text: `Convert ₹${balanceToConvert} to Daposit balance?`,
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, Convert it!",
                        cancelButtonText: "Cancel"
                    }).then((confirmationResult) => {
                        if (confirmationResult.isConfirmed) {
                            setErrorOn_conversionType_state(false)
                            dataBase_balance_convert_patch(balanceToConvert, 0, conversionType_state);
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Insufficient Balance',
                        timerProgressBar: true,
                        text: `Your requested amount exceeds your withdrawable balance of ₹${balanceData_state.withdrawable_amount}. Please enter a valid amount.`
                    });
                }
            }
        } else {
            Swal.fire({
                title: 'Invalid Amount',
                text: "Please enter a valid positive amount to convert.",
                icon: "error"
            });
        }
    }

    const convertBalanceArray = [...balanceData_state.convertAmount_Records].reverse();
    const itemsPerPage = 5;
    const indexOfLast = currentPage_state * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const current_index = convertBalanceArray?.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(convertBalanceArray?.length / itemsPerPage);

    return (
        <>
            <Helmet>
                <title>EarnWiz Member Balance Converter</title>
                <meta name="description" content="Convert your earnings or deposit balance securely via our member convert balance page. Process your requests quickly and track your converted amount history effortlessly on EarnWiz." />
            </Helmet>
            {data_process_state ? (
                <div className="ml-auto flex flex-col justify-between bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[93.3dvh] mt-[6.7dvh]">
                    <ProcessBgSeprate />
                </div>
            ) : (
                <div className="ml-auto flex flex-col justify-between bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[93.3dvh] mt-[6.7dvh] custom-scrollbar">
                    <div className='px-2 py-2'>
                        <div className='text-2xl text-blue-600 font-semibold my-4 mx-2 select-none flex justify-between'>
                            Balance Converter
                        </div>
                        <div className="sm:grid grid-cols-2 gap-4 mt-5 mb-4 sm:space-y-0 space-y-5">
                            <div className="bg-teal-500 p-6 rounded-lg shadow-md text-white relative">
                                <div className="flex flex-col justify-between h-full">
                                    <h3 className="text-3xl font-semibold">₹{balanceData_state?.deposit_amount || 0.000}</h3>
                                    <p className="text-lg">Deposit Balance</p>
                                </div>
                                <div className="absolute top-4 right-4 text-4xl opacity-[0.2]">
                                    <FaCreditCard className="text-5xl" />
                                </div>
                            </div>
                            <div className="bg-teal-500 p-6 rounded-lg shadow-md text-white relative">
                                <div className="flex flex-col justify-between h-full">
                                    <h3 className="text-3xl font-semibold">₹{balanceData_state?.withdrawable_amount || 0.000}
                                    </h3>
                                    <p className="text-lg">Withdrawable Balance</p>
                                </div>
                                <div className="absolute top-4 right-4 text-4xl opacity-[0.2]">
                                    <FaRupeeSign className="text-6xl" />
                                </div>
                            </div>
                        </div>
                        <div className='px-5'>
                            <div className='text-center'>
                                {errorOn_conversionType_state && <p className='text-red-500 text-base'>* Please Select one of them</p>}
                                <div className="flex justify-center space-x-4 mb-4">
                                    <div className={`bg-gray-200 p-1 rounded-full flex ${errorOn_conversionType_state ? "outline outline-red-500" : ''}`}>
                                        <button
                                            className={`py-2 px-6 rounded-full font-semibold transition-all duration-300 ${conversionType_state === "withdrawToDeposit"
                                                ? "bg-yellow-600 text-white shadow-md"
                                                : "bg-transparent text-gray-600 hover:bg-gray-300"
                                                }`}
                                            onClick={() => {
                                                setConversionType_state("withdrawToDeposit");
                                                setErrorOn_conversionType_state(false);
                                            }}
                                        >
                                            Withdraw to Deposit
                                        </button>
                                        <button
                                            className={`py-2 px-6 rounded-full font-semibold transition-all duration-300 ${conversionType_state === "depositToWithdraw"
                                                ? "bg-yellow-600 text-white shadow-md"
                                                : "bg-transparent text-gray-600 hover:bg-gray-300"
                                                }`}
                                            onClick={() => {
                                                setConversionType_state("depositToWithdraw");
                                                setErrorOn_conversionType_state(false);
                                            }}
                                        >
                                            Deposit to Withdraw
                                        </button>
                                    </div>
                                </div>

                            </div>

                            <input
                                type="text"
                                value={convert_amount_state}
                                onFocus={() => setConvert_amount_state('')}
                                onBlur={() => setConvert_amount_state((prev) => prev === '' ? '0' : prev)}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[^0-9]/g, '');
                                    setConvert_amount_state(val);
                                }}
                                required
                                className="block w-full my-3 pl-10 py-2 px-3 outline-none text-blue-600 no-arrows rounded-md rupees_symbol bg-no-repeat"
                            />
                            <div className='space-x-5 flex justify-center'>
                                <button onClick={handelDeposit_to_withdrawal} className='w-full py-2 bg-green-600 text-white'>Convert Now</button>
                                <button onClick={() => {
                                    setConvert_amount_state(0)
                                    setConversionType_state("")
                                    setErrorOn_conversionType_state(false)
                                }} className='w-full py-2 bg-red-600 text-white'>Clear</button>
                            </div>
                        </div>
                        <div className='bg-white my-5 pb-5 rounded-xl border border-green-800'>
                            <p className='text-center text-xl font-bold my-4'>Convert Amount Instructions</p>
                            <hr className='w-[95%] m-auto border' />
                            <ul className='px-6 mt-2 space-y-4'>
                                {
                                    balanceData_state?.other_data_convertBalance_instructions?.map((value, index) => <li key={index} className='blue-right-list-image' dangerouslySetInnerHTML={{ __html: value }} />)
                                }
                            </ul>
                        </div>
                        <div className="my-5 pb-5">
                            <p className="text-center text-xl font-bold my-4">Converted Amount History</p>
                            <hr className="mx-auto w-11/12 border border-gray-300" />
                            <ul className="mt-6 space-y-4">
                                {current_index?.map((record, index) => (
                                    <ConvertRow
                                        key={index}
                                        record={record}
                                    />
                                ))}
                            </ul>
                            {current_index.length === 0 && (
                                <div className="text-center h-32 flex items-center justify-center text-gray-500 font-semibold">
                                    🚫 No Balance Convert Yet
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
}

const ConvertRow = ({ record }) => {
    const [copiedState, setCopiedState] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(record._id.toUpperCase());
        setCopiedState(true);
        setTimeout(() => setCopiedState(false), 2000);
    };

    return (
        <li className="bg-gray-50 p-4 rounded-lg shadow-md">
            <div className="mt-3 space-y-2">
                <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Balance</span>
                    <span className="text-blue-700 font-semibold">₹{parseFloat(record?.converted_amount)?.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Changes</span>
                    <span className="text-red-700 font-semibold">₹{parseFloat(record?.charges)?.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Recived Amount</span>
                    <span className="text-green-700 font-semibold">₹{(parseFloat(record?.converted_amount) - parseFloat(record?.charges))?.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Type</span>
                    <span className="text-gray-800 font-medium">{record?.converted_amount_type}</span>
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
            </div>
        </li>
    );
};

export default BalanceConverter;
