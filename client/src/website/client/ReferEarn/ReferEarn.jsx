import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../components/footer/footer';

const ReferEarn = () => {
    const [currentPage_state, setCurrentPage_state] = useState(1);
    const [referralRecords_state, setReferralRecords] = useState([
        {
            username: "1",
            income: "0",
            date: "658476"
        },
        {
            username: "2",
            income: "0",
            date: "658476"
        },
        {
            username: "3",
            income: "41",
            date: "658476"
        },
        {
            username: "4",
            income: "20",
            date: "658476"
        },
        {
            username: "5",
            income: "50",
            date: "658476"
        },
    ]);
    const linksPerPage = 10;

    const indexOfLastReferral = currentPage_state * linksPerPage;
    const indexOfFirstReferral = indexOfLastReferral - linksPerPage;
    const currentReferrals = referralRecords_state.slice(indexOfFirstReferral, indexOfLastReferral);
    const totalPages = Math.ceil(referralRecords_state.length / linksPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage_state(pageNumber);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Link copied to clipboard!');
        }).catch((err) => {
            console.error('Error copying text: ', err);
        });
    };

    // const referralLink = `${window.location.origin}/signup/ref/${userData.userName}`;
    const referralLink = `${window.location.origin}/signup/ref/sdfgsdfgfdg`;

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
                        <pre className="bg-gray-100 p-2 rounded-md text-gray-800 font-bold">{referralLink}</pre>
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
                                {currentReferrals.map((referral, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-2 border-l">{referral.username}</td>
                                        <td className="px-4 py-2">{referral.income}</td>
                                        <td className="px-4 py-2">{referral.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-4 flex justify-center">
                        <ul className="flex space-x-2">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <li key={index}>
                                    <button
                                        className={`px-4 py-2 rounded-md ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"} hover:bg-blue-600 hover:text-white`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handlePageChange(index + 1);
                                        }}
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <div className='mt-3'>
                <Footer />
            </div>
        </div>
    )
};

export default ReferEarn;
