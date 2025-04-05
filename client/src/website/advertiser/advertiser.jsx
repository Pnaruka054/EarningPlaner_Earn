import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { FaInfoCircle, FaPause, FaPlay, FaPlus, FaTrash } from 'react-icons/fa';
import Empity_box from '../../assets/empty-box.png';
import showNotificationWith_timer from '../components/showNotificationWith_timer';
import showNotification from '../components/showNotification';
import ProcessBgSeprate from '../components/processBgSeprate/processBgSeprate';
import ProcessBgBlack from '../components/processBgBlack/processBgBlack';
import Pagination from '../components/pagination/pagination';
import Footer from '../components/footer/footer';
import Swal from 'sweetalert2';
import { encryptData } from '../components/encrypt_decrypt_data';

const Advertiser = ({ setAvailableBalance_forNavBar_state }) => {
    // Main loading state
    const [data_process_state, setData_process_state] = useState(true);
    // All fetched data
    const [all_data_state, setAll_data_state] = useState({});
    // Pagination state
    const [currentPage_state, setCurrentPage_state] = useState(1);
    const navigation = useNavigate();

    // Filters state
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterType, setFilterType] = useState("All");
    const [filterKeyword, setFilterKeyword] = useState("");

    // Fetch data from the server
    const fetchData = async () => {
        setData_process_state(true);
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/advertiserRoute/advertiserDataGet`,
                { withCredentials: true }
            );
            setAll_data_state(response?.data?.msg);
            setAvailableBalance_forNavBar_state(response?.data?.msg?.userAvailableBalance);
        } catch (error) {
            console.error(error);
            if (
                error?.response?.data?.jwtMiddleware_token_not_found_error ||
                error?.response?.data?.jwtMiddleware_user_not_found_error
            ) {
                navigation('/login');
            } else if (error?.response?.data?.jwtMiddleware_error) {
                showNotificationWith_timer(
                    true,
                    'Your session has expired. Please log in again.',
                    '/login',
                    navigation
                );
            } else {
                showNotification(true, "Something went wrong, please try again.");
            }
        } finally {
            setData_process_state(false);
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

    // Sample stats from fetched data
    const stats = [
        { title: 'Total campaigns', value: all_data_state?.total_campaigns || 0 },
        { title: 'Active', value: all_data_state?.active_campaigns || 0 },
        { title: 'Paused', value: all_data_state?.paused_campaigns || 0 },
        { title: 'Remaining views', value: all_data_state?.remaining_views || 0 },
    ];

    // Filtering campaigns based on Status, Type, and Keyword (on title)
    const filteredCampaigns = all_data_state?.advertiserData
        ? all_data_state.advertiserData.filter(campaign => {
            const statusMatch =
                filterStatus === "All" ||
                (filterStatus === "Active" && campaign.status.toLowerCase() === "active") ||
                (filterStatus === "Paused" && campaign.status.toLowerCase() !== "active");

            const typeMatch =
                filterType === "All" ||
                (campaign.campaignType &&
                    campaign.campaignType.toLowerCase() === filterType.toLowerCase());

            const keywordMatch =
                filterKeyword.trim() === "" ||
                (campaign.step_2_title &&
                    campaign.step_2_title.toLowerCase().includes(filterKeyword.toLowerCase()));

            return statusMatch && typeMatch && keywordMatch;
        })
        : [];

    const advertiserDataArray = [...filteredCampaigns];
    const itemsPerPage = 6;
    const indexOfLast = currentPage_state * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const current_index = advertiserDataArray?.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(advertiserDataArray?.length / itemsPerPage);


    const handleInfo = (campaign) => {
        Swal.fire({
            title: 'Campaign Details',
            html: `
        <div style="text-align: left;">
          <p><strong>Title:</strong> ${campaign.step_2_title}</p>
          <p><strong>Description:</strong> ${campaign.step_2_description}</p>
          <p><strong>URL:</strong> <a href="${campaign.step_2_url}" target="_blank" rel="noopener noreferrer" style="color: #38a169;">${campaign.step_2_url}</a></p>
          <p><strong>Type:</strong> ${campaign.campaignType}</p>
          <p><strong>Duration:</strong> ${campaign.step_3_duration_for_user} sec</p>
          <p><strong>Views:</strong> ${campaign.completed_total_views} / ${campaign.step_3_total_views}</p>
          <p><strong>Spend:</strong> ${campaign.spend} / ${campaign.step_4_subTotal}</p>
          <p><strong>Interval:</strong> ${campaign.step_3_interval_in_hours} hours</p>
          <p><strong>Daily Limit:</strong> ${campaign.step_3_enableLimit ? campaign.step_3_limitViewsPerDay + ' views' : 'No limit'}</p>
          <p><strong>Status:</strong> ${campaign.status}</p>
          <p><strong>Time:</strong> ${campaign.time}</p>
        </div>
      `,
            width: '600px',
            confirmButtonText: 'OK'
        });
    };

    const handleCampaignAction = async (campaign, action) => {
        const actionTextMap = {
            paused: "pause",
            active: "activate",
            delete: "delete"
        };

        const confirmResult = await Swal.fire({
            title: `Are you sure you want to ${actionTextMap[action]} this campaign?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Yes, ${actionTextMap[action]} it!`
        });

        if (!confirmResult.isConfirmed) return;

        setData_process_state(true);

        try {
            const encryptedObj = await encryptData({
                clientMsg: action,
                _id: campaign._id,
            });

            const response = await axios.patch(
                `${import.meta.env.VITE_SERVER_URL}/advertiserRoute/advertiserCampaign_paused_active_patch`,
                { encryptedObj },
                { withCredentials: true }
            );
            if (response.data.success) {
                let successMsg = "";
                if (action === "paused") {
                    successMsg = "Campaign paused successfully!";
                } else if (action === "active") {
                    successMsg = "Campaign activated successfully!";
                } else if (action === "delete") {
                    successMsg = "Campaign deleted successfully!";
                }

                showNotification(false, successMsg);

                if (action !== "delete") {
                    setAll_data_state((prev) => {
                        const updatedAdvertiserData = prev.advertiserData.map((item) =>
                            item._id === campaign._id ? { ...item, status: action } : item
                        );

                        let activeCount = prev.active_campaigns;
                        let pausedCount = prev.paused_campaigns;

                        const prevStatus = prev.advertiserData.find((item) => item._id === campaign._id)?.status;

                        if (action === "paused" && prevStatus === "active") {
                            activeCount--;
                            pausedCount++;
                        } else if (action === "active" && prevStatus === "paused") {
                            activeCount++;
                            pausedCount--;
                        }

                        return {
                            ...prev,
                            advertiserData: updatedAdvertiserData,
                            active_campaigns: Math.max(0, activeCount),
                            paused_campaigns: Math.max(0, pausedCount),
                        };
                    });
                } else {
                    setAll_data_state((prev) => {
                        const deletedCampaign = prev.advertiserData.find(
                            (item) => item._id === campaign._id
                        );

                        let active = prev.active_campaigns;
                        let paused = prev.paused_campaigns;

                        if (deletedCampaign.status === "active") {
                            active--;
                        } else if (deletedCampaign.status === "paused") {
                            paused--;
                        }

                        return {
                            ...prev,
                            advertiserData: prev.advertiserData.filter(
                                (item) => item._id !== campaign._id
                            ),
                            active_campaigns: active,
                            paused_campaigns: paused,
                            total_campaigns: prev.total_campaigns - 1,
                            remaining_views:
                                prev.remaining_views -
                                (campaign.step_3_total_views - campaign.completed_total_views),
                            userDepositBalance: parseFloat(response?.data?.msg?.userDepositBalance || 0).toFixed(3),
                        };
                    });
                }
            }
        } catch (error) {
            console.error(error);
            if (
                error?.response?.data?.jwtMiddleware_token_not_found_error ||
                error?.response?.data?.jwtMiddleware_user_not_found_error
            ) {
                navigation("/login");
            } else if (error?.response?.data?.jwtMiddleware_error) {
                showNotificationWith_timer(
                    true,
                    "Your session has expired. Please log in again.",
                    "/login",
                    navigation
                );
            } else {
                showNotification(true, "Something went wrong, please try again.");
            }
        } finally {
            setData_process_state(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>EarnWiz - Your Campaigns</title>
                <meta
                    name="description"
                    content="Manage your ad campaigns with ease on EarnWiz. Track active, pending campaigns, set budgets, and optimize your advertising strategy efficiently."
                />
            </Helmet>

            {data_process_state ? (
                <div className="ml-auto flex flex-col justify-between bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[93.3dvh] mt-[6.7dvh]">
                    <ProcessBgSeprate />
                </div>
            ) : (
                <div className="ml-auto flex flex-col bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[93.3dvh] mt-[6.7dvh] custom-scrollbar">
                    <div className="px-4 py-2">
                        {/* Header & Deposit Balance */}
                        <div className="flex justify-between items-center">
                            <div className="text-2xl text-blue-600 font-semibold my-4 select-none">
                                Your Campaigns
                            </div>
                        </div>

                        {/* Create Button */}
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                            <Link
                                to="/member/advertiser/create"
                                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
                            >
                                <FaPlus className="mr-2" /> Create
                            </Link>
                            <div className='sm:mt-0 mt-3'>
                                <span className="font-medium text-gray-700">Deposit Balance:</span>
                                <span className="ml-2 text-2xl font-bold text-green-600">
                                    ₹{all_data_state?.userDepositBalance || 0}
                                </span>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            {stats.map((stat, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg shadow-md border">
                                    <p className="text-gray-500">{stat.title}</p>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Filters Section */}
                        <div className="bg-white p-4 rounded-lg shadow-md flex flex-wrap gap-4 items-center mb-6">
                            <select
                                className="border rounded-lg px-4 py-2"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="All">Status: All</option>
                                <option value="Active">Status: Active</option>
                                <option value="Paused">Status: Paused</option>
                            </select>
                            <select
                                className="border rounded-lg px-4 py-2"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="All">Type: All</option>
                                <option value="window">Type: Window</option>
                                <option value="iframe">Type: iFrame</option>
                                <option value="youtube">Type: Youtube</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Enter keyword"
                                value={filterKeyword}
                                onChange={(e) => setFilterKeyword(e.target.value)}
                                className="border rounded-lg px-4 py-2 w-full md:w-auto"
                            />
                        </div>

                        {/* Campaigns Display as Cards */}
                        {current_index && current_index.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {current_index.map((campaign, index) => (
                                    <div
                                        key={index}
                                        className="bg-white p-4 rounded-lg border flex flex-col justify-between"
                                    >
                                        {/* Card Header */}
                                        <div className="mb-2">
                                            <h3
                                                className="text-lg font-semibold text-gray-800 truncate"
                                                title={campaign.step_2_title}
                                            >
                                                {campaign.step_2_title}
                                            </h3>
                                        </div>

                                        {/* Key Information */}
                                        <div className="space-y-1 text-gray-700 text-sm">
                                            <div className="flex justify-between">
                                                <span className="font-medium">Type:</span>
                                                <span>{campaign.campaignType}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium">Status:</span>
                                                <span>{campaign.status}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium">Spend:</span>
                                                <span>
                                                    {campaign.spend} / {campaign.step_4_subTotal}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium">Views:</span>
                                                <span>
                                                    {campaign.completed_total_views} / {campaign.step_3_total_views}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium">Time:</span>
                                                <span>{campaign.time}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-3 flex justify-between space-x-3">
                                            <button
                                                onClick={() => handleInfo(campaign)}
                                                aria-label="View Info"
                                                title="View Info"
                                            >
                                                <FaInfoCircle className="text-blue-500 text-xl hover:scale-110 transition-transform" />
                                            </button>

                                            {campaign.status === "active" ? (
                                                <button
                                                    onClick={() => handleCampaignAction(campaign, "paused")}
                                                    aria-label="Pause Campaign"
                                                    title="Pause Campaign"
                                                >
                                                    <FaPause className="text-yellow-500 text-xl hover:scale-110 transition-transform" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleCampaignAction(campaign, "active")}
                                                    aria-label="Activate Campaign"
                                                    title="Activate Campaign"
                                                >
                                                    <FaPlay className="text-green-500 text-xl hover:scale-110 transition-transform" />
                                                </button>
                                            )}

                                            <button
                                                onClick={() => handleCampaignAction(campaign, "delete")}
                                                aria-label="Delete Campaign"
                                                title="Delete Campaign"
                                            >
                                                <FaTrash className="text-red-500 text-xl hover:scale-110 transition-transform" />
                                            </button>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 rounded-lg flex flex-col items-center justify-center min-h-32 border">
                                <img
                                    src={Empity_box}
                                    draggable="false"
                                    alt="No data"
                                    className="w-16 h-16 mb-4"
                                />
                                <p className="text-gray-500">There is no data</p>
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="flex justify-center mt-6">
                            {totalPages > 1 && (
                                <Pagination
                                    totalPages={totalPages}
                                    currentPage={currentPage_state}
                                    onPageChange={setCurrentPage_state}
                                />
                            )}
                        </div>
                    </div>

                    {/* Processing Overlay */}
                    {data_process_state && <ProcessBgBlack />}

                    {/* Footer */}
                    <div className="mt-3">
                        <Footer />
                    </div>
                </div>
            )}
        </>
    );
};

export default Advertiser;
