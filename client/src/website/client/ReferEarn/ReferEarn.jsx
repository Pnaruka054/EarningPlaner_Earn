import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import Footer from '../components/footer/footer';
import ProcessBgBlack from '../components/processBgBlack/processBgBlack';
import Pagination from '../components/pagination/pagination';

const ReferEarn = ({ setAvailableBalance_forNavBar_state }) => {
    const [currentPage_state, setCurrentPage_state] = useState(1);
    const [referralRecords_state, setReferralRecords] = useState([]);
    let [data_process_state, setData_process_state] = useState(false);
    const navigation = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setData_process_state(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/userRoute/userReferral_record_get`, {
                    withCredentials: true
                });
                setReferralRecords(response.data.msg);
                setAvailableBalance_forNavBar_state(response.data.msg.available_balance);
            } catch (error) {
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
                console.error(error);
            } finally {
                setData_process_state(false);
            }
        };

        fetchData();
    }, []);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Link copied to clipboard!');
        }).catch((err) => {
            console.error('Error copying text: ', err);
        });
    };

    const itemsPerPage = 5
    const indexOfLastReferral = currentPage_state * itemsPerPage;
    const indexOfFirstReferral = indexOfLastReferral - itemsPerPage;
    const currentReferrals = referralRecords_state.referral_data?.slice(indexOfFirstReferral, indexOfLastReferral);
    const totalPages = Math.ceil(referralRecords_state.referral_data?.length / itemsPerPage);

    const referralLink = `${window.location.origin}/signup/ref/${referralRecords_state.userName}`;

    return (
        <div className="ml-auto flex flex-col justify-between bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[94vh] mt-12">
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
                            className="btn btn-outline-primary text-sm bg-blue-500 hover:bg-blue-600 text-white rounded p-2"
                            onClick={() => copyToClipboard(referralLink)}
                        >
                            <i className="fa fa-copy"></i>
                        </button>
                    </div>
                </div>

                <div className="mt-6">
                    <div className="overflow-x-auto rounded-lg shadow bg-white">
                        <table className="min-w-full table-auto border-collapse text-left">
                            <thead>
                                <tr className="text-gray-700">
                                    <th className="px-4 py-2 border-l border-t border-b">Username</th>
                                    <th className="px-4 py-2 border-t border-b">Income</th>
                                    <th className="px-4 py-2 border-t border-b">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentReferrals?.map((referral, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-2 border-l">{referral.userName}</td>
                                        <td className="px-4 py-2">₹{referral.income || '0.000'}</td>
                                        <td className="px-4 py-2">{referral.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {totalPages > 1 && <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage_state}
                    onPageChange={setCurrentPage_state}
                />}
            </div>
            {data_process_state && <ProcessBgBlack />}
            <div className='mt-3'>
                <Footer />
            </div>
        </div>
    )
};

export default ReferEarn;
