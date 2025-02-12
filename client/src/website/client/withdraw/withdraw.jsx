import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Footer from '../components/footer/footer';
import axios from 'axios'
import ProcessBgBlack from '../components/processBgBlack/processBgBlack';
import { useNavigate } from 'react-router-dom'
import Pagination from '../components/pagination/pagination';

const Withdraw = ({ setShowBottomAlert_state, setAvailableBalance_forNavBar_state }) => {
    const [withdraw_amount_state, setWithdraw_amount_state] = useState(0);
    let [data_process_state, setData_process_state] = useState(false);
    let [submit_process_state, setSubmit_process_state] = useState(false);
    const navigation = useNavigate();
    const [currentPage_state, setCurrentPage_state] = useState(1);
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
    const handleCopy = (e) => {
        const textToCopy = e.target.parentElement.children[0].innerText;
        navigator.clipboard.writeText(textToCopy).then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Copied!',
                text: 'Text has been copied to clipboard.',
                timer: 1000,
                showConfirmButton: false,
            });
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
                available_amount: (parseFloat(response.data.msg.withdrawable_amount || 0) + parseFloat(response.data.msg.deposit_amount || 0)).toFixed(3)  // Calculate and update available_amount
            }));
            setAvailableBalance_forNavBar_state((parseFloat(response.data.msg.withdrawable_amount || 0) + parseFloat(response.data.msg.deposit_amount || 0)).toFixed(3))
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

    function handelDeposit_to_withdrawal() {
        let dataBase_balance_convert_patch = async (balanceToConvert) => {
            setSubmit_process_state(true);
            try {
                const response = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/userWithdraw/userBalanceConvertPatch`, { balance: balanceToConvert }, {
                    withCredentials: true,
                });

                if (response.status === 200) {
                    fetchData()
                    Swal.fire({
                        title: "Success!",
                        text: "Your balance has been successfully converted.",
                        icon: "success",
                        timer: 5000,
                        timerProgressBar: true,
                        didOpen: () => {
                            Swal.showLoading();
                        }
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
        }

        // Show input prompt with the current balance displayed
        Swal.fire({
            title: "Are you sure?",
            text: `You currently have ₹${balanceData_state.deposit_amount} in your deposit wallet. Enter the amount you want to convert.`,
            icon: "warning",
            input: 'text',
            inputLabel: 'Enter the amount you want to convert',
            inputPlaceholder: 'Enter amount',
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Convert it!",
            footer: `<span style="color: gray;">Note: A 5% conversion charge will be deducted from the amount you enter.</span>`
        }).then((result) => {
            if (result.isConfirmed) {
                const balanceToConvert = parseFloat(result.value); // Convert input to a float

                // Validate if it's a number and greater than 0
                if (!isNaN(balanceToConvert) && balanceToConvert > 0) {
                    // Check if the entered amount is valid (less than or equal to available balance)
                    if (balanceToConvert <= balanceData_state.deposit_amount) {
                        // Calculate 5% charge
                        const charge = balanceToConvert * 0.05;
                        const finalAmount = balanceToConvert - charge;

                        // Show a confirmation with the breakdown of the charges
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
                                dataBase_balance_convert_patch(finalAmount);
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
                } else {
                    Swal.fire({
                        title: 'Invalid Amount',
                        text: "Please enter a valid positive amount to convert.",
                        icon: "error"
                    });
                }
            }
        });
    }

    let dataBase_post_newWithdrawal = async (obj) => {
        setSubmit_process_state(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/userWithdraw/userWithdrawal_record_post`, obj, {
                withCredentials: true
            });

            if (response.status === 200) {
                fetchData();
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
        // Check if payment info is bound
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

        // Check if withdrawal amount is above the minimum
        const selectedMethod = balanceData_state.withdrawal_methodsData.find((value) => value.withdrawal_method === balanceData_state.withdrawal_method);
        if (parseFloat(withdraw_amount_state) < parseFloat(selectedMethod.minimum_amount)) {
            return Swal.fire({
                icon: 'warning',
                title: 'Invalid Amount',
                timerProgressBar: 5000,
                text: `The minimum withdrawal amount for ${selectedMethod.withdrawal_method} is ₹${selectedMethod.minimum_amount}. Please enter a valid amount.`
            });
        }

        // Check if withdrawal amount exceeds available balance
        if (parseFloat(withdraw_amount_state) > parseFloat(balanceData_state.withdrawable_amount)) {
            return Swal.fire({
                icon: 'warning',
                title: 'Insufficient Balance',
                text: `Your withdrawal amount exceeds your available balance of ₹${balanceData_state.withdrawable_amount}. Please enter a valid amount.`
            });
        }

        // Show confirmation dialog to the user
        Swal.fire({
            title: 'Are you sure?',
            text: `You are about to withdraw ₹${withdraw_amount_state} via ${balanceData_state.withdrawal_method}. Do you want to proceed?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Withdraw',
            cancelButtonText: 'No, Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                // Proceed with the withdrawal if user confirms
                dataBase_post_newWithdrawal({ balance: withdraw_amount_state, type: balanceData_state.withdrawal_method });
            }
        });
    };

    const withdrawArray = balanceData_state.withdrawal_Records.reverse()
    const itemsPerPage = 5
    const indexOfLastReferral = currentPage_state * itemsPerPage;
    const indexOfFirstReferral = indexOfLastReferral - itemsPerPage;
    const currentReferrals = withdrawArray?.slice(indexOfFirstReferral, indexOfLastReferral);
    const totalPages = Math.ceil(withdrawArray?.length / itemsPerPage);

    return (
        <div className="ml-auto flex flex-col justify-between bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[94vh] mt-12">
            <div className='px-2 py-2'>
                <div className='text-2xl text-blue-600 font-semibold my-4 mx-2 select-none flex justify-between'>
                    Withdraw Amount
                </div>
                <div className="sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 mb-4 sm:space-y-0 space-y-5">
                    <div className="bg-teal-500 p-6 rounded-lg shadow-md text-white relative hover_on_image_with_div">
                        <div className="flex flex-col justify-between h-full">
                            <h3 className="text-3xl font-semibold">₹{balanceData_state.deposit_amount}</h3>
                            <p className="text-lg">Deposit Balance</p>
                        </div>
                        <div className="absolute top-4 right-4 text-4xl opacity-[0.2]">
                            <i className="fa-solid fa-credit-card hover_on_image"></i>
                        </div>
                    </div>
                    <div className="bg-teal-500 p-6 rounded-lg shadow-md text-white relative hover_on_image_with_div">
                        <div className="flex flex-col justify-between h-full">
                            <h3 className="text-3xl font-semibold">₹{balanceData_state.withdrawable_amount}</h3>
                            <p className="text-lg">Withdrawable Balance</p>
                        </div>
                        <div className="absolute top-4 right-4 text-4xl opacity-[0.2]">
                            <i className="fa-duotone fa-light fa-money-from-bracket hover_on_image"></i>
                        </div>
                    </div>
                    <div className="bg-cyan-500 p-6 rounded-lg hidden lg:block shadow-md text-white relative row-span-3 hover_on_image_with_div">
                        <div className="flex flex-col justify-center sm:items-center h-full">
                            <h3 className="text-3xl xl:text-4xl font-semibold">₹{
                                isNaN(parseFloat(balanceData_state.available_amount))
                                    ? (parseFloat(balanceData_state.deposit_amount) || parseFloat(balanceData_state.withdrawable_amount) || "0.000")
                                    : parseFloat(balanceData_state.available_amount).toFixed(3)
                            }
                            </h3>
                            <p className="text-lg">Available Balance</p>
                        </div>
                        <div className="absolute top-4 right-4 text-5xl opacity-[0.2]">
                            <i className="fa-solid fa-wallet hover_on_image"></i>
                        </div>
                    </div>
                    <div className="p-2 rounded-lg relative col-span-2 flex justify-center text-xl">
                        <button onClick={handelDeposit_to_withdrawal} className='bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white convertbtn_hover'><i className="fa-solid fa-rotate"></i> <span>Convert to withdrawable Balance</span></button>
                    </div>
                    <div className="bg-cyan-500 p-6 max-h-60 block lg:hidden rounded-lg shadow-md text-white relative row-span-3 hover_on_image_with_div">
                        <div className="flex flex-col justify-center sm:items-center h-full">
                            <h3 className="text-3xl font-semibold">₹{
                                isNaN(parseFloat(balanceData_state.available_amount))
                                    ? (parseFloat(balanceData_state.deposit_amount) || parseFloat(balanceData_state.withdrawable_amount) || "0.000")
                                    : parseFloat(balanceData_state.available_amount).toFixed(3)
                            }
                            </h3>
                            <p className="text-lg">Available Balance</p>
                        </div>
                        <div className="absolute top-4 right-4 text-7xl opacity-[0.2]">
                            <i className="fa-solid fa-wallet hover_on_image"></i>
                        </div>
                    </div>
                    <div className="bg-red-500 p-6 rounded-lg shadow-md text-white relative hover_on_image_with_div">
                        <div className="flex flex-col justify-between h-full">
                            <h3 className="text-3xl font-semibold">₹{balanceData_state.pending_withdrawal_amount}</h3>
                            <p className="text-lg">Pending Withdrawn</p>
                        </div>
                        <div className="absolute top-4 right-4 text-4xl opacity-[0.2]">
                            <i className="fa fa-share hover_on_image"></i>
                        </div>
                    </div>
                    <div className="bg-green-500 p-6 rounded-lg shadow-md text-white relative hover_on_image_with_div">
                        <div className="flex flex-col justify-between h-full">
                            <h3 className="text-3xl font-semibold">₹{balanceData_state.total_withdrawal_amount}</h3>
                            <p className="text-lg">Total Withdraw</p>
                        </div>
                        <div className="absolute top-4 right-4 text-4xl opacity-[0.2]">
                            <i className="fa-solid fa-indian-rupee-sign hover_on_image"></i>
                        </div>
                    </div>
                </div>
                <div className='px-5'>
                    <input
                        type="text" // "number" type ka default behavior issue create kar sakta hai
                        value={withdraw_amount_state}
                        onFocus={() => setWithdraw_amount_state('')}
                        onBlur={() => setWithdraw_amount_state((prev) => prev === '' ? '0' : prev)}
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, ''); // Only digits (0-9) allowed
                            setWithdraw_amount_state(val);
                        }}
                        required
                        className="block w-full my-3 pl-10 py-2 px-3 outline-none text-blue-600 no-arrows rounded-md rupees_symbol bg-no-repeat"
                    />
                    <div className='space-x-5 flex justify-center'>
                        <button onClick={() => handleUserWithdrawals()} className='w-full py-2 bg-green-600 text-white'>Withdraw Now</button>
                        <button onClick={() => setWithdraw_amount_state(0)} className='w-full py-2 bg-red-600 text-white'>Clear</button>
                    </div>
                </div>
                <div className='bg-white my-5 pb-5 rounded-xl border border-green-800'>
                    <p className='text-center text-lg my-3'>Withdraw Instructions</p>
                    <hr className='w-[95%] m-auto border' />
                    <ul className='px-6 mt-2'>
                        <li className='blue-right-list-image'>If the transfer time is up, please fill out the form again.</li>
                        <li className='blue-right-list-image'>The transfer amount must match the order you create, otherwise the money connot be credited successfully.</li>
                        <li className='blue-right-list-image'>If you transfer the wrong amount, our company will not be respnsible for the lost amount!</li>
                        <li className='blue-right-list-image'>Note: do not cancel the deposit order after the money has been transferred.</li>
                    </ul>
                </div>
                <div className='my-5 pb-5'>
                    <p className='text-center text-lg my-3'>Withdraw History</p>
                    <hr className='m-auto border border-gray-300 shadow-lg' />
                    <ul className='mt-4 space-y-4'>
                        {
                            currentReferrals?.map((record, index) => (
                                <li key={index} className='bg-white px-3 py-5 rounded-lg shadow-md text-[14px] sm:text-[16px]'>
                                    <div className='flex justify-between'>
                                        <p className='px-3 cursor-pointer py-1 rounded-md text-white bg-red-500'>Withdraw</p>
                                        <p className={`font-bold ${record.withdrawal_status === 'Pending' ? 'text-yellow-500' :
                                            record.withdrawal_status === 'Success' ? 'text-green-600' :
                                                record.withdrawal_status === 'Reject' ? 'text-red-600' : ''
                                            }`}>{record.withdrawal_status}</p>
                                    </div>

                                    <div className='mt-2'>
                                        <div className='flex justify-between px-2'>
                                            <span className='text-gray-500 font-medium'>Balance</span>
                                            <span className='text-blue-600 font-medium'>₹{record.balance}</span>
                                        </div>
                                        <div className='flex justify-between px-2'>
                                            <span className='text-gray-500 font-medium'>Type</span>
                                            <span className='text-gray-500 font-medium'>{record.type}</span>
                                        </div>
                                        <div className='flex justify-between px-2'>
                                            <span className='text-gray-500 font-medium'>Time</span>
                                            <span className='text-gray-500 font-medium'>{record.time}</span>
                                        </div>
                                        <div className='flex justify-between px-2'>
                                            <span className='text-gray-500 font-medium'>Order number</span>
                                            <span className='text-gray-500 font-medium space-x-1'>
                                                <span>{record._id.toUpperCase()}</span>
                                                <i onClick={(e) => {
                                                    handleCopy(e)
                                                    e.target.className = 'fa-solid fa-clipboard cursor-pointer'
                                                    setTimeout(() => {
                                                        e.target.className = 'fa-regular fa-clipboard cursor-pointer'
                                                    }, 2000);
                                                }} className="fa-regular fa-clipboard cursor-pointer"></i>
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                    {currentReferrals.length === 0 && <div className='h-48 rounded-lg flex items-center justify-center'>
                        No Record
                    </div>}
                </div>
                {totalPages > 1 && <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage_state}
                    onPageChange={setCurrentPage_state}
                />}
            </div>
            {(data_process_state || submit_process_state) && <ProcessBgBlack />}
            <div className='mt-3'>
                <Footer />
            </div>
        </div >
    );
}

export default Withdraw;
