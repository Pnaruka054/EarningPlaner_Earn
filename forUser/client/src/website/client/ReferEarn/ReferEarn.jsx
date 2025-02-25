import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import Footer from '../components/footer/footer';
import ProcessBgBlack from '../components/processBgBlack/processBgBlack';
import Pagination from '../components/pagination/pagination';
import { FaClipboard, FaClipboardCheck } from "react-icons/fa";
import showNotificationWith_timer from '../components/showNotificationWith_timer';
import showNotification from '../components/showNotification';
import ProcessBgSeprate from '../components/processBgSeprate/processBgSeprate'
 
const ReferEarn = ({ setAvailableBalance_forNavBar_state }) => {
    const [currentPage_state, setCurrentPage_state] = useState(1);
    const [referralRecords_state, setReferralRecords] = useState([]);
    let [data_process_state, setData_process_state] = useState(false);
    const navigation = useNavigate();
    const [copied_state, setCopied_state] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setData_process_state(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/userRoute/userReferral_record_get`, {
                    withCredentials: true
                });
                setReferralRecords(response?.data?.msg);
                setAvailableBalance_forNavBar_state(response?.data?.msg?.available_balance);
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

        fetchData();
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied_state(true);
        setTimeout(() => setCopied_state(false), 2000);
    };

    const itemsPerPage = 5
    const indexOfLastReferral = currentPage_state * itemsPerPage;
    const indexOfFirstReferral = indexOfLastReferral - itemsPerPage;
    const currentReferrals = referralRecords_state.referral_data?.slice(indexOfFirstReferral, indexOfLastReferral);
    const totalPages = Math.ceil(referralRecords_state.referral_data?.length / itemsPerPage);

    const referralLink = `${window.location.origin}/signup/ref/${referralRecords_state.userName}`;

    if (data_process_state) {
        return (
            <div className="ml-auto flex flex-col justify-between  bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[93.3dvh] mt-12">
                <ProcessBgSeprate />
            </div>
        )
    }
    return (
        <div className="ml-auto flex flex-col justify-between bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[93.3dvh] mt-12 custom-scrollbar">
            <div className='p-2'>
                <div className="text-2xl text-blue-600 font-semibold my-4 mx-2 select-none flex justify-between">
                    My Referrals
                </div>

                <div className="mt-6">
                    <div className="bg-blue-100 p-4 rounded mb-4">
                        <i className="fa fa-bullhorn"></i> [17-07-2023] Referral Earnings increased by 25%
                    </div>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <p className="text-gray-800 mb-4">
                        The DropLink.co | Earn money on short links referral program is a great way to spread the word of this great service and earn more money with your short links! Refer friends and receive 25% of their earnings for life!
                    </p>
                    <div className="flex items-center space-x-2">
                        <div className='overflow-auto bg-gray-100 p-2'>
                            <pre className="rounded-md text-gray-800 font-bold">{referralLink}</pre>
                        </div>
                        <button
                            className="btn btn-outline-primary text-sm bg-blue-500 hover:bg-blue-600 text-white rounded p-2 flex items-center"
                            onClick={copyToClipboard}
                        >
                            {copied_state ? <FaClipboardCheck size={18} /> : <FaClipboard size={18} />}
                        </button>
                    </div>
                </div>

                <div className="mt-6">
                    <div className="overflow-x-auto rounded-lg shadow bg-white">
                        {referralRecords_state.lenght === 0 || referralRecords_state.referral_data?.length === 0 ? (
                            <div className="text-center py-6 text-gray-500 font-medium h-[294px] flex justify-center items-center">
                                📉 No referrals found
                            </div>
                        ) : (
                            <table className="min-w-full table-auto border-collapse text-left">
                                <thead>
                                    <tr className="text-gray-700 bg-gray-100">
                                        <th className="px-4 py-3 border-l border-t border-b">Username</th>
                                        <th className="px-4 py-3 border-t border-b">Income</th>
                                        <th className="px-4 py-3 border-t border-b">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentReferrals?.map((referral, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="px-4 py-3 border-l">{referral.userName}</td>
                                            <td className="px-4 py-3 text-green-600 font-medium">
                                                ₹{referral.income || '0.000'}
                                            </td>
                                            <td className="px-4 py-3">{referral.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
                {totalPages > 1 && <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage_state}
                    onPageChange={setCurrentPage_state}
                />}
            </div>
            <div className='mt-3'>
                <Footer />
            </div>
        </div>
    )
};

export default ReferEarn;
