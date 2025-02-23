import React, { useEffect, useRef, useState } from 'react';
import Footer from '../../components/footer/footer';
import ProcessBgBlack from '../../components/processBgBlack/processBgBlack';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CountdownTimer from '../../components/countDownTimer/countDownTimer';
import earningSound from '../../components/earningSound'

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
    // const [count_state, setCount_state] = useState(30);
    // const [count_handle_state, setCount_handle_state] = useState(false);
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

    // useEffect(() => {
    //     let timerId;
    //     if (count_handle_state) {
    //         timerId = setInterval(() => {
    //             setCount_state((prev) => {
    //                 const newCount = prev - 1;
    //                 document.title = newCount; // Update document title with the latest count
    //                 return newCount;
    //             });
    //         }, 1000);
    //     } else if (!count_handle_state) {
    //         setCount_state(30)
    //         clearInterval(timerId);
    //     }
    //     return () => clearInterval(timerId);
    // }, [count_handle_state]);

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
    }

    const ExtensionInstallPopup = () => {
        Swal.fire({
            title: 'Extension Installation Instructions',
            html: `
              <div class="text-left" style="font-family: sans-serif;">
                <div class="mb-4">
                  <p class="font-bold text-lg">📌 Step 1: Download the ZIP File</p>
                  <p class="text-sm text-gray-700 mt-1">
                    To boost your income, you need to install our extension. Click the download button below to download the extension file.
                 </p>
                  <a 
                    href="https://drive.google.com/uc?export=download&id=1pz2538vWbMUcq0pqBzikY1n_4KB3_XTg" 
                    download 
                    style="display: inline-block; margin-top: 8px; background-color: #3B82F6; color: white; padding: 8px 16px; border-radius: 4px; text-decoration: none;">
                    Download Extension ZIP
                  </a>
                </div>
        
                <div class="mb-4">
                  <p class="font-bold text-lg">📌 Step 2: How to Install the Extension</p>
                  <p class="text-sm text-gray-700 mt-1">
                    Follow these steps to manually install the extension in your Chrome browser:
                  </p>
                  <ol class="list-decimal ml-5 mt-2 text-sm text-gray-700">
                    <li>Open your Chrome browser.</li>
                    <li>Go to <code>chrome://extensions/</code> in the address bar.</li>
                    <li>Enable Developer Mode (toggle switch at the top-right).</li>
                    <li>Click on "Load Unpacked".</li>
                    <li>Select the extracted folder from the downloaded ZIP file.</li>
                    <li>The extension will be installed successfully! 🎉</li>
                  </ol>
                  <p class="mt-2 text-sm text-gray-700">
                    <strong>Tip:</strong> You can provide the ZIP file download link on your website or Google Drive.
                  </p>
                </div>
        
                <div class="mb-4">
                  <p class="font-bold text-lg">📌 Step 3: Video Tutorial</p>
                  <p class="text-sm text-gray-700 mt-1">
                    Watch the video below for a visual guide on installing the extension:
                  </p>
                  <div style="margin-top: 8px; position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 4px;">
                    <iframe 
                      src="https://www.youtube.com/embed/VIDEO_ID" 
                      frameborder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowfullscreen 
                      style="position: absolute; top:0; left: 0; width: 100%; height: 100%;">
                    </iframe>
                  </div>
                </div>
              </div>
            `,
            showCloseButton: true,
            confirmButtonText: 'Close',
            customClass: {
                popup: 'rounded-lg'
            }
        });
    }

    return (
        <div className="ml-auto flex flex-col justify-between  bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[94vh] mt-12">
            <div className='px-2 py-2'>
                <div className='text-2xl text-blue-600 font-semibold my-4 mx-2 select-none flex justify-between'>
                    View Ads to Earn
                </div>
                <div data-banner-id="6056470"></div>
                <div className='flex flex-col items-center my-6'>
                    <div className='flex gap-4'>
                        <div className='bg-purple-700 px-2 py-1 shadow font-bold text-white rounded-t-2xl'>Click Balance - {viewAds_firstTimeLoad_state.clickBalance}</div>
                        <div className='bg-purple-700 px-2 py-1 shadow font-bold text-white rounded-t-2xl'>Income - ₹{viewAds_firstTimeLoad_state.income}</div>
                    </div>
                    <div className=' bg-white px-6 py-3 shadow relative'>
                        <div className={`${viewAds_firstTimeLoad_state.ViewAdsexpireTImer ? 'flex' : 'hidden'} absolute z-[1] top-0 bottom-0 left-0 right-0 bg-white bg-opacity-60 justify-center items-center`}>
                            <div className='flex flex-col items-center font-lexend text-2xl'>
                                <div className='text-center'>Come Back After</div>
                                <div className='text-4xl font-bold drop-shadow'>
                                    <CountdownTimer expireTime={viewAds_firstTimeLoad_state.ViewAdsexpireTImer} />
                                </div>
                            </div>
                        </div>
                        <div className='gap-2 justify-center flex flex-wrap'>
                            {
                                totalDirectLinkBtns_state.filter((values) => !values.isExtension).map((values, index) => (
                                    <button key={index} disabled={handle_clickAds_btnClick_state || disabledButtons_state.includes('btn' + (index + 1)) ? true : false} className={`${handle_clickAds_btnClick_state || disabledButtons_state.includes('btn' + (index + 1)) ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-600 '} text-white px-4 py-1 rounded shadow flex flex-col items-center`} onClick={(e) => {
                                        handle_link_click(values.url, `btn${index + 1}`, values.amount)
                                    }}><span>{values.buttonTitle} {index + 1}</span><span>₹{values.amount}</span></button>
                                ))
                            }
                        </div>
                        <div className='my-5 text-center text-xl'>---- Boost Your Earnings: Install Our Extension ----</div>
                        <div className='gap-2 justify-center flex flex-wrap relative'>
                            <div className={`${isExtension_state ? 'hidden' : 'flex'} absolute top-0 left-0 right-0 bottom-0 bg-white bg-opacity-60 justify-center items-center`}>
                                <button
                                    onClick={ExtensionInstallPopup}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200 shadow-lg"
                                >
                                    What Happened?
                                </button>
                            </div>
                            {
                                totalDirectLinkBtns_state.filter((values) => values.isExtension).map((values, index) => (
                                    <button key={index} disabled={handle_clickAds_btnClick_state || disabledButtons_state.includes('1btn' + (index + 1)) ? true : false} className={`${handle_clickAds_btnClick_state || disabledButtons_state.includes('1btn' + (index + 1)) ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-600 '} text-white px-4 py-1 rounded shadow flex flex-col items-center`} onClick={(e) => {
                                        handle_link_click2(values.url, `1btn${index + 1}`, values.amount)
                                    }}><span>{values.buttonTitle} {index + 1}</span><span>₹{values.amount}</span></button>
                                ))
                            }
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
