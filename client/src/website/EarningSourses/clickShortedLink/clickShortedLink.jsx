import React, { useEffect, useState } from "react";
import ProcessBgBlack from "../../components/processBgBlack/processBgBlack";
import Footer from "../../components/footer/footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setItemWithExpiry, getItemWithExpiry } from '../../components/handle_localStorage'
import showNotificationWith_timer from "../../components/showNotificationWith_timer";
import showNotification from "../../components/showNotification";
import ProcessBgSeprate from '../../components/processBgSeprate/processBgSeprate'
import CountdownTimer from "../../components/countDownTimer/countDownTimer";

const ClickShortedLink = ({ setAvailableBalance_forNavBar_state }) => {
    const [data_process_state, setData_process_state] = useState(false);
    const [shortLinks, setShortLinks] = useState([]);
    const [shortLink_firstTimeLoad_state, setShortLink_firstTimeLoad_state] = useState([]);
    const [filter_state, setFilter_state] = useState("all")
    const navigation = useNavigate();
    const [isChecked_state, setIsChecked_state] = useState(true);

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
                setShortLink_firstTimeLoad_state(response.data.msg)
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

            setShortLink_firstTimeLoad_state((prev) => ({
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
            window.location.href = response.data.shortUrl || response.data.existingRecord.shortUrl;
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

    const filteredLinks = shortLinks
        .filter(link => {
            if (filter_state === "available") return !link.isDisable;
            if (filter_state === "completed") return link.isDisable;
            return true;
        })
        .sort((a, b) => {
            if (filter_state === "high-to-low") return b.amount - a.amount;
            if (filter_state === "low-to-high") return a.amount - b.amount;
            return 0;
        });

    // for handle sound
    useEffect(() => {
        const soundStart = getItemWithExpiry("sound");

        if (soundStart) {
            setIsChecked_state(false);
        } else {
            setIsChecked_state(true);
        }
    }, []);

    useEffect(() => {
        if (!isChecked_state) {
            setItemWithExpiry("sound", "false", 2880); // Store for 48 hrs
        } else {
            localStorage.removeItem("sound"); // Remove if switched ON
        }
    }, [isChecked_state]);

    const userClickHandle = () => setIsChecked_state((prev) => !prev);

    if (data_process_state) {
        return (
            <div className="ml-auto flex flex-col justify-between  bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[93.3dvh] mt-12">
                <ProcessBgSeprate />
            </div>
        )
    }
    return (
        <div className="ml-auto flex flex-col justify-between bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[93.3dvh] custom-scrollbar mt-12">
            <div className="px-2 py-2">
                <div className="text-2xl text-blue-600 font-semibold my-4 mx-2 select-none flex justify-between">
                    Click Shorten Links
                </div>
                <div className='flex -mb-2 justify-center'>
                    <div className='bg-purple-700 px-2 py-1 pt-2 shadow font-bold text-white rounded-t-2xl'>
                        <label className="inline-flex items-center cursor-pointer gap-2">
                            <input
                                type="checkbox"
                                checked={isChecked_state}
                                onChange={() => setIsChecked_state((prev) => {
                                    userClickHandle(!prev)
                                    return !prev
                                })}
                                className="sr-only peer"
                            />
                            <div className="relative w-10 h-5 bg-gray-300 rounded-full transition-all duration-300 peer-checked:bg-[#00E676]">
                                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-md ${isChecked_state ? "translate-x-5" : ""}`}></div>
                            </div>
                            <span className="text-sm font-medium text-white">
                                Sound: {isChecked_state ? "On" : "Off"}
                            </span>
                        </label>
                    </div>
                </div>
                <div className="px-4 py-2">
                    <div className="bg-white shadow-md p-6 rounded-lg text-center mb-5">
                        <h2 className="text-xl font-semibold text-gray-800 mb-5">💰 Earnings Summary</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4 text-gray-700">
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <div className="font-semibold">Pending Earnings:</div>
                                <div className="text-red-500 font-bold ml-2">₹{shortLink_firstTimeLoad_state.pendingEarnings}</div>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <div className="font-semibold">Today Earnings:</div>
                                <div className="text-green-600 font-bold ml-2">₹{shortLink_firstTimeLoad_state.today_shortLinkIncome}</div>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <div className="font-semibold">Total Links:</div>
                                <div className="text-blue-600 font-bold ml-2">{shortLink_firstTimeLoad_state.totalLinks}</div>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <div className="font-semibold">Completed:</div>
                                <div className="text-green-600 font-bold ml-2">{shortLink_firstTimeLoad_state.completedClick}</div>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <div className="font-semibold">Pending:</div>
                                <div className="text-red-500 font-bold ml-2">{shortLink_firstTimeLoad_state.pendingClick}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4 relative">
                        {/* Timer Overlay */}
                        <div className={`${shortLink_firstTimeLoad_state.click_short_link_expireTimer ? 'flex' : 'hidden'} absolute z-[1] inset-0 bg-white bg-opacity-70 justify-center items-start`}>
                            <div className="flex flex-col items-center text-3xl sm:text-6xl font-semibold mt-20">
                                <div className="text-center">Come Back After</div>
                                <div className="text-5xl sm:text-7xl font-bold text-red-600 drop-shadow">
                                    <CountdownTimer expireTime={shortLink_firstTimeLoad_state.click_short_link_expireTimer} />
                                </div>
                            </div>
                        </div>
                        {shortLinks.length === 0 ? (
                            <p className="text-center text-gray-500 py-5">🚫 No short links available at the moment.</p>
                        ) : (
                            <div>
                                <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto scrollbar-hide p-2">
                                    <button
                                        className={`px-3 py-1 border rounded whitespace-nowrap ${filter_state === "all" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                                        onClick={() => setFilter_state("all")}
                                    >
                                        All
                                    </button>
                                    <button
                                        className={`px-3 py-1 border rounded whitespace-nowrap ${filter_state === "available" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                                        onClick={() => setFilter_state("available")}
                                    >
                                        Available
                                    </button>
                                    <button
                                        className={`px-3 py-1 border rounded whitespace-nowrap ${filter_state === "completed" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                                        onClick={() => setFilter_state("completed")}
                                    >
                                        Completed
                                    </button>
                                    <button
                                        className={`px-3 py-1 border rounded whitespace-nowrap ${filter_state === "high-to-low" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                                        onClick={() => setFilter_state("high-to-low")}
                                    >
                                        High to Low ₹
                                    </button>
                                    <button
                                        className={`px-3 py-1 border rounded whitespace-nowrap ${filter_state === "low-to-high" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                                        onClick={() => setFilter_state("low-to-high")}
                                    >
                                        Low to High ₹
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredLinks.map((link, index) => (
                                        <div
                                            key={index}
                                            className={`p-4 border rounded-lg shadow-sm transition transform ${link?.isDisable ? "bg-gray-200 opacity-70" : "bg-white"
                                                }`}
                                        >
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                {link.shortName || "Short Link"}
                                            </h3>
                                            <p className="text-sm text-gray-600 truncate">{link?.shortnerDomain}</p>

                                            {/* 🕒 Time Show Here */}
                                            <p className="text-gray-700 mt-2">
                                                <span className="font-semibold">⏳ Time Required:</span>
                                                <span className="ml-2 text-blue-600 font-bold">{formatTime(link?.time)}</span>
                                            </p>

                                            <div className="flex justify-between mt-3 items-center">
                                                <span className="text-blue-500 font-bold">₹ {link?.amount || "0.00"}</span>
                                                <button
                                                    disabled={link?.isDisable}
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
                            </div>
                        )}
                    </div>
                </div>
                {/* adsterra Native Banner start */}
                <div id="container-f2e76b1a9af84306102d9f8675c030e8"></div>
                {/* adsterra Native Banner End*/}
                <div className='bg-white rounded shadow px-5 py-2'>
                    <p className='text-center text-xl font-medium drop-shadow-[0_0_0.5px_blue] text-blue-600'>View Ads Instructions</p>
                    <hr className='mt-2 border' />
                    <ul className='mt-4 font-medium text-gray-500 drop-shadow-sm space-y-4'>
                        {
                            shortLink_firstTimeLoad_state?.other_data_shortLink_instructions?.map((value, index) => <li key={index} className='instruction-list-image' dangerouslySetInnerHTML={{ __html: value }}></li>)
                        }
                    </ul>
                </div>
            </div>
            <div className='mt-3'>
                <Footer />
            </div>
        </div>
    );
};

export default ClickShortedLink;
