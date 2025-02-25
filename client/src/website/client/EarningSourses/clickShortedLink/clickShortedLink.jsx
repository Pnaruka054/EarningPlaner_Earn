import React, { useEffect, useState } from "react";
import ProcessBgBlack from "../../components/processBgBlack/processBgBlack";
import Footer from "../../components/footer/footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import showNotificationWith_timer from "../../components/showNotificationWith_timer";
import showNotification from "../../components/showNotification";
import ProcessBgSeprate from '../../components/processBgSeprate/processBgSeprate'
import CountdownTimer from "../../components/countDownTimer/countDownTimer";

const ClickShortedLink = ({ setAvailableBalance_forNavBar_state }) => {
    const [data_process_state, setData_process_state] = useState(false);
    const [shortLinks, setShortLinks] = useState([]);
    const [viewAds_firstTimeLoad_state, setViewAds_firstTimeLoad_state] = useState([]);
    const navigation = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setData_process_state(true);
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/userIncomeRoute/user_shortlink_data_get`,
                    { withCredentials: true }
                );
                setAvailableBalance_forNavBar_state(response.data.msg.userAvailableBalance);
                setShortLinks(response.data.msg.shortedLinksData);
                setViewAds_firstTimeLoad_state(response.data.msg)
            } catch (error) {
                console.log(error);
                if (
                    error.response?.data?.jwtMiddleware_token_not_found_error ||
                    error.response?.data?.jwtMiddleware_user_not_found_error
                ) {
                    navigation("/login");
                } else if (error.response?.data?.jwtMiddleware_error) {
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

    // 🔄 **Update Link Status & Show Swal**
    const user_linkClick_patch = async (obj) => {
        try {
            setData_process_state(true);
            const origin = `${window.location.origin}`;
            const response = await axios.patch(
                `${import.meta.env.VITE_SERVER_URL}/userIncomeRoute/user_shortlink_firstPage_data_patch`,
                { shortnerDomain: obj.shortnerDomain, endPageRoute: import.meta.env.VITE_CLICK_SHORTEN_LINK_ENDPAGE_ROUTE, clientOrigin: origin },
                { withCredentials: true }
            );
            setViewAds_firstTimeLoad_state((prev) => ({
                ...prev,
                pendingEarnings: (parseFloat(prev.pendingEarnings || 0) - parseFloat(obj.amount || 0)).toFixed(3),
                today_shortLinkIncome: (parseFloat(prev.today_shortLinkIncome || 0) + parseFloat(obj.amount || 0)).toFixed(3),
                totalLinks: (parseFloat(prev.totalLinks || 0) - 1),
                completedClick: (parseFloat(prev.completedClick || 0) + 1),
                pendingClick: (parseFloat(prev.pendingClick || 0) - 1)
            }))
            return response
        } catch (error) {
            console.error("Error updating link status:", error);
            return error
        } finally {
            setData_process_state(false);
        }
    };

    const handelLink_click = async (link) => {
        try {
            const response = await user_linkClick_patch(link); // ✅ API call ka response wait karein

            if (!response || response.error) {
                throw new Error("API request failed"); // ✅ Agar response me error ho to manually error throw karein
            }
            console.log(response);
            window.location.href = response.data.shortedLink;
        } catch (error) {
            console.error("Error processing link click:", error);
            if (
                error.response?.data?.jwtMiddleware_token_not_found_error ||
                error.response?.data?.jwtMiddleware_user_not_found_error
            ) {
                navigation("/login");
            } else if (error.response?.data?.jwtMiddleware_error) {
                showNotificationWith_timer(true, 'Your session has expired. Please log in again.', '/login', navigation);
            } else if (error.response?.data?.error_msg) {
                showNotification(true, error.response?.data?.error_msg);
            } else {
                showNotification(true, "Something went wrong, please try again.");
            }
        }
    };

    // 🕒 **Time Formatter Function**
    const formatTime = (timeString) => {
        if (!timeString) return "N/A";
        let [value, unit] = timeString.split(" ");
        if (unit === "m") return `${value} min`;
        if (unit === "s") return `${value} sec`;
        return timeString;
    };

    if (data_process_state) {
        return (
            <div className="ml-auto flex flex-col justify-between  bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[94vh] mt-12">
                <ProcessBgSeprate />
            </div>
        )
    }
    return (
        <div className="ml-auto flex flex-col justify-between bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[94vh] mt-12">
            <div className="px-2 py-2">
                <div className="text-2xl text-blue-600 font-semibold my-4 mx-2 select-none flex justify-between">
                    View Ads to Earn
                </div>
                <div className="px-4 py-2">
                    <div className="bg-white shadow-md p-6 rounded-lg text-center mb-5">
                        <h2 className="text-xl font-semibold text-gray-800 mb-5">💰 Earnings Summary</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4 text-gray-700">
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <div className="font-semibold">Pending Earnings:</div>
                                <div className="text-red-500 font-bold ml-2">₹{viewAds_firstTimeLoad_state.pendingEarnings}</div>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <div className="font-semibold">Today Earnings:</div>
                                <div className="text-green-600 font-bold ml-2">₹{viewAds_firstTimeLoad_state.today_shortLinkIncome}</div>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <div className="font-semibold">Total Links:</div>
                                <div className="text-blue-600 font-bold ml-2">{viewAds_firstTimeLoad_state.totalLinks}</div>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <div className="font-semibold">Completed:</div>
                                <div className="text-green-600 font-bold ml-2">{viewAds_firstTimeLoad_state.completedClick}</div>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <div className="font-semibold">Pending:</div>
                                <div className="text-red-500 font-bold ml-2">{viewAds_firstTimeLoad_state.pendingClick}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4 relative">
                        {/* Timer Overlay */}
                        <div className={`${viewAds_firstTimeLoad_state.click_short_link_expireTimer ? 'flex' : 'hidden'} absolute z-[1] inset-0 bg-white bg-opacity-70 justify-center items-start`}>
                            <div className="flex flex-col items-center text-3xl sm:text-6xl font-semibold mt-20">
                                <div className="text-center">Come Back After</div>
                                <div className="text-5xl sm:text-7xl font-bold text-red-600 drop-shadow">
                                    <CountdownTimer expireTime={viewAds_firstTimeLoad_state.click_short_link_expireTimer} />
                                </div>
                            </div>
                        </div>
                        {shortLinks.length === 0 ? (
                            <p className="text-center text-gray-500 py-5">🚫 No short links available at the moment.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {shortLinks.map((link, index) => (
                                    <div
                                        key={index}
                                        className={`p-4 border rounded-lg shadow-sm transition transform ${link.isDisable ? "bg-gray-200 opacity-70" : "bg-white"
                                            }`}
                                    >
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {link.shortName || "Short Link"}
                                        </h3>
                                        <p className="text-sm text-gray-600 truncate">{link.shortnerDomain}</p>

                                        {/* 🕒 Time Show Here */}
                                        <p className="text-gray-700 mt-2">
                                            <span className="font-semibold">⏳ Time Required:</span>
                                            <span className="ml-2 text-blue-600 font-bold">{formatTime(link.time)}</span>
                                        </p>

                                        <div className="flex justify-between mt-3 items-center">
                                            <span className="text-blue-500 font-bold">₹ {link.amount || "0.00"}</span>
                                            <button
                                                disabled={link.isDisable}
                                                onClick={() => handelLink_click(link)}
                                                className={`px-4 py-2 text-white text-sm font-semibold rounded-md transition transform ${link.isDisable
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "bg-blue-500 hover:bg-blue-600 hover:scale-105"
                                                    }`}
                                            >
                                                {link.isDisable ? "✅ Completed" : "👉 Visit & Earn"}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className='mt-3'>
                <Footer />
            </div>
        </div>
    );
};

export default ClickShortedLink;
