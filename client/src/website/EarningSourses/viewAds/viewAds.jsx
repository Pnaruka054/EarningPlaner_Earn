import React, { useEffect, useRef, useState } from 'react';
import Footer from '../../components/footer/footer';
import ProcessBgBlack from '../../components/processBgBlack/processBgBlack';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CountdownTimer from '../../components/countDownTimer/countDownTimer';
import earningSound from '../../components/earningSound'
import showNotificationWith_timer from '../../components/showNotificationWith_timer';
import showNotification from '../../components/showNotification';
import ProcessBgSeprate from '../../components/processBgSeprate/processBgSeprate';
import { setItemWithExpiry, getItemWithExpiry } from '../../components/handle_localStorage'
import { Helmet } from 'react-helmet';
import { encryptData } from '../../components/encrypt_decrypt_data';

const ViewAds = ({ setAvailableBalance_forNavBar_state }) => {
    const [handle_clickAds_btnClick_state, setHandle_clickAds_btnClick_state] = useState(false);
    const [data_process_state, setData_process_state] = useState(false);
    const navigation = useNavigate();
    const [viewAds_firstTimeLoad_state, setViewAds_firstTimeLoad_state] = useState([]);
    const [disabledButtons_state, setDisabledButtons_state] = useState([]);
    const [currentBtnName_and_amount_For_extension_storedValue_state, setCurrentBtnName_and_amount_For_extension_storedValue_state] = useState([]);
    const [originalTitle] = useState(document.title);
    const [isUserActiveOnPage, setIsUserActiveOnPage] = useState(false);
    const [totalDirectLinkBtns_state, setTotalDirectLinkBtns_state] = useState([]);
    const channel = new BroadcastChannel("viewAds_channel");
    const [isChecked_state, setIsChecked_state] = useState(true);

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

    const fetchData = async () => {
        setData_process_state(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/userIncomeRoute/user_adsView_home_get`, {
                withCredentials: true
            });
            setTotalDirectLinkBtns_state(response.data.msg.viewAds_directLinksData);
            setViewAds_firstTimeLoad_state(response.data.msg)
            setAvailableBalance_forNavBar_state(response.data.msg.userAvailableBalance)
            setDisabledButtons_state(response.data.msg.buttonNames)
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
                const [btnName, amount] = currentBtnName_and_amount_For_extension_storedValue_state;
                let timer = 10;
                const countdownInterval = setInterval(() => {
                    timer--;
                    document.title = `Wait : ${timer}sec`;
                    if (timer <= 0) clearInterval(countdownInterval);
                }, 1000);

                setTimeout(() => {
                    if (!isUserActiveOnPageRef.current) {
                        channel.postMessage("handle_clickAds_btnClick_state_false");

                        if (viewAds_firstTimeLoad_state?.pendingClick && btnName && amount) {
                            setDisabledButtons_state((prevDisabled) =>
                                prevDisabled.includes(btnName) ? prevDisabled : [...prevDisabled, btnName]
                            );

                            const obj = {
                                disabledButtons_state: [...disabledButtons_state, btnName],
                                pendingClick: `${parseFloat(viewAds_firstTimeLoad_state.pendingClick)}`,
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
    }, [viewAds_firstTimeLoad_state, currentBtnName_and_amount_For_extension_storedValue_state, isUserActiveOnPage]);

    const handle_link_click = (link, btnName, amount) => {
        setHandle_clickAds_btnClick_state(true);
        setIsUserActiveOnPage(false);
        channel.postMessage("handle_clickAds_btnClick_state_true");

        setTimeout(() => {
            let newTab1 = window.open(`/waitRedirecting/?link=${encodeURIComponent(link)}`, '_blank', 'noopener noreferrer');;
            if (!newTab1) {
                setHandle_clickAds_btnClick_state(false);
                setCurrentBtnName_and_amount_For_extension_storedValue_state([btnName, amount])
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

    const userClickHandle = () => setIsChecked_state((prev) => !prev);

    let user_adsView_income_patch = async (dataObj) => {
        setData_process_state(true);
        try {
            let obj = await encryptData(dataObj)
            const response = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/userIncomeRoute/user_adsView_income_patch`, { obj }, {
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
            setViewAds_firstTimeLoad_state((prev) => ({
                ...prev,
                pendingEarnings: (parseFloat(prev.pendingEarnings || 0) - parseFloat(dataObj.btnClickEarn || 0)).toFixed(3),
                today_adsviewIncome: (parseFloat(prev.today_adsviewIncome || 0) + parseFloat(dataObj.btnClickEarn || 0)).toFixed(3),
                totalLinks: (parseFloat(prev.totalLinks || 0) - 1),
                completedClick: (parseFloat(prev.completedClick || 0) + 1),
                pendingClick: (parseFloat(prev.pendingClick || 0) - 1),
                ...(response.data.msg.viewAdsexpireTimer && { viewAdsexpireTimer: response.data.msg.viewAdsexpireTimer })
            }));

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
            setCurrentBtnName_and_amount_For_extension_storedValue_state([]);
        }
    }

    return (
        <>
            <Helmet>
                <title>EarnWiz - View Ads & Earn Money</title>
                <meta name="description" content="Earn money by viewing ads on EarnWiz. Visit our view ads earnings page to quickly boost your income with minimal effort." />
            </Helmet>
            {data_process_state ? (
                <div className="ml-auto flex flex-col justify-between bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[93.3dvh] mt-[6.7dvh]">
                    <ProcessBgSeprate />
                </div>
            ) : (
                <div className="ml-auto flex flex-col justify-between  bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[93.3dvh] custom-scrollbar mt-[6.7dvh]">
                    <div className='px-2 py-2'>
                        <div className='text-2xl text-blue-600 font-semibold my-4 mx-2 select-none flex justify-between'>
                            View Ads
                        </div>
                        <div className='flex -mb-6 justify-center'>
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
                        <div className='flex flex-col items-center my-6 px-4 text-center'>
                            <div className="bg-white p-4 sm:p-6 shadow-lg rounded-lg relative w-full">
                                {/* Click Balance & Income Section */}
                                <h2 className="text-xl font-semibold text-gray-800 mb-5">💰 Earnings Summary</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4 text-gray-700">
                                    <div className="bg-gray-100 p-3 rounded-lg">
                                        <div className="font-semibold">Pending Earnings:</div>
                                        <div className="text-red-500 font-bold ml-2">₹{viewAds_firstTimeLoad_state.pendingEarnings}</div>
                                    </div>
                                    <div className="bg-gray-100 p-3 rounded-lg">
                                        <div className="font-semibold">Today Earnings:</div>
                                        <div className="text-green-600 font-bold ml-2">₹{viewAds_firstTimeLoad_state.today_adsviewIncome}</div>
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
                                {/* Timer Overlay */}
                                <div className={`${viewAds_firstTimeLoad_state.viewAdsexpireTimer ? 'flex' : 'hidden'} absolute z-[1] inset-0 bg-white bg-opacity-70 justify-center items-start`}>
                                    <div className="flex flex-col items-center text-3xl sm:text-6xl font-semibold mt-20">
                                        <div className="text-center">Come Back After</div>
                                        <div className="text-5xl sm:text-7xl font-bold text-red-600 drop-shadow">
                                            <CountdownTimer expireTime={viewAds_firstTimeLoad_state.viewAdsexpireTimer} />
                                        </div>
                                    </div>
                                </div>
                                {/* Direct Link Section */}
                                <div className="my-4 text-center bg-yellow-100 text-yellow-800 p-3 rounded-lg shadow-md">
                                    <span className="font-semibold">Important:</span> Click these buttons and manually handle ads to earn money!
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                                    {totalDirectLinkBtns_state.filter((values) => !values.isExtension).map((values, index) => (
                                        <div key={index} className="bg-gray-100 rounded-lg p-3 sm:p-4 shadow-md flex flex-col items-center">
                                            <button
                                                disabled={handle_clickAds_btnClick_state || disabledButtons_state?.includes('btn' + (index + 1))}
                                                className={`w-full px-5 py-2 rounded-md font-medium transition ${handle_clickAds_btnClick_state || disabledButtons_state.includes('btn' + (index + 1))
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md'
                                                    }`}
                                                onClick={(e) => handle_link_click(values.url, `btn${index + 1}`, values.amount)}
                                            >
                                                {values.buttonTitle}
                                            </button>
                                            <span className="mt-2 text-lg font-bold text-green-600">₹{values.amount}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className='bg-white rounded shadow px-5 py-2'>
                            <p className='text-center text-xl font-medium drop-shadow-[0_0_0.5px_blue] text-blue-600'>View Ads Instructions</p>
                            <hr className='mt-2 border' />
                            <ul className='mt-4 font-medium text-gray-500 drop-shadow-sm space-y-4'>
                                {
                                    viewAds_firstTimeLoad_state?.other_data_viewAds_instructions?.map((value, index) => <li key={index} className='instruction-list-image' dangerouslySetInnerHTML={{ __html: value }}></li>)
                                }
                            </ul>
                        </div>
                    </div>
                    <div className='mt-3'>
                        <Footer />
                    </div>
                    {data_process_state && <ProcessBgBlack />}
                </div>
            )}
        </>
    );
}

export default ViewAds;
