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

const ViewAds = ({ setAvailableBalance_forNavBar_state }) => {
    const [handle_clickAds_btnClick_state, setHandle_clickAds_btnClick_state] = useState(false);
    const [data_process_state, setData_process_state] = useState(false);
    const navigation = useNavigate();
    const [viewAds_firstTimeLoad_state, setViewAds_firstTimeLoad_state] = useState('');
    const [disabledButtons_state, setDisabledButtons_state] = useState([]);
    const [isExtension_state, setIsExtension_state] = useState(false);
    const [currentBtnName_and_amount_For_extension_storedValue_state, setCurrentBtnName_and_amount_For_extension_storedValue_state] = useState([]);
    const [originalTitle] = useState(document.title);
    const [isUserActiveOnPage, setIsUserActiveOnPage] = useState(false);
    const [totalDirectLinkBtns_state, setTotalDirectLinkBtns_state] = useState([]);
    const channel = new BroadcastChannel("viewAds_channel");

    useEffect(() => {
        if (typeof document.hidden !== "undefined" && handle_clickAds_btnClick_state) {
            const handleVisibilityChange = () => {
                if (!document.hidden) {
                    setIsUserActiveOnPage(true)
                }
            };

            document.addEventListener("visibilitychange", handleVisibilityChange);

            return () => {
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
            setAvailableBalance_forNavBar_state((parseFloat(response.data.msg.withdrawable_amount || 0) + parseFloat(response.data.msg.deposit_amount || 0)).toFixed(3))
            setDisabledButtons_state(response.data.msg.buttonNames)
        } catch (error) {
            console.error(error);
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
        } finally {
            setData_process_state(false);
        }
    };
    useEffect(() => {
        fetchData();
        channel.onmessage = (event) => {
            if (event.data === "handle_clickAds_btnClick_state_true") {
                setHandle_clickAds_btnClick_state(true);
            } else if (event.data === "handle_clickAds_btnClick_state_false") {
                setHandle_clickAds_btnClick_state(false);
            }
        };

        return () => {
            channel.close(); // Cleanup channel on unmount
        };
    }, []);

    let Instructions = [
        'Each user gets 5 Ads clicks to earn money per IP address.',
        'Clicking All Ads allows users to earn money.',
        'Once the 5 link clicks limit is reached, users cannot click more links with the same IP.',
        'To reset the balance and earn again, users must change their IP address.',
        'After changing the IP, users get 5 new Ads to click.',
        'This process can be repeated multiple times for more earnings.',
        'Users can change their IP address 50 times per day.',
        'Users can maximize their income by clicking Ads and changing IPs carefully.',
        'The cycle resets every day to allow users to earn again.',
        'As more users join the platform, the limits on ad clicks and IP changes will gradually increase, allowing users to earn even more as the platform grows.',
        'Please do not attempt to cheat or hack the website, as this could lead to your account_state being permanently banned. We are working hard to increase your income opportunities, so please follow the rules and earn money fairly. Any attempts to exploit scripts or find income tricks will result in both you and us being unable to earn. Follow the guidelines to maximize your earnings.'
    ];

    const handle_link_click = (link, btnName, amount) => {
        setHandle_clickAds_btnClick_state(true);
        channel.postMessage("handle_clickAds_btnClick_state_true");

        const newTab = window.open("", '_blank');
        if (!newTab) {
            return alert("Please Allow Popup in Your Browser to Earn Money!");
        }
        newTab.close();


        window.open(link, '_blank');

        setTimeout(() => {
            window.open(link, '_blank');
        }, 2000);

        setTimeout(() => {
            window.open(`/waitRedirecting/?link=${encodeURIComponent(link + '||' + btnName + '||' + amount)}`, '_blank', 'noopener noreferrer');
        }, 3000);
    };

    const handle_link_click2 = (link, btnName, amount) => {
        window.postMessage({ action: "startExtension", data: true }, "*");
        setHandle_clickAds_btnClick_state(true);
        channel.postMessage("handle_clickAds_btnClick_state_true");
        setCurrentBtnName_and_amount_For_extension_storedValue_state([btnName, amount]);

        const newTab = window.open("", '_blank');
        if (!newTab) {
            return alert("Please Allow Popup in Your Browser to Earn Money!");
        }
        newTab.close();
        let isExtension = localStorage.getItem('isExtension');
        if (isExtension !== 'true') {
            return alert('please install extension');
        }

        window.open(`/waitRedirecting1/?link=${encodeURIComponent(link)}`, '_blank', 'noopener noreferrer');
    };

    useEffect(() => {
        const handleStorageChange = () => {
            const clickSuccessStatus = localStorage.getItem('isSuccess');
            if (!isUserActiveOnPage) {
                if (clickSuccessStatus && clickSuccessStatus.includes('btn')) {
                    localStorage.removeItem('isSuccess');
                    setHandle_clickAds_btnClick_state(false);
                    channel.postMessage("handle_clickAds_btnClick_state_false");

                    if (viewAds_firstTimeLoad_state?.clickBalance) {
                        const [btnName, amount] = clickSuccessStatus.split('||');

                        setDisabledButtons_state((prevDisabled) => {
                            if (!prevDisabled.includes(btnName)) {
                                return [...prevDisabled, btnName];
                            }
                            return prevDisabled;
                        });

                        const obj = {
                            disabledButtons_state: [...disabledButtons_state, btnName],
                            clickBalance: `${parseFloat(viewAds_firstTimeLoad_state.clickBalance.split('/')[0])}/${viewAds_firstTimeLoad_state.clickBalance.split('/')[1]}`,
                            btnClickEarn: amount
                        };

                        user_adsView_income_patch(obj)
                            .then(() => {
                                Swal.fire({
                                    title: "Success!",
                                    icon: "success",
                                });
                                document.title = "✅ success!";
                                earningSound(true)
                                setTimeout(() => document.title = originalTitle, 4000);
                            })
                            .catch((error) => console.error("Error updating income:", error));
                    }
                } else if (clickSuccessStatus === 'false') {
                    localStorage.removeItem('isSuccess');
                    setHandle_clickAds_btnClick_state(false);
                    channel.postMessage("handle_clickAds_btnClick_state_false");
                    Swal.fire({
                        icon: "error",
                        title: "Success!",
                        text: "Something went wrong!",
                    });
                    document.title = "❌ failed";
                    earningSound(false)
                    setTimeout(() => document.title = originalTitle, 2000);
                }
            } else {
                setIsUserActiveOnPage(false);
                if (clickSuccessStatus) {
                    localStorage.removeItem('isSuccess');
                }
                setHandle_clickAds_btnClick_state(false);
                channel.postMessage("handle_clickAds_btnClick_state_false");
                Swal.fire({
                    icon: "error",
                    title: "Success!",
                    text: "Something went wrong!",
                });
                document.title = "❌ failed";
                earningSound(false)
                setTimeout(() => document.title = originalTitle, 2000);
            }

            setIsExtension_state(isExtension === 'true');
        };

        // Initial state setup
        const isExtension = localStorage.getItem('isExtension');
        setIsExtension_state(isExtension === 'true');

        // Event listeners for storage and beforeunload
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('beforeunload', () => {
            const clickSuccessStatus = localStorage.getItem('isSuccess');
            if (clickSuccessStatus) {
                localStorage.removeItem('isSuccess');
            }
        });

        // Cleanup event listeners
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('beforeunload', () => {
                const clickSuccessStatus = localStorage.getItem('isSuccess');
                if (clickSuccessStatus) {
                    localStorage.removeItem('isSuccess');
                }
            });
        };
    }, [viewAds_firstTimeLoad_state, isUserActiveOnPage]);

    useEffect(() => {
        const handleIsExtensionUpdated = (e) => {
            const [btnName, amount] = currentBtnName_and_amount_For_extension_storedValue_state;
            const extension_storedValue = localStorage.getItem('extension_storedValue');
            if (viewAds_firstTimeLoad_state && viewAds_firstTimeLoad_state.clickBalance) {
                if ((extension_storedValue === 'true') && btnName && amount) {
                    localStorage.removeItem('extension_storedValue');

                    setHandle_clickAds_btnClick_state(false);
                    channel.postMessage("handle_clickAds_btnClick_state_false");

                    setDisabledButtons_state((prevDisabled) => {
                        if (!prevDisabled.includes(btnName)) {
                            return [...prevDisabled, btnName];
                        }
                        return prevDisabled;
                    });

                    const obj = {
                        disabledButtons_state: [...disabledButtons_state, btnName],
                        clickBalance: (parseFloat(viewAds_firstTimeLoad_state.clickBalance.split('/')[0]) + 1).toString() +
                            "/" +
                            viewAds_firstTimeLoad_state.clickBalance.split('/')[1],
                        btnClickEarn: amount,
                    };

                    user_adsView_income_patch(obj)
                        .then(() => {
                            Swal.fire({
                                title: "Success!",
                                icon: "success",
                            });
                            document.title = "✅ success!"
                            earningSound(true)
                            setTimeout(() => {
                                document.title = originalTitle
                            }, 4000);
                        })
                        .catch((error) => {
                            console.error("Error updating income:", error);
                        });
                } else if (extension_storedValue === 'false') {
                    localStorage.removeItem('extension_storedValue');
                    setHandle_clickAds_btnClick_state(false);
                    channel.postMessage("handle_clickAds_btnClick_state_false");
                    Swal.fire({
                        icon: "error",
                        title: "Success!",
                        text: "Something went wrong!",
                    });
                    document.title = "❌ failed"
                    earningSound(false)
                    setTimeout(() => {
                        document.title = originalTitle
                    }, 4000);
                }
            }

            const isExtension = localStorage.getItem('isExtension');
            if (isExtension === 'true') {
                setIsExtension_state(true);
            } else {
                setIsExtension_state(false);
            }
        };

        window.addEventListener("isExtensionUpdated", handleIsExtensionUpdated);
        window.addEventListener("beforeunload", () => {
            localStorage.removeItem('extension_storedValue');
        });
        return () => {
            window.removeEventListener("isExtensionUpdated", handleIsExtensionUpdated);
            window.removeEventListener("beforeunload", () => {
                localStorage.removeItem('extension_storedValue');
            });
        };
    }, [viewAds_firstTimeLoad_state, currentBtnName_and_amount_For_extension_storedValue_state]);


    let user_adsView_income_patch = async (obj) => {
        setData_process_state(true);
        try {
            const response = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/userIncomeRoute/user_adsView_income_patch`, obj, {
                withCredentials: true
            });
            setViewAds_firstTimeLoad_state(response.data.msg)
            setAvailableBalance_forNavBar_state((parseFloat(response.data.msg.withdrawable_amount || 0) + parseFloat(response.data.msg.deposit_amount || 0)).toFixed(3))
            setDisabledButtons_state(response.data.msg.buttonNames)
        } catch (error) {
            console.error(error);
            if (error.response.data.jwtMiddleware_token_not_found_error) {
                navigation('/login');
            } else if (error?.response?.data?.jwtMiddleware_error) {
                showNotificationWith_timer(true, 'Your session has expired. Please log in again.', '/login', navigation);
            } else if (error?.response?.data?.error_msg) {
                showNotification(true, error?.response?.data?.error_msg);
            } else {
                showNotification(true, "Something went wrong, please try again.");
            }

        } finally {
            setData_process_state(false);
        }
    }

    const ExtensionInstallPopup = () => {
        Swal.fire({
            title: '',
            html: `
            <div class="fixed inset-0 flex items-center justify-start bg-black bg-opacity-80 z-50">
                <div class="w-full h-full max-w-none bg-gray-900 text-white shadow-xl overflow-auto p-8 relative">
                    
                    <!-- Close Icon -->
                    <button data-close="true" class="absolute top-4 right-6 text-white text-3xl font-bold hover:text-gray-400 transition duration-300">
                        ✖
                    </button>
                    
                    <h2 class="text-4xl font-bold text-white mb-6">🚀 Install Our Chrome Extension</h2>
                    
                    <!-- Step 1: Download ZIP -->
                    <div class="bg-gray-800 p-6 rounded-lg shadow-md mb-6 text-left">
                        <h3 class="text-2xl font-semibold text-yellow-400">📌 Step 1: Download the ZIP File</h3>
                        <p class="mt-2 text-gray-300">
                            To start earning more, install our extension by downloading the file below.
                        </p>
                        <div class="mt-4">
                            <a href="https://drive.google.com/uc?export=download&id=1pz2538vWbMUcq0pqBzikY1n_4KB3_XTg" 
                               download 
                               class="inline-block bg-blue-500 text-white px-8 py-3 rounded-md text-lg hover:bg-blue-600 transition duration-300">
                                Download Extension ZIP
                            </a>
                        </div>
                    </div>
                    
                    <!-- Step 2: Install in Chrome -->
                    <div class="bg-gray-800 p-6 rounded-lg shadow-md mb-6 text-left">
                        <h3 class="text-2xl font-semibold text-green-400">📌 Step 2: Install on Chrome (Desktop)</h3>
                        <ol class="list-decimal list-inside mt-2 text-gray-300 space-y-2">
                            <li>Open <code class="bg-gray-700 p-1 rounded">chrome://extensions/</code> in Chrome.</li>
                            <li>Enable <strong>Developer Mode</strong> (Top-Right Toggle).</li>
                            <li>Click "Load Unpacked".</li>
                            <li>Select the <strong>Extracted Folder</strong> & Install.</li>
                            <li>Your extension is now installed successfully! 🎉</li>
                        </ol>
                    </div>
                    
                    <!-- Step 3: Mobile Users (Yandex Browser) -->
                    <div class="bg-gray-800 p-6 rounded-lg shadow-md mb-6 text-left">
                        <h3 class="text-2xl font-semibold text-purple-400">📌 Step 3: Mobile Users (Use Yandex Browser)</h3>
                        <p class="mt-2 text-gray-300">
                            Most mobile browsers <strong>do not support Chrome Extensions</strong>. But you can use the <strong>Yandex Browser</strong> to install and use extensions on mobile!
                        </p>
                        <ol class="list-decimal list-inside mt-2 text-gray-300 space-y-2">
                            <li>Download <strong>Yandex Browser</strong> from the Play Store.</li>
                            <li>Open <code class="bg-gray-700 p-1 rounded">chrome.google.com/webstore</code>.</li>
                            <li>Search for our extension and click "Add to Chrome".</li>
                            <li>Your extension will be installed successfully! 🎉</li>
                        </ol>
                        <div class="mt-4">
                            <a href="https://play.google.com/store/apps/details?id=com.yandex.browser"
                               target="_blank"
                               class="inline-block bg-purple-500 text-white px-8 py-3 rounded-md text-lg hover:bg-purple-600 transition duration-300">
                                Download Yandex Browser
                            </a>
                        </div>
                    </div>
                    
                    <!-- Step 4: Watch Video -->
                    <div class="bg-gray-800 p-6 rounded-lg shadow-md text-left">
                        <h3 class="text-2xl font-semibold text-red-400">📌 Step 4: Watch Video Tutorial</h3>
                        <div class="relative w-full h-0 pt-[56.25%] mt-3">
                            <iframe class="absolute top-0 left-0 w-full h-full rounded-lg"
                                    src="https://www.youtube.com/embed/VIDEO_ID" 
                                    frameborder="0" allowfullscreen>
                            </iframe>
                        </div>
                    </div>
                    
                    <!-- Close Button -->
                    <div class="mt-6 text-left">
                        <button data-close="true" 
                                class="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg text-lg transition duration-300">
                            Close
                        </button>
                    </div>
                </div>
            </div>
            `,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            background: "transparent",
            customClass: {
                popup: "p-0 m-0 w-full h-full max-w-none shadow-none border-0"
            },
            didOpen: () => {
                document.querySelectorAll("[data-close]").forEach((btn) => {
                    btn.addEventListener("click", () => Swal.close());
                });
            }
        });
    };

    return (
        <div className="ml-auto flex flex-col justify-between  bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[94vh] mt-12">
            <div className='px-2 py-2'>
                <div className='text-2xl text-blue-600 font-semibold my-4 mx-2 select-none flex justify-between'>
                    View Ads to Earn
                </div>
                <div className='flex flex-col items-center my-6 px-4'>
                    <div className="bg-white p-4 sm:p-6 shadow-lg rounded-lg relative w-full">
                        {/* Click Balance & Income Section */}
                        <div className='flex flex-col sm:flex-row gap-4 mb-4 justify-center text-center w-full'>
                            <div className='bg-purple-700 px-4 py-2 shadow font-bold text-white rounded-t-2xl w-full sm:w-auto'>
                                Click Balance - {viewAds_firstTimeLoad_state.clickBalance}
                            </div>
                            <div className='bg-purple-700 px-4 py-2 shadow font-bold text-white rounded-t-2xl w-full sm:w-auto'>
                                Income - ₹{viewAds_firstTimeLoad_state.income}
                            </div>
                        </div>

                        {/* Timer Overlay */}
                        <div className={`${viewAds_firstTimeLoad_state.ViewAdsexpireTImer ? 'flex' : 'hidden'} absolute z-10 inset-0 bg-white bg-opacity-70 justify-center items-center`}>
                            <div className="flex flex-col items-center text-xl sm:text-2xl font-semibold">
                                <div className="text-center">Come Back After</div>
                                <div className="text-3xl sm:text-4xl font-bold text-red-600 drop-shadow">
                                    <CountdownTimer expireTime={viewAds_firstTimeLoad_state.ViewAdsexpireTImer} />
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
                                        disabled={handle_clickAds_btnClick_state || disabledButtons_state.includes('btn' + (index + 1))}
                                        className={`w-full px-5 py-2 rounded-md font-medium transition ${handle_clickAds_btnClick_state || disabledButtons_state.includes('btn' + (index + 1))
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md'
                                            }`}
                                        onClick={(e) => handle_link_click(values.url, `btn${index + 1}`, values.amount)}
                                    >
                                        {values.buttonTitle} {index + 1}
                                    </button>
                                    <span className="mt-2 text-lg font-bold text-green-600">₹{values.amount}</span>
                                </div>
                            ))}
                        </div>

                        {/* Extension Install Section */}
                        <div className="my-6 text-center text-lg font-semibold text-gray-700">
                            ---- Boost Your Earnings: Install Our Extension ----
                        </div>

                        {/* Instruction Message */}
                        <div className="text-center bg-blue-100 text-blue-700 p-3 rounded-lg shadow-md mb-4">
                            <span className="font-semibold">Important:</span> Only click these buttons below! The extension will handle ads automatically.
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 relative">
                            {/* Extension Lock Overlay */}
                            <div className={`${isExtension_state ? 'hidden' : 'flex'} absolute inset-0 bg-white bg-opacity-70 justify-center items-center`}>
                                <button
                                    onClick={ExtensionInstallPopup}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 shadow-lg"
                                >
                                    What Happened?
                                </button>
                            </div>

                            {totalDirectLinkBtns_state.filter((values) => values.isExtension).map((values, index) => (
                                <div key={index} className="bg-gray-100 rounded-lg p-3 sm:p-4 shadow-md flex flex-col items-center">
                                    <button
                                        disabled={handle_clickAds_btnClick_state || disabledButtons_state.includes('1btn' + (index + 1))}
                                        className={`w-full px-5 py-2 rounded-md font-medium transition ${handle_clickAds_btnClick_state || disabledButtons_state.includes('1btn' + (index + 1))
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md'
                                            }`}
                                        onClick={(e) => handle_link_click2(values.url, `1btn${index + 1}`, values.amount)}
                                    >
                                        {values.buttonTitle} {index + 1}
                                    </button>
                                    <span className="mt-2 text-lg font-bold text-green-600">₹{values.amount}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* adsterra Native Banner start */}
                <div id="container-f2e76b1a9af84306102d9f8675c030e8"></div>
                {/* adsterra Native Banner End*/}
                <div className='bg-white rounded shadow px-5 py-2'>
                    <p className='text-center text-xl font-medium drop-shadow-[0_0_0.5px_blue] text-blue-600'>View Ads Instructions</p>
                    <hr className='mt-2 border' />
                    <ul className='mt-4 font-medium text-gray-500 drop-shadow-sm'>
                        {
                            Instructions.map((value, index) => <li key={index}><i className="fa-solid fa-hand-point-right fa-fade text-red-600"></i> {value}</li>)
                        }
                    </ul>
                </div>
            </div>
            <div className='mt-3'>
                <Footer />
            </div>
            {(data_process_state) && <ProcessBgBlack />}
        </div>
    );
}

export default ViewAds;
