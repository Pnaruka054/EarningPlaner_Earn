import React, { useEffect, useState } from "react";
import ProcessBgBlack from "../../components/processBgBlack/processBgBlack";
import Footer from "../../components/footer/footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const ClickShortedLink = ({ setAvailableBalance_forNavBar_state }) => {
    const [data_process_state, setData_process_state] = useState(false);
    const [shortLinks, setShortLinks] = useState([]);
    const navigation = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setData_process_state(true);
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/userIncomeRoute/user_shortlink_data_get`,
                    { withCredentials: true }
                );
                console.log(response);
                setAvailableBalance_forNavBar_state(response.data.userAvailableBalance);
                setShortLinks(response.data.shortedLinksData);
            } catch (error) {
                console.log(error);
                if (
                    error.response?.data?.jwtMiddleware_token_not_found_error ||
                    error.response?.data?.jwtMiddleware_user_not_found_error
                ) {
                    navigation("/login");
                } else if (error.response?.data?.jwtMiddleware_error) {
                    Swal.fire({
                        title: "Session Expired",
                        text: "Your session has expired. Please log in again.",
                        icon: "error",
                        timer: 5000,
                        timerProgressBar: true,
                        confirmButtonText: "OK",
                        didClose: () => {
                            navigation("/login");
                        },
                    });
                }
            } finally {
                setData_process_state(false);
            }
        };
        fetchData();
    }, []);

    // 🔄 **Update Link Status & Show Swal**
    const user_linkClick_patch = async (shortnerDomain) => {
        try {
            const origin = `${window.location.origin}`;
            const response = await axios.patch(
                `${import.meta.env.VITE_SERVER_URL}/userIncomeRoute/user_shortlink_firstPage_data_patch`,
                { shortnerDomain, endPageRoute: import.meta.env.VITE_CLICK_SHORTEN_LINK_ENDPAGE_ROUTE, clientOrigin: origin },
                { withCredentials: true }
            );
            return response
        } catch (error) {
            console.error("Error updating link status:", error);
            return error
        }
    };

    const handelLink_click = async (link) => {
        try {
            const response = await user_linkClick_patch(link.shortnerDomain); // ✅ API call ka response wait karein

            if (!response || response.error) {
                throw new Error("API request failed"); // ✅ Agar response me error ho to manually error throw karein
            }
            console.log(response);
            window.open(response.data.data.shortUrl, "_blank"); // ✅ Sirf successful API response pe open karein
        } catch (error) {
            console.error("Error processing link click:", error);

            Swal.fire({
                title: "❌ Error!",
                text: "Failed to record your click. Please try again!",
                icon: "error",
                timer: 3000,
                timerProgressBar: true,
                confirmButtonText: "OK",
            });
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

    // 🔢 **Summary Calculations**
    const totalLinks = shortLinks.length;
    const completedLinks = shortLinks.filter((link) => link.isDisable).length;
    const pendingLinks = totalLinks - completedLinks;
    const totalEarnings = shortLinks
        .reduce((acc, link) => acc + (parseFloat(link.amount) || 0), 0)
        .toFixed(2);
    const earnedSoFar = shortLinks
        .filter((link) => link.isDisable)
        .reduce((acc, link) => acc + (parseFloat(link.amount) || 0), 0)
        .toFixed(2);

    return (
        <div className="ml-auto flex flex-col justify-between bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[94vh] mt-12">
            <div className="px-2 py-2">
                <div className="text-2xl text-blue-600 font-semibold my-4 mx-2 select-none flex justify-between">
                    View Ads to Earn
                </div>
                <div className="px-4 py-2">
                    <div className="bg-white shadow-md p-6 rounded-lg text-center mb-5">
                        <h2 className="text-xl font-semibold text-gray-800">💰 Earnings Summary</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4 text-gray-700">
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <span className="font-semibold">Total Earning:</span>
                                <span className="text-green-600 font-bold ml-2">₹ {totalEarnings}</span>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <span className="font-semibold">Earned So Far:</span>
                                <span className="text-green-600 font-bold ml-2">₹ {earnedSoFar}</span>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <span className="font-semibold">Total Links:</span>
                                <span className="text-blue-600 font-bold ml-2">{totalLinks}</span>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <span className="font-semibold">Completed:</span>
                                <span className="text-gray-600 font-bold ml-2">{completedLinks}</span>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <span className="font-semibold">Pending:</span>
                                <span className="text-red-500 font-bold ml-2">{pendingLinks}</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4">
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

            <Footer />

            {data_process_state && <ProcessBgBlack />}
        </div>
    );
};

export default ClickShortedLink;
