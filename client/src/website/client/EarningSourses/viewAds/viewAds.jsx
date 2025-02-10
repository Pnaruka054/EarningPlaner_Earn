import React, { useEffect, useRef, useState } from 'react';
import Footer from '../../components/footer/footer';
import OnClickaVideoAds from '../../components/onClickaVideoAds/onClickaVideoAds';
import ProcessBgBlack from '../../components/processBgBlack/processBgBlack';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ViewAds = ({ setAvailableBalance_forNavBar_state }) => {
    const [handle_clickAds_btnClick_state, setHandle_clickAds_btnClick_state] = useState(false);
    const [showAdsDiv_state, setShowAdsDiv_state] = useState(false);
    const [processing_state, setProcessing_state] = useState(false);
    const [timerCount_state, setTimerCount_state] = useState(15);
    const [removeTimer_state, setRemoveTimer_state] = useState(false);
    const [onClicka_clickadilla_state, setOnClicka_clickadilla_state] = useState('');
    const [data_process_state, setData_process_state] = useState(false);
    const navigation = useNavigate();
    const [viewAds_firstTimeLoad_state, setViewAds_firstTimeLoad_state] = useState('');
    const [disabledButtons_state, setDisabledButtons_state] = useState([]);

    const fetchData = async () => {
        setData_process_state(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/userIncomeRoute/user_adsView_home_get`, {
                withCredentials: true
            });
            setViewAds_firstTimeLoad_state(response.data.msg)
            setAvailableBalance_forNavBar_state((parseFloat(response.data.msg.withdrawable_amount) + parseFloat(response.data.msg.deposit_amount)).toFixed(3))
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
    };
    useEffect(() => {
        fetchData();
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
        'Please do not attempt to cheat or hack the website, as this could lead to your account being permanently banned. We are working hard to increase your income opportunities, so please follow the rules and earn money fairly. Any attempts to exploit scripts or find income tricks will result in both you and us being unable to earn. Follow the guidelines to maximize your earnings.'
    ];

    useEffect(() => {
        const observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.classList.contains('video_slider')) {
                        if (onClicka_clickadilla_state === 'onClicka') {
                            handle_onClickaAds('iframe[src="https://js.onclmng.com/log/count.html"]', 'script[src="https://js.onclckmn.com/static/onclicka.js"]')
                        } else if (onClicka_clickadilla_state === 'clickAdilla') {
                            handle_onClickaAds('iframe[src="https://storage.multstorage.com/log/count.html"]', 'script[src="https://js.wpadmngr.com/static/adManager.js"]')
                        }
                    }
                    if (node.nodeType === 1 && node.classList.contains('gfpl-wrapper')) {
                        if (document.querySelector('div[data-banner-id="1435822"] .gfpl-wrapper') && node.classList.contains('gfpl-wrapper')) {
                            handelAdsDiv_for_Onclicka('div[data-banner-id="1435822"] .gfpl-wrapper')
                        } else if (document.querySelector('div[data-banner-id="6033510"]') && node.classList.contains('gfpl-wrapper')) {
                            handelAdsDiv_for_Onclicka('div[data-banner-id="6033510"] .gfpl-wrapper')
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        return () => {
            observer.disconnect();
        };
    }, [onClicka_clickadilla_state]);

    function handelAdsDiv_for_Onclicka(selector) {
        setProcessing_state(false);
        let gfpl_wrapper = document.querySelector(selector);
        if (gfpl_wrapper?.children[0]) {
            setTimeout(() => {
                setRemoveTimer_state(true)
            }, 1000);
        }
        let interval = setInterval(() => {
            setTimerCount_state((prevCount) => {
                const newCount = prevCount - 1;
                if (newCount === -1) {
                    gfpl_wrapper?.remove()
                    setShowAdsDiv_state(false)
                    setTimerCount_state(15)
                    Swal.fire({
                        title: "Success!",
                        icon: "success",
                    });
                    setHandle_clickAds_btnClick_state(false)
                    setRemoveTimer_state(false)
                    if (selector === 'div[data-banner-id="1435822"] .gfpl-wrapper') {
                        document.querySelector('div[data-banner-id="1435822"]').innerHTML = ''
                    }
                    clearInterval(interval)
                }
                return newCount;
            });
        }, 1000);
    }

    function handelAdsDiv_for_adSterra(key) {
        const adDiv = document.getElementById('adSterra')
        if (adDiv) {
            adDiv.innerHTML = '';

            const script1 = document.createElement('script');
            script1.type = 'text/javascript';
            script1.innerHTML = `
            atOptions = {
              'key': '${key}',
              'format': 'iframe',
              'height': 250,
              'width': 300,
              'params': {}
            };
          `;

            adDiv.appendChild(script1);

            const script2 = document.createElement('script');
            script2.type = 'text/javascript';
            script2.src = `//www.highperformanceformat.com/${key}/invoke.js`;

            adDiv.appendChild(script2);
            let count = 0;
            let checkInterval = setInterval(() => {
                count += 0
                Array.from(adDiv.children).forEach((elements) => {
                    if (count === 5 || elements.tagName === 'IFRAME') {
                        clearInterval(checkInterval)
                    }
                    if (elements.tagName === 'IFRAME') {
                        setTimeout(() => {
                            setRemoveTimer_state(true)
                            setProcessing_state((p) => p = false)
                        }, 1000);
                        let interval = setInterval(() => {
                            setTimerCount_state((prevCount) => {
                                const newCount = prevCount - 1;
                                if (newCount === -1) {
                                    adDiv.innerHTML = ''
                                    setShowAdsDiv_state(false)
                                    clearInterval(interval)
                                    Swal.fire({
                                        title: "Success!",
                                        icon: "success",
                                    });
                                    setHandle_clickAds_btnClick_state(false)
                                    setRemoveTimer_state(false)
                                    setTimerCount_state(15)
                                }
                                return newCount;
                            });
                        }, 1000);
                    }
                })
            }, 1000);

        } else {
            console.error('Ad container (adstrra) not found.');
        }
    }

    const handelAdsDiv_for_aAds = () => {
        const adContainer = document.getElementById('A_ads');
        if (adContainer) {
            adContainer.innerHTML = ''; // Clear the div if any content exists
            adContainer.innerHTML = `
        <div id="frame" style="width: 300px; height: auto;">
          <iframe
            data-aa="2379444"
            src="//ad.a-ads.com/2379444?size=300x250"
            style="width: 300px; height: 250px; border: 0px; padding: 0; overflow: hidden; background-color: transparent;"
          ></iframe>
          <a
            style="display: block; text-align: right; font-size: 12px;"
            id="preview-link"
            href="https://aads.com/campaigns/new/?source_id=2379444&source_type=ad_unit&partner=2379444"
          >
            Advertise here
          </a>
        </div>
      `;
        }
        if (adContainer.children[0].children[0].tagName === 'IFRAME') {
            setTimeout(() => {
                setRemoveTimer_state(true)
                setProcessing_state((p) => p = false)
            }, 1000);
            let interval = setInterval(() => {
                setTimerCount_state((prevCount) => {
                    const newCount = prevCount - 1;
                    if (newCount === -1) {
                        adContainer.innerHTML = ''
                        setShowAdsDiv_state(false)
                        clearInterval(interval)
                        Swal.fire({
                            title: "Success!",
                            icon: "success",
                        });
                        setRemoveTimer_state(false)
                        setHandle_clickAds_btnClick_state(false)
                        setTimerCount_state(15)
                    }
                    return newCount;
                });
            }, 1000);
        }
    }

    function handelAdsDiv_for_HilltopAds() {
        const div = document.getElementById('HilltopAds');

        if (div) {
            // Create a new <script> element
            const script = document.createElement('script');
            script.src = "//unusedframe.com/bzXKV.s/dAGalc0/YDWLdxi_YqW/5Mu/ZrXrIA/Felmf9Qu/ZQUllrk/PtTSYwwsNAj-Mw0LN/DFMctcN/jDAp2dMmzhQv0INmAc";
            script.async = true;
            script.referrerPolicy = 'no-referrer-when-downgrade';

            // Append the script to the div
            div.appendChild(script);
        }
        let checkIframeInterval = setInterval(() => {
            if (div.children[1].tagName === 'IFRAME') {
                clearInterval(checkIframeInterval)
                setTimeout(() => {
                    setRemoveTimer_state(true)
                    setProcessing_state((p) => p = false)
                }, 1000);
                let interval = setInterval(() => {
                    setTimerCount_state((prevCount) => {
                        const newCount = prevCount - 1;
                        if (newCount === -1) {
                            div.innerHTML = ''
                            setShowAdsDiv_state(false)
                            clearInterval(interval)
                            Swal.fire({
                                title: "Success!",
                                icon: "success",
                            });
                            setRemoveTimer_state(false)
                            setHandle_clickAds_btnClick_state(false)
                            setTimerCount_state(10)
                        }
                        return newCount;
                    });
                }, 1000);
            }
        }, 500);
    }

    function handelbtnClick(id) {
        setDisabledButtons_state((prevDisabled) => {
            if (!prevDisabled.includes(id)) {
                return [...prevDisabled, id];
            }
            return prevDisabled;
        });
    }

    function handle_onClickaAds(iframe, script) {
        let onClicka_video_ads_div = document.getElementById('onClicka_video_ads_div')
        setShowAdsDiv_state((p) => p = true)
        let video_slider = document.getElementsByClassName('video_slider')[0]
        let video_stop_traker = setInterval(() => {
            let ads_header__close_ad = document.getElementsByClassName('ads_header__close-ad')[0].children[0].innerText
            if (ads_header__close_ad === 'Close ad') {
                clearInterval(video_stop_traker)
                document.getElementById('onClicka_video_ads_div').innerHTML = ''
                document.querySelector(iframe).remove()
                document.querySelector(script).remove()
                video_slider.style.display = 'none'
                setShowAdsDiv_state((p) => p = false)
                Swal.fire({
                    title: "Success!",
                    icon: "success",
                });
                setHandle_clickAds_btnClick_state((p) => p = false)
            } else if (!ads_header__close_ad) {
                clearInterval(video_stop_traker)
                document.getElementById('onClicka_video_ads_div').innerHTML = ''
                document.querySelector(iframe).remove()
                document.querySelector(script).remove()
                video_slider.style.display = 'none'
                setShowAdsDiv_state((p) => p = false)
                Swal.fire({
                    title: "Success!",
                    icon: "success",
                });
                setHandle_clickAds_btnClick_state((p) => p = false)
            } else if (onClicka_video_ads_div.children[0].style.display === 'none') {
                clearInterval(video_stop_traker)
                document.getElementById('onClicka_video_ads_div').innerHTML = ''
                document.querySelector(iframe).remove()
                document.querySelector(script).remove()
                setShowAdsDiv_state((p) => p = false)
                Swal.fire({
                    icon: "error",
                    title: "Success!",
                    text: "Something went wrong!",
                });
                setHandle_clickAds_btnClick_state((p) => p = false)
            }
        }, 1000)
        video_slider.removeAttribute('class')
        video_slider.removeAttribute('style')
        video_slider.style.flexDirection = 'column'
        onClicka_video_ads_div.appendChild(video_slider)
        setProcessing_state((p) => p = false)
    }

    const handle_link_click = (e, link) => {
        setHandle_clickAds_btnClick_state(true);
        const newTab = window.open("", '_blank');
        if (!newTab) {
            return alert("Please Allow Popup in Your Browse to Earn Money!");
        }
        newTab.close();
        window.open(link, '_blank');
        window.open(`/waitRedirecting/?link=${encodeURIComponent(link)}`, '_blank', 'noopener noreferrer');
    };

    useEffect(() => {
        const handleStorageChange = () => {
            const clickSuccessStatus = localStorage.getItem('isSuccess');
            if (clickSuccessStatus === 'true') {
                localStorage.removeItem('isSuccess')
                setHandle_clickAds_btnClick_state(false)
                Swal.fire({
                    title: "Success!",
                    icon: "success",
                });
            } else if (clickSuccessStatus === 'false') {
                localStorage.removeItem('isSuccess')
                setHandle_clickAds_btnClick_state(false)
                Swal.fire({
                    icon: "error",
                    title: "Success!",
                    text: "Something went wrong!",
                });
            }
        };
        window.addEventListener('storage', handleStorageChange)
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    let buttonsObj = [
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: () => {
                OnClickaVideoAds('https://js.onclckmn.com/static/onclicka.js', '234995')
                setHandle_clickAds_btnClick_state(true)
                setShowAdsDiv_state(true)
                setProcessing_state((p) => p = true)
                handelbtnClick('btn1')
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: () => {
                OnClickaVideoAds('https://js.wpadmngr.com/static/adManager.js', '288449')
                setHandle_clickAds_btnClick_state(true)
                setShowAdsDiv_state(true)
                setProcessing_state((p) => p = true)
                handelbtnClick('btn2')
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: () => {
                const adSterrakeys = ['9053e4594f6f11cc52b1a92378164206', 'f897c99fe416f65a488b750d0f978646'];
                let randomNumber = Math.floor(Math.random() * adSterrakeys.length)
                handelAdsDiv_for_adSterra(adSterrakeys[randomNumber])
                setHandle_clickAds_btnClick_state(true)
                setShowAdsDiv_state(true)
                setProcessing_state((p) => p = true)
                handelbtnClick('btn3')
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: () => {
                handelAdsDiv_for_aAds()
                setHandle_clickAds_btnClick_state(true)
                setShowAdsDiv_state(true)
                setProcessing_state((p) => p = true)
                handelbtnClick('btn4')
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: () => {
                handelAdsDiv_for_HilltopAds()
                setHandle_clickAds_btnClick_state(true)
                setShowAdsDiv_state(true)
                setProcessing_state((p) => p = true)
                handelbtnClick('btn5')
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: () => {
                setHandle_clickAds_btnClick_state(true)
                setProcessing_state((p) => p = true)
                setOnClicka_clickadilla_state('onClicka')
                OnClickaVideoAds('https://js.onclckmn.com/static/onclicka.js', '287247')
                handelbtnClick('btn6')
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: () => {
                setHandle_clickAds_btnClick_state(true)
                setProcessing_state((p) => p = true)
                setOnClicka_clickadilla_state('clickAdilla')
                OnClickaVideoAds('https://js.wpadmngr.com/static/adManager.js', '287339')
                handelbtnClick('btn7')
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: (e) => {
                handle_link_click(e, 'https://poawooptugroo.com/4/8238196')
                handelbtnClick('btn8')
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: (e) => {
                handle_link_click(e, 'https://poawooptugroo.com/4/8238196')
                handelbtnClick('btn9')
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: (e) => {
                handle_link_click(e, 'https://poawooptugroo.com/4/8868626')
                handelbtnClick('btn10')
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: (e) => {
                handle_link_click(e, 'https://poawooptugroo.com/4/8585876')
                handelbtnClick('btn11')
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: (e) => {
                handle_link_click(e, 'https://poawooptugroo.com/4/8886349')
                handelbtnClick('btn12')
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: (e) => {
                handle_link_click(e, 'https://poawooptugroo.com/4/8886361')
                handelbtnClick('btn13')
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: (e) => {
                handle_link_click(e, 'https://poawooptugroo.com/4/8886370')
                handelbtnClick('btn14')
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: (e) => {
                handle_link_click(e, 'https://poawooptugroo.com/4/8886375')
                handelbtnClick('btn15')
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: (e) => {
                handle_link_click(e, 'https://loupush.com/9lMCqrCwt70=?')
                handelbtnClick('btn16')
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: (e) => {
                handle_link_click(e, 'https://pertlouv.com/iUyUq55zfnw=?')
                handelbtnClick('btn17')
            },
        },
    ]

    return (
        <div className="ml-auto flex flex-col justify-between  bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[94vh] mt-12">
            <div className='px-2 py-2'>
                <div className='text-2xl text-blue-600 font-semibold my-4 mx-2 select-none flex justify-between'>
                    View Ads to Earn
                </div>
                <div data-banner-id="6056470"></div>
                <div className='flex flex-col items-center my-6'>
                    <div className='flex gap-4'>
                        <div className='bg-purple-700 px-2 py-1 shadow font-bold text-white rounded-t-2xl'>Click Balance - {viewAds_firstTimeLoad_state.clickBalance}/{buttonsObj.length * 3}</div>
                        <div className='bg-purple-700 px-2 py-1 shadow font-bold text-white rounded-t-2xl'>Income - ₹{viewAds_firstTimeLoad_state.income}</div>
                    </div>
                    <div className='gap-2 justify-center bg-white px-6 py-3 shadow flex flex-wrap'>
                        {
                            buttonsObj.map((values, index) => (
                                <button key={index} disabled={handle_clickAds_btnClick_state || disabledButtons_state.includes('btn' + (index + 1)) ? true : false} className={`${handle_clickAds_btnClick_state || disabledButtons_state.includes('btn' + (index + 1)) ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-600 '} text-white px-4 py-1 rounded shadow flex flex-col items-center`} onClick={(e) => {
                                    values.handelButtonClick(e)
                                }}><span>{values.buttonTitle} {index + 1}</span><span>₹{values.amount}</span></button>
                            ))
                        }
                    </div>
                </div>
                <div id="container-f2e76b1a9af84306102d9f8675c030e8"></div>
                <div className={`z-[1] absolute top-0 left-0 right-0 bottom-0 bg-[#0101015d] flex justify-center items-center flex-col ${showAdsDiv_state ? '' : 'hidden'}`}>
                    {removeTimer_state && <div className='bg-gray-500 text-white px-2 h-10 text-center rounded-md -mb-[14px]'>Please Wait - {timerCount_state}sec</div>}
                    <div data-banner-id="6033510" ></div>
                    <div data-banner-id="1435822"></div>
                    <div id="adSterra"></div>
                    <div id="A_ads"></div>
                    <div id="HilltopAds"></div>
                    <div id='adVerticaAds'></div>
                    <div id="onClicka_video_ads_div" ></div>
                </div>
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
            {(processing_state || data_process_state) && <ProcessBgBlack />}
        </div>
    );
}

export default ViewAds;
