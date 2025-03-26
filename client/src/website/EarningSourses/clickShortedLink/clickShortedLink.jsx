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
import { Helmet } from 'react-helmet';
import { encryptData } from '../../components/encrypt_decrypt_data'

const ClickShortedLink = ({ setAvailableBalance_forNavBar_state }) => {
    const [data_process_state, setData_process_state] = useState(false);
    const [shortLinks_state, setShortLinks_state] = useState([]);
    const [shortLink_firstTimeLoad_state, setShortLink_firstTimeLoad_state] = useState([]);
    const [filter_state, setFilter_state] = useState("all")
    const navigation = useNavigate();
    const [isChecked_state, setIsChecked_state] = useState(true);

    const fetchData = async () => {
        setData_process_state(true);
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/userIncomeRoute/user_shortlink_data_get`,
                { withCredentials: true }
            );
            setAvailableBalance_forNavBar_state(response.data.msg.userAvailableBalance);
            function shuffleArray(array) {
                let shuffled = array.slice();
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
                return shuffled;
            }

            const randomizedData = shuffleArray(response.data.msg.shortedLinksData);
            setShortLinks_state(randomizedData);

            setShortLink_firstTimeLoad_state(response.data.msg)
        } catch (error) {
            console.error(error);
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

    // 🔄 **Update Link Status & Show Swal**
    const user_linkClick_patch = async (obj) => {
        try {
            const origin = `${window.location.origin}`;
            let obj_already = await encryptData({ shortnerDomain: obj.shortnerDomain, endPageRoute: import.meta.env.VITE_CLICK_SHORTEN_LINK_ENDPAGE_ROUTE, clientOrigin: origin })
            setData_process_state(true);
            const response = await axios.patch(
                `${import.meta.env.VITE_SERVER_URL}/userIncomeRoute/user_shortlink_firstPage_data_patch`,
                { obj_already },
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
            window.location.href = response?.data?.shortUrl || response?.data?.existingRecord?.shortUrl;
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

    const filteredLinks = shortLinks_state
        .filter(link => {
            if (filter_state === "available" || filter_state === "high-to-low" || filter_state === "low-to-high") return !link.isDisable;
            if (filter_state === "completed") return link.isDisable || !!link.expireTimer;
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

    return (
        <>
            <Helmet>
                <title>EarnWiz - Click Shorten Links & Earn</title>
                <meta name="description" content="Make money easily with EarnWiz by using shortened links. Check out our shorten links earnings page for a quick and effective way to earn." />
            </Helmet>
            {data_process_state ? (
                <div className="ml-auto flex flex-col justify-between bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[93.3dvh] mt-[6.7dvh]">
                    <ProcessBgSeprate />
                </div>
            ) : (
                <div className="ml-auto flex flex-col justify-between bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[93.3dvh] custom-scrollbar mt-[6.7dvh]">
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
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-4 text-gray-700">
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
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-4 relative">
                                {shortLinks_state.length === 0 ? (
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
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {filteredLinks.map((link, index) => (
                                                <div
                                                    key={index}
                                                    className={`p-4 border rounded-xl transition transform ${link?.isDisable ? "bg-gray-100 opacity-70" : "bg-white"}`}
                                                >

                                                    <h3 className="text-xl font-semibold text-gray-900 truncate">
                                                        {link.shortnerName || "Short Link"}
                                                    </h3>

                                                    {/* 🕒 Time Show Here */}
                                                    <p className="text-gray-600 mt-3 text-sm flex items-center gap-2">
                                                        <span className="font-semibold">⏳ Time Required:</span>
                                                        <span className="text-blue-600 font-bold text-base">
                                                            {formatTime(link?.time)}
                                                        </span>
                                                    </p>

                                                    <div className="flex justify-between items-center mt-4">
                                                        <span className="text-green-600 font-bold text-lg">
                                                            ₹ {link?.amount || "0.00"}
                                                        </span>

                                                        {link.how_to_complete && (
                                                            <a
                                                                href={link.how_to_complete}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 font-medium text-sm underline"
                                                            >
                                                                How to Complete?
                                                            </a>
                                                        )}
                                                    </div>

                                                    <button
                                                        disabled={link?.isDisable || link?.expireTimer}
                                                        onClick={() => handelLink_click(link)}
                                                        className={`w-full mt-4 py-2 text-white text-base font-semibold rounded-md transition ${link?.isDisable || link?.expireTimer
                                                            ? "bg-gray-400 cursor-not-allowed"
                                                            : "bg-blue-600"
                                                            }`}
                                                    >
                                                        {link.expireTimer ? (
                                                            <div>
                                                                <CountdownTimer expireTime={link.expireTimer} />
                                                            </div>
                                                        ) : link.isDisable ? (
                                                            <div>
                                                                ✅ Completed ({link?.completedClicks}/{link?.how_much_click_allow})
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                👉 Start & Earn ({link?.completedClicks}/{link?.how_much_click_allow})
                                                            </div>
                                                        )}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='bg-white rounded shadow px-5 py-2'>
                            <p className='text-center text-xl font-medium drop-shadow-[0_0_0.5px_blue] text-blue-600'>Click Shorten Links Instructions</p>
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
            )}
        </>
    );
};

export default ClickShortedLink;
