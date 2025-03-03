import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/footer/footer';
import ProcessBgBlack from '../components/processBgBlack/processBgBlack';
import showNotification from '../components/showNotification'

const GiftCode = ({ setAvailableBalance_forNavBar_state }) => {
    const [giftCode_state, setGiftCode_state] = useState('');
    const [data_process_state, setData_process_state] = useState(false);
    const [claimHistory_state, setClaimHistory_state] = useState([]);
    const [giftCode_page_Message_state, setGiftCode_page_Message_state] = useState("");
    const navigation = useNavigate();

    const fetchData = async () => {
        setData_process_state(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/userIncomeRoute/user_giftCode_get`, {
                withCredentials: true
            });
            setGiftCode_page_Message_state(response?.data?.msg?.giftCode_page_Message)
            setClaimHistory_state(response?.data?.msg?.userGiftCode_claim_history);
            setAvailableBalance_forNavBar_state(response?.data?.msg?.userAvailableBalance);
        } catch (error) {
            console.error(error);
            if (error?.response?.data?.jwtMiddleware_token_not_found_error || error?.response.data?.jwtMiddleware_user_not_found_error) {
                navigation('/login');
            } else if (error?.response?.data?.jwtMiddleware_error) {
                showNotificationWith_timer(true, 'Your session has expired. Please log in again.', '/login', navigation);
            } else {
                showNotification(true, "Something went wrong, please try again.");
            }
        } finally {
            setData_process_state(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const handleClaim = async () => {
        if (giftCode_state.trim() !== '') {
            setData_process_state(true);
            try {
                const response = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/userIncomeRoute/user_giftCode_verify_and_patch`, { giftCode_state }, {
                    withCredentials: true
                });
                fetchData()
                showNotification(false, response?.data?.msg);
            } catch (error) {
                console.error(error);
                if (error?.response?.data?.jwtMiddleware_token_not_found_error || error?.response.data?.jwtMiddleware_user_not_found_error) {
                    navigation('/login');
                } else if (error?.response?.data?.jwtMiddleware_error) {
                    showNotificationWith_timer(true, 'Your session has expired. Please log in again.', '/login', navigation);
                } else if (error?.response?.data?.error_msg) {
                    showNotification(true, error?.response?.data?.error_msg);
                } else {
                    showNotification(true, "Something went wrong, please try again.");
                }
            } finally {
                setData_process_state(false);
            }
        }
    };

    return (
        <div className="ml-auto flex flex-col justify-between  bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[93.3dvh] custom-scrollbar mt-12">
            <div className='bg-[#ecf0f5] flex flex-col items-center'>
                {/* Engaging Top Banner */}
                <div className="w-full bg-gradient-to-r from-blue-100 to-blue-200 py-8 px-4 text-center" dangerouslySetInnerHTML={{ __html: giftCode_page_Message_state }} />

                {/* Input and Claim Bonus Section */}
                <div className="w-full max-w-md mt-8">
                    <input
                        type="text"
                        value={giftCode_state}
                        onChange={(e) => setGiftCode_state(e.target.value)}
                        placeholder="Enter your gift code"
                        className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleClaim}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors duration-200"
                    >
                        Claim Bonus
                    </button>
                </div>

                {/* Divider Line */}
                <div className="w-full max-w-md mt-8 border-t border-gray-300"></div>

                {/* Claim History Section */}
                <div className="w-full max-w-md mt-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-blue-700 mb-4 text-center">
                        Claim History
                    </h2>
                    {claimHistory_state.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-6 border">
                            <ion-icon name="gift-outline" className="w-16 h-16 text-blue-400 mb-4"></ion-icon>
                            <p className="text-center text-blue-600 text-base font-semibold">
                                No claim history available.
                            </p>
                            <p className="text-center text-sm text-blue-500 mt-1">
                                Redeem a gift code to see your bonus history.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {claimHistory_state.map((claim, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-3 rounded-lg shadow flex flex-col justify-between"
                                >
                                    <p className="text-sm font-semibold text-gray-800">
                                        Code: {claim.giftCode_state}
                                    </p>
                                    <p className="text-xs text-gray-600">Bonus: ₹{claim.bonusAmount}</p>
                                    <p className="text-xs text-gray-500">
                                        {claim.time}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className='pt-5'>
                <Footer />
            </div>
            {data_process_state && <ProcessBgBlack />}
        </div>
    );
};

export default GiftCode;
