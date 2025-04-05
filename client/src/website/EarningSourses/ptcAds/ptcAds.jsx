import React, { useEffect, useRef, useState } from 'react';
import Footer from '../../components/footer/footer';
import ProcessBgBlack from '../../components/processBgBlack/processBgBlack';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import earningSound from '../../components/earningSound'
import CountdownTimer from '../../components/countDownTimer/countDownTimer';
import showNotificationWith_timer from '../../components/showNotificationWith_timer';
import showNotification from '../../components/showNotification';
import ProcessBgSeprate from '../../components/processBgSeprate/processBgSeprate';
import { setItemWithExpiry, getItemWithExpiry } from '../../components/handle_localStorage'
import { Helmet } from 'react-helmet';
import { encryptData } from '../../components/encrypt_decrypt_data';
import { FaRegEye, FaRegFrown, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { MdAccessTime } from "react-icons/md";
import { BiRupee } from "react-icons/bi";

const ViewAds = ({ setAvailableBalance_forNavBar_state }) => {
    const [handle_clickAds_btnClick_state, setHandle_clickAds_btnClick_state] = useState(false);
    const [currentBtnName_and_amount_storedValue_state, setCurrentBtnName_and_amount_storedValue_state] = useState([]);
    const [data_process_state, setData_process_state] = useState(false);
    const navigation = useNavigate();
    const [PTCAds_firstTimeLoad_state, setPTCAds_firstTimeLoad_state] = useState([]);
    const [originalTitle] = useState(document.title);
    const [isUserActiveOnPage, setIsUserActiveOnPage] = useState(false);
    const [totalTotalPTCAdsBtns_state, setTotalPTCAdsBtns_state] = useState([]);
    const channel = new BroadcastChannel("viewAds_channel");
    const [isChecked_state, setIsChecked_state] = useState(true);
    const [willCome_afterThis_time_state, setWillCome_afterThis_time_state] = useState("");

    // user active or not handler
    useEffect(() => {
        if (typeof document.hidden !== "undefined" && handle_clickAds_btnClick_state) {
            // Define the handler outside of the setTimeout, so it's available for cleanup.
            const handleVisibilityChange = () => {
                if (!document.hidden) {
                    setIsUserActiveOnPage(true);
                }
            };

            // Start a timer to add the event listener after 2 seconds.
            const timeoutId = setTimeout(() => {
                document.addEventListener("visibilitychange", handleVisibilityChange);
            }, 2000);

            // Cleanup: clear the timeout and remove the event listener.
            return () => {
                clearTimeout(timeoutId);
                document.removeEventListener("visibilitychange", handleVisibilityChange);
            };
        }
    }, [handle_clickAds_btnClick_state]);

    const fetchData = async (status = false) => {
        if (!status) {
            setData_process_state(true);
        }

        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/userIncomeRoute/user_PTCAds_home_get`, {
                withCredentials: true
            });
            console.log(response);
            setTotalPTCAdsBtns_state(response.data.msg.PTCAds_campaignsData);
            setPTCAds_firstTimeLoad_state(response.data.msg)
            setAvailableBalance_forNavBar_state(response.data.msg.userAvailableBalance)
            if (response.data.msg.willCome_afterThis_time) {
                setWillCome_afterThis_time_state(response.data.msg.willCome_afterThis_time)
            }
        } catch (error) {
            console.error(error);
            if (error.response.data.jwtMiddleware_token_not_found_error || error.response.data.jwtMiddleware_user_not_found_error) {
                navigation('/login');
            } else if (error.response.data.jwtMiddleware_error) {
                if (error.response.data.jwtMiddleware_token_not_found_error || error.response.data.jwtMiddleware_user_not_found_error) {
                    navigation('/login');
                } else if (error?.response?.data?.jwtMiddleware_error) {
                    showNotificationWith_timer(true, 'Your session has expired. Please log in again.', '/login', navigation);
                } else {
                    showNotification(true, "Something went wrong, please try again.");
                }
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

    const isUserActiveOnPageRef = useRef(isUserActiveOnPage);

    useEffect(() => {
        isUserActiveOnPageRef.current = isUserActiveOnPage;
    }, [isUserActiveOnPage]);

    // handle channel messages
    useEffect(() => {
        const handleMessage = (event) => {
            const { data } = event;
            if (data === "handle_clickAds_btnClick_state_true") {
                setHandle_clickAds_btnClick_state(true);
            } else if (data === "handle_clickAds_btnClick_state_false") {
                setHandle_clickAds_btnClick_state(false);
            } else if (data.includes("isSuccess")) {
                const [btnName, amount] = currentBtnName_and_amount_storedValue_state;
                let timer = 10;
                const countdownInterval = setInterval(() => {
                    timer--;
                    document.title = `Wait : ${timer}sec`;
                    if (timer <= 0) clearInterval(countdownInterval);
                }, 1000);

                setTimeout(() => {
                    if (!isUserActiveOnPageRef.current) {
                        channel.postMessage("handle_clickAds_btnClick_state_false");
                        if (btnName && amount) {
                            const obj = {
                                btnName,
                                btnClickEarn: amount,
                            };
                            clearInterval(countdownInterval)
                            user_adsView_income_patch(obj);
                        }
                    } else if (btnName && amount) {
                        setIsUserActiveOnPage(false);
                        setHandle_clickAds_btnClick_state(false);

                        clearInterval(countdownInterval)
                        Swal.fire({
                            icon: "error",
                            title: "Operation failed. Please try again.",
                            text: "Please stay on the new tab and do not reload / refresh it until the process is complete."
                        });
                        document.title = "❌ failed";
                        earningSound(isChecked_state, false);
                        let interval = setInterval(() => {
                            if (!document.hidden) {
                                document.title = originalTitle;
                                clearInterval(interval)
                            }
                        }, 1000);
                    }
                }, 9000);
            } else if (data.includes("isAbortFromWaitingPage")) {
                setIsUserActiveOnPage(true);
                setHandle_clickAds_btnClick_state(false);
                channel.postMessage("handle_clickAds_btnClick_state_false");

                Swal.fire({
                    icon: "error",
                    title: "Operation failed. Please try again.",
                    text: "Please do not close / reload new tab until You have clicked the Claim Bonus button."
                });

                document.title = "❌ failed";
                let interval = setInterval(() => {
                    if (!document.hidden) {
                        document.title = originalTitle;
                        clearInterval(interval)
                    }
                }, 1000);
                earningSound(isChecked_state, false);
            }
        };

        channel.onmessage = handleMessage;

        return () => {
            channel.removeEventListener("message", handleMessage);
            channel.close();
        };
    }, [PTCAds_firstTimeLoad_state, isUserActiveOnPage, currentBtnName_and_amount_storedValue_state]);

    const handle_link_click = (link, btnName, amount) => {
        setHandle_clickAds_btnClick_state(true);
        setIsUserActiveOnPage(false);
        channel.postMessage("handle_clickAds_btnClick_state_true");

        setTimeout(() => {
            let newTab1 = window.open(`/waitRedirecting/?link=${encodeURIComponent(link)}`, '_blank', 'noopener noreferrer');
            setCurrentBtnName_and_amount_storedValue_state([btnName, amount])
            if (newTab1) {
                setHandle_clickAds_btnClick_state(false);
                return Swal.fire({
                    icon: "error",
                    title: "Operation failed. Please try again!",
                    text: "Please Allow Popup in Your Browser to Earn Money!",
                });;
            }
        }, 100);
    };

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

    const handleToggleSound = () => setIsChecked_state((prev) => !prev);

    let user_adsView_income_patch = async (dataObj) => {
        setData_process_state(true);
        try {
            let obj = await encryptData(dataObj)
            const response = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/userIncomeRoute/user_PTCAds_income_patch`, { obj }, {
                withCredentials: true
            });
            Swal.fire({
                title: "Success!",
                icon: "success",
            });

            document.title = "✅ success!";
            let interval = setInterval(() => {
                if (!document.hidden) {
                    document.title = originalTitle;
                    clearInterval(interval)
                }
            }, 1000);

            earningSound(isChecked_state, true);
            setAvailableBalance_forNavBar_state(response.data.msg.userAvailableBalance)
            setPTCAds_firstTimeLoad_state((prev) => ({
                ...prev,
                today_PTCAdsIncome: (
                    parseFloat(prev.today_PTCAdsIncome || 0) +
                    parseFloat(dataObj.btnClickEarn || 0)
                ).toFixed(3),
                totalLinks: parseFloat(prev.totalLinks || 0) - 1,
                completedClick: parseFloat(prev.completedClick || 0) + 1,
            }));
            fetchData(true)

            setTotalPTCAdsBtns_state(prev =>
                prev.filter(item => String(item._id) !== String(dataObj.btnName))
            );

        } catch (error) {
            console.error(error);
            if (error.response.data.jwtMiddleware_token_not_found_error) {
                navigation('/login');
            } else if (error?.response?.data?.jwtMiddleware_error) {
                showNotificationWith_timer(true, 'Your session has expired. Please log in again.', '/login', navigation);
            } else if (error?.response?.data?.error_msg) {
                Swal.fire({
                    icon: "error",
                    title: "Operation failed. Please try again.",
                    text: error?.response?.data?.error_msg,
                });
                document.title = "❌ failed";
                earningSound(isChecked_state, false);
                setTimeout(() => {
                    document.title = originalTitle;
                }, 2000);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Operation failed. Please try again.",
                    text: "Something went wrong, please try again.",
                });
                document.title = "❌ failed";
                earningSound(isChecked_state, false);
                setTimeout(() => {
                    document.title = originalTitle;
                }, 2000);
            }

        } finally {
            setData_process_state(false);
            setHandle_clickAds_btnClick_state(false);
            setCurrentBtnName_and_amount_storedValue_state([]);
        }
    }

    const bannerAds = [
        {
            id: "banner-1",
            img: "https://cdn.coinzilla.io/creative/4a7f3c8ed43613eb309a299050333b1c.png",
            link: "https://example.com/banner1",
        },
        {
            id: "banner-2",
            img: "https://cdn.coinzilla.io/creative/4a7f3c8ed43613eb309a299050333b1c.png",
            link: "https://example.com/banner2",
        },
        {
            id: "banner-3",
            img: "https://cdn.coinzilla.io/creative/4a7f3c8ed43613eb309a299050333b1c.png",
            link: "https://example.com/banner3",
        },
    ];

    const [mixedList_state, setMixedList_state] = useState([]);

    useEffect(() => {
        const tempList = [];

        // अगर totalTotalPTCAdsBtns_state में एड्स 5 से कम हैं, तो सिर्फ़ एड्स डालें, कोई बैनर नहीं
        if (totalTotalPTCAdsBtns_state.length < 5) {
            totalTotalPTCAdsBtns_state.forEach((adItem) => {
                tempList.push({ type: "ad", data: adItem });
            });
            setMixedList_state(tempList);
            return;
        }

        // अगर एड्स 5 या अधिक हैं, तो बैनर भी डालें
        let bannerIndex = 0;
        totalTotalPTCAdsBtns_state.forEach((adItem, index) => {
            // 70% चांस पर पहले बैनर डालें (उदाहरण)
            if (bannerIndex < bannerAds.length && Math.random() > 0.7) {
                tempList.push({ type: "banner", data: bannerAds[bannerIndex] });
                bannerIndex++;
            }
            tempList.push({ type: "ad", data: adItem });
        });

        // अगर अभी भी बैनर बचे हैं, तो उन्हें random पोजीशन पर डाल दें
        while (bannerIndex < bannerAds.length) {
            const randomIndex = Math.floor(Math.random() * (tempList.length + 1));
            tempList.splice(randomIndex, 0, { type: "banner", data: bannerAds[bannerIndex] });
            bannerIndex++;
        }

        setMixedList_state(tempList);
    }, [totalTotalPTCAdsBtns_state]);

    // ---- Tabs (3 parts) के लिए state ----
    const [activeTab_state, setActiveTab_state] = useState("window");

    // जिस टैब पर हैं, उसी के Ads (type === "ad" && campaignType===activeTab_state) + सभी banner दिखें
    const filteredList = mixedList_state.filter((item) => {
        if (item.type === "ad") {
            // सिर्फ़ उसी campaignType के Ad
            return item.data.campaignType === activeTab_state;
        } else {
            // Banner हमेशा दिखे
            return true;
        }
    });

    return (
        <>
            <Helmet>
                <title>EarnWiz - View Ads & Earn Money</title>
                <meta
                    name="description"
                    content="Earn money by viewing ads on EarnWiz. Visit our view ads earnings page to quickly boost your income with minimal effort."
                />
            </Helmet>
            {data_process_state ? (
                <div className="ml-auto flex flex-col justify-between bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[93.3dvh] mt-[6.7dvh]">
                    <ProcessBgSeprate />
                </div>
            ) : (
                <div className="relative ml-auto flex flex-col justify-between bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[93.3dvh] custom-scrollbar mt-[6.7dvh]">
                    {/* Header Section with Sound Toggle */}
                    <div className="flex justify-between items-center p-3 bg-white shadow">
                        <h2 className="text-xl font-bold text-blue-600">View Ads</h2>
                        {/* Sound Toggle */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700 font-semibold">
                                Sound: {isChecked_state ? "On" : "Off"}
                            </span>
                            <button
                                onClick={handleToggleSound}
                                className="w-10 h-5 bg-gray-300 rounded-full flex items-center relative transition-all duration-300"
                            >
                                <div
                                    className={`absolute w-4 h-4 bg-white rounded-full shadow-md top-0.5 left-0.5 transform transition-all duration-300 ${isChecked_state ? "translate-x-5" : ""
                                        }`}
                                />
                            </button>
                            {isChecked_state ? (
                                <FaVolumeUp className="text-green-600" />
                            ) : (
                                <FaVolumeMute className="text-red-600" />
                            )}
                        </div>
                    </div>

                    {/* Earnings Summary */}
                    <div className="px-2 py-2">
                        <div className="bg-white p-4 sm:p-6 shadow-lg rounded-lg relative w-full mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-5">💰 Earnings Summary</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-gray-700">
                                <div className="bg-gray-100 p-3 rounded-lg">
                                    <div className="font-semibold">Today Earnings</div>
                                    <div className="text-green-600 font-bold ml-2">₹{PTCAds_firstTimeLoad_state.today_PTCAdsIncome || '0.000'}</div>
                                </div>
                                <div className="bg-gray-100 p-3 rounded-lg">
                                    <div className="font-semibold">Total Links</div>
                                    <div className="text-blue-600 font-bold ml-2">{PTCAds_firstTimeLoad_state.totalLinks || 0}</div>
                                </div>
                                <div className="bg-gray-100 p-3 rounded-lg">
                                    <div className="font-semibold">Completed</div>
                                    <div className="text-green-600 font-bold ml-2">{PTCAds_firstTimeLoad_state.completedClick}</div>
                                </div>
                            </div>
                        </div>

                        {/* Instructions / Notice */}
                        <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg shadow-md mb-4 text-center">
                            <span className="font-semibold">Important:</span> Click these
                            buttons and manually handle ads to earn money!
                        </div>

                        {/* --- 3 Tabs --- */}
                        <div className="flex justify-center space-x-4 mb-4">
                            <button
                                onClick={() => setActiveTab_state("window")}
                                className={`px-4 py-2 rounded font-semibold ${activeTab_state === "window"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-700"
                                    }`}
                            >
                                Window
                            </button>
                            <button
                                onClick={() => setActiveTab_state("iframe")}
                                className={`px-4 py-2 rounded font-semibold ${activeTab_state === "iframe"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-700"
                                    }`}
                            >
                                Iframe
                            </button>
                            <button
                                onClick={() => setActiveTab_state("youtube")}
                                className={`px-4 py-2 rounded font-semibold ${activeTab_state === "youtube"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-700"
                                    }`}
                            >
                                Youtube
                            </button>
                        </div>

                        {/* Grid with Ads and Banner Ads (फिल्टर के हिसाब से) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {filteredList.length === 0 ? (
                                <div className="p-6 rounded-lg flex flex-col items-center justify-center min-h-32 border col-span-full">
                                    <FaRegFrown className="w-16 h-16 text-gray-400 mb-4" />
                                    <div className="text-gray-500 text-center">
                                        <span>No ads available right now.</span>
                                        {willCome_afterThis_time_state && (
                                            <>
                                                &nbsp;Please check back after: <CountdownTimer expireTime={willCome_afterThis_time_state} />
                                            </>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                filteredList.map((item, index) => {
                                    if (item.type === "ad") {
                                        const values = item.data;
                                        return (
                                            <div
                                                key={values._id}
                                                className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col justify-between items-center text-center"
                                            >
                                                {/* Title */}
                                                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                                    {values.step_2_title}
                                                </h3>
                                                {/* Description */}
                                                <p className="text-sm text-gray-600 mb-3">
                                                    {values.step_2_description}
                                                </p>
                                                {/* Duration with icon */}
                                                <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                                                    <MdAccessTime className="text-lg" />
                                                    <span>{values.step_3_duration_for_user} sec</span>
                                                </div>
                                                {/* View Button */}
                                                <button
                                                    disabled={handle_clickAds_btnClick_state}
                                                    className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium ${handle_clickAds_btnClick_state
                                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                        : "bg-red-500 text-white"
                                                        }`}
                                                    onClick={() =>
                                                        handle_link_click(
                                                            values.step_2_url,
                                                            values._id,
                                                            values.step_3_amount_for_user
                                                        )
                                                    }
                                                >
                                                    <FaRegEye />
                                                    View Ad
                                                </button>
                                                {/* Earning Amount with icon */}
                                                <div className="mt-3 flex items-center text-green-600 text-base font-bold">
                                                    <BiRupee className="text-xl" />
                                                    {values.step_3_amount_for_user}
                                                </div>
                                            </div>
                                        );
                                    } else if (item.type === "banner") {
                                        const banner = item.data;
                                        return (
                                            <div key={banner.id} className="flex justify-center">
                                                <a
                                                    href={banner.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <img
                                                        src={banner.img}
                                                        alt="Banner Ad"
                                                        className="rounded shadow-lg max-w-full h-auto"
                                                    />
                                                </a>
                                            </div>
                                        );
                                    }
                                    return null;
                                })
                            )}
                        </div>
                    </div>

                    {/* Instructions Section */}
                    <div className="bg-white rounded shadow px-5 py-2 mx-2 mb-4">
                        <p className="text-center text-xl font-medium drop-shadow-[0_0_0.5px_blue] text-blue-600">
                            PTC Ads Instructions
                        </p>
                        <hr className="mt-2 border" />
                        <ul className="mt-4 font-medium text-gray-500 drop-shadow-sm space-y-4">
                            {PTCAds_firstTimeLoad_state?.other_data_PTCAds_instructions?.map(
                                (value, index) => (
                                    <li
                                        key={index}
                                        className="instruction-list-image"
                                        dangerouslySetInnerHTML={{ __html: value }}
                                    ></li>
                                )
                            )}
                        </ul>
                    </div>

                    {/* Footer */}
                    <Footer />

                    {/* Loader Overlay (if needed) */}
                    {data_process_state && <ProcessBgBlack />}
                </div>
            )}
        </>
    );
}

export default ViewAds;
