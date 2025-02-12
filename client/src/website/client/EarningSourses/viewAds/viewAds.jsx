import React, { useEffect, useRef, useState } from 'react';
import Footer from '../../components/footer/footer';
import ProcessBgBlack from '../../components/processBgBlack/processBgBlack';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HillTopBannerAds from '../../components/hillTopAds/hillTopAds';
import CountdownTimer from '../../components/countDownTimer/countDownTimer';

const ViewAds = ({ setAvailableBalance_forNavBar_state }) => {
    const [handle_clickAds_btnClick_state, setHandle_clickAds_btnClick_state] = useState(false);
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

    const handle_link_click = (link, btnName, amount) => {
        setHandle_clickAds_btnClick_state(true);
        const newTab = window.open("", '_blank');
        if (!newTab) {
            return alert("Please Allow Popup in Your Browse to Earn Money!");
        }
        newTab.close();
        window.open(link, '_blank');
        window.open(`/waitRedirecting/?link=${encodeURIComponent(link + '||' + btnName + '||' + amount)}`, '_blank', 'noopener noreferrer');
    };

    useEffect(() => {
        const handleStorageChange = () => {
            const clickSuccessStatus = localStorage.getItem('isSuccess');
            console.log(clickSuccessStatus);
            if (clickSuccessStatus && clickSuccessStatus.includes('btn')) {
                localStorage.removeItem('isSuccess');
                setHandle_clickAds_btnClick_state(false);

                if (viewAds_firstTimeLoad_state && viewAds_firstTimeLoad_state.clickBalance) {
                    const btnName = clickSuccessStatus.split('||')[0];

                    setDisabledButtons_state((prevDisabled) => {
                        if (!prevDisabled.includes(btnName)) {
                            return [...prevDisabled, btnName];
                        }
                        return prevDisabled;
                    });

                    const amount = clickSuccessStatus.split('||')[1];
                    const obj = {
                        disabledButtons_state: [...disabledButtons_state, btnName],
                        clickBalance: (parseFloat(viewAds_firstTimeLoad_state.clickBalance.split('/')[0]) + 1).toString() + "/" + viewAds_firstTimeLoad_state.clickBalance.split('/')[1],
                        btnClickEarn: amount
                    };

                    user_adsView_income_patch(obj)
                        .then(() => {
                            Swal.fire({
                                title: "Success!",
                                icon: "success",
                            });
                        })
                        .catch((error) => {
                            console.error("Error updating income:", error);
                        });
                }
            } else if (clickSuccessStatus === 'false') {
                localStorage.removeItem('isSuccess');
                setHandle_clickAds_btnClick_state(false);
                Swal.fire({
                    icon: "error",
                    title: "Success!",
                    text: "Something went wrong!",
                });
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [viewAds_firstTimeLoad_state]);

    let buttonsObj = [
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: function (e) {
                // hilltopads
                handle_link_click('https://grounded-flight.com/bB3.VV0oPx3nprvvbDm-VWJSZHDh0s2qM/DGg/4/NhjzY/y/L/TWY/w/OtD/gE2/NxjBMO', 'btn1', this.amount)
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: function (e) {
                // hilltopads
                handle_link_click('https://grounded-flight.com/bj3.V/0/Pj3vpYvYbem/V/JvZyDk0M2/M_Dlgl4XNRjxgL2NLITJYdw/OaDRgg2XOwDScK', 'btn2', this.amount)
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: function (e) {
                // hilltopads
                handle_link_click('https://firmopposite.com/b/3/V.0kPA3/pavNbfmdVUJOZ-DC0A2MM/DPgI4sN/jqk/0fLMTsYHwfO/DSg/2/OqT/UT', 'btn3', this.amount)
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: function (e) {
                // moneTagAds
                handle_link_click('https://poawooptugroo.com/4/8238196', 'btn4', this.amount)
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: function (e) {
                // moneTagAds
                handle_link_click('https://poawooptugroo.com/4/8238196', 'btn5', this.amount)
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: function (e) {
                // moneTagAds
                handle_link_click('https://poawooptugroo.com/4/8868626', 'btn6', this.amount)
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: function (e) {
                // moneTagAds
                handle_link_click('https://poawooptugroo.com/4/8585876', 'btn7', this.amount)
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: function (e) {
                // moneTagAds
                handle_link_click('https://poawooptugroo.com/4/8886349', 'btn8', this.amount)
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: function (e) {
                // moneTagAds
                handle_link_click('https://poawooptugroo.com/4/8886361', 'btn9', this.amount)
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: function (e) {
                // moneTagAds
                handle_link_click('https://poawooptugroo.com/4/8886370', 'btn10', this.amount)
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: function (e) {
                // moneTagAds
                handle_link_click('https://poawooptugroo.com/4/8886375', 'btn11', this.amount)
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: function (e) {
                // onClicka Landings
                handle_link_click('https://loupush.com/9lMCqrCwt70=?', 'btn12', this.amount)
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: function (e) {
                // clickadilla Landings
                handle_link_click('https://pertlouv.com/iUyUq55zfnw=?', 'btn13', this.amount)
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: function (e) {
                // adsterra Landings
                handle_link_click('https://www.effectiveratecpm.com/q5jtvigi?key=6ce245352a591a2584abf7a89393e668', 'btn14', this.amount)
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: function (e) {
                // adsterra Landings
                handle_link_click('https://www.effectiveratecpm.com/nnwrv5ztgk?key=115124ac92e9fd26b74eabc48c298b1b', 'btn15', this.amount)
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: function (e) {
                // adsterra Landings
                handle_link_click('https://www.effectiveratecpm.com/fhp0is9j?key=20050f2539da92b9243bbc662b5c12bf', 'btn16', this.amount)
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: function (e) {
                // yllix 
                handle_link_click('https://vdbaa.com/fullpage.php?section=General&pub=186424&ga=g', 'btn17', this.amount)
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: function (e) {
                // adoperator 
                handle_link_click('https://wwp.aisorc.com/redirect-zone/cad9dc8e', 'btn18', this.amount)
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: function (e) {
                // adoperator 
                handle_link_click('https://wwp.aisorc.com/redirect-zone/20cf34cc', 'btn19', this.amount)
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: function (e) {
                // bitcotasks 
                handle_link_click('https://bitcotasks.com/promote/44879', 'btn20', this.amount)
            },
        },
        {
            buttonTitle: 'Click On Ads',
            amount: '0.01',
            handelButtonClick: function (e) {
                // bitcotasks 
                handle_link_click('https://bitcotasks.com/promote/44879', 'btn21', this.amount)
            },
        },
    ]

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
                    <div className='gap-2 justify-center bg-white px-6 py-3 shadow flex flex-wrap relative'>
                        <div className={`${viewAds_firstTimeLoad_state.ViewAdsexpireTImer? 'flex':'hidden'} absolute top-0 bottom-0 left-0 right-0 bg-white bg-opacity-60 justify-center items-center`}>
                            <div className='flex flex-col items-center font-lexend text-2xl'>
                                <div className='text-center'>Come Back After</div>
                                <div className='text-4xl font-bold drop-shadow'>
                                    <CountdownTimer expireTime={viewAds_firstTimeLoad_state.ViewAdsexpireTImer} />
                                </div>
                            </div>
                        </div>
                        {
                            buttonsObj.map((values, index) => (
                                <button key={index} disabled={handle_clickAds_btnClick_state || disabledButtons_state.includes('btn' + (index + 1)) ? true : false} className={`${handle_clickAds_btnClick_state || disabledButtons_state.includes('btn' + (index + 1)) ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-600 '} text-white px-4 py-1 rounded shadow flex flex-col items-center`} onClick={(e) => {
                                    values.handelButtonClick(e)
                                }}><span>{values.buttonTitle} {index + 1}</span><span>₹{values.amount}</span></button>
                            ))
                        }
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
