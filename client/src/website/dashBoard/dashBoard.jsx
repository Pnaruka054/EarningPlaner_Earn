import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import Watch_Video_icon from '../../assets/WatchVideo.png'
import Betting_games_icon from '../../assets/BettingGames.png'
import ClickShortenLink_icon from '../../assets/ClickShortenLink.png'
import ViewAds from '../../assets/ViewAds.png'
import Games from '../../assets/Games.png'
import OfferWall from '../../assets/OfferWall.png'
import Footer from '../components/footer/footer';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaSpinner } from "react-icons/fa";
import showNotificationWith_timer from '../components/showNotificationWith_timer'
import showNotification from '../components/showNotification'
import ProcessBgSeprate from '../components/processBgSeprate/processBgSeprate'
import { Helmet } from 'react-helmet';
import { FaBullhorn } from 'react-icons/fa';

const DashBoard = ({ getLogOut_btnClicked, setLogOut_btnClicked, setAvailableBalance_forNavBar_state }) => {
    const [userData_state, setUserData_state] = useState([[]]);
    let [data_process_state, setData_process_state] = useState(true);
    let dropdownRef = useRef(null)
    let logOut_btnRef = useRef(null)
    const [dropdownButtonValue_state, setDropdownButtonValue_state] = useState('');
    const [monthlyData_state, setMonthlyData_state] = useState([]);
    const navigation = useNavigate();

    // handle dropdown buttons valus
    function dropdownButtonValue(e) {
        setDropdownButtonValue_state(e.target.innerText);
        dropdownRef.current.classList.add('hidden')
    }

    // filter user selected month
    useEffect(() => {
        setMonthlyData_state(
            userData_state?.user_date_records?.filter((value) => {
                return dropdownButtonValue_state === value.monthName
            })
        )

        setUserData_state(prev => ({
            ...prev,
            user_month_records: [
                ...(prev?.user_month_records ?? []).filter(value => value.monthName === dropdownButtonValue_state),
                ...(prev?.user_month_records ?? []).filter(value => value.monthName !== dropdownButtonValue_state)
            ]
        }));

    }, [dropdownButtonValue_state]);

    // get all data from server
    useEffect(() => {
        const fetchData = async () => {
            setData_process_state(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/userRoute/userDataGet_dashboard`, {
                    withCredentials: true
                });
                localStorage.setItem("user", response?.data?.msg?.userEmail);
                setUserData_state(response?.data?.msg);
                setDropdownButtonValue_state(response?.data?.msg?.user_month_records[0]?.monthName)
                setAvailableBalance_forNavBar_state(response?.data?.msg?.userAvailableBalance);
            } catch (error) {
                console.error(error);
                if (error?.response?.data?.jwtMiddleware_token_not_found_error || error?.response?.data?.jwtMiddleware_user_not_found_error) {
                    navigation('/login');
                } else if (error?.response?.data?.jwtMiddleware_error) {
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

    useEffect(() => {
        const handle_userOnline = () => {
            fetchData();
            alert("sdfhskfhskfshf")
        };

        window.addEventListener('online', handle_userOnline);

        return () => {
            window.removeEventListener('online', handle_userOnline);
        };
    }, []);

    // handle outside click from month dropdown select
    useEffect(() => {
        const handleClickOutside = (e) => {
            e.stopPropagation();
            dropdownRef.current?.classList.add("hidden");
        };

        window.addEventListener("click", handleClickOutside);

        return () => {
            window.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <>
            <Helmet>
                <title>EarnWiz Member Dashboard</title>
                <meta name="description" content="Access your EarnWiz dashboard to manage your account, view earnings, and track tasks effortlessly. Stay updated with notifications and insights." />
            </Helmet>
            {data_process_state ? (
                <div className="ml-auto flex flex-col justify-between bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[93.3dvh] mt-[6.7dvh]">
                    <ProcessBgSeprate />
                </div>
            ) : (
                <div onScroll={(e) => {
                    e.stopPropagation();
                    dropdownRef.current.classList.add('hidden');
                }} className="ml-auto bg-[#ecf0f5] flex flex-col justify-between w-full md:w-[75%] lg:w-[80%] overflow-auto h-[93.3dvh] mt-[6.7dvh] custom-scrollbar">
                    <div className='px-2 py-1 select-none'>
                        <div className='text-2xl text-blue-600 font-semibold my-4 mx-2 flex justify-between'>
                            <h1>Dashboard</h1>
                            <button ref={logOut_btnRef} onClick={() => setLogOut_btnClicked(true)} className='text-lg border border-red-500 hover:bg-red-500 hover:text-white px-3 py-1 rounded-lg text-red-500'>
                                {getLogOut_btnClicked ? <FaSpinner className="animate-spin" /> : "LogOut"}
                            </button>
                        </div>
                        <div className="grid grid-cols-2 grid-rows-2 grid-flow-col font-poppins mb-5 text-md sm:text-xl text-center">
                            <Link to="/member/view-ads" className="bg-gradient-to-r from-green-500 to-green-600 text-white relative h-44 m-3 p-2 rounded-xl shadow-lg flex flex-col space-y-2 items-center justify-center hover_on_image_with_div">
                                <div className="font-semibold">View Ads</div>
                                <div className="z-[1] text-lg font-bold">
                                    ₹{Array.isArray(userData_state.user_month_records) && userData_state.user_month_records[0] ? userData_state.user_month_records[0]?.earningSources?.view_ads?.income || '0.000' : '0.000'}
                                </div>
                                <img src={ViewAds} className="absolute bottom-3 right-3 w-16 opacity-20 hover_on_image" alt="View Ads" />
                            </Link>

                            <Link to="/member/click-shorten-link" className="bg-gradient-to-r p-2 from-green-500 to-green-600 text-white relative h-44 m-3 rounded-xl shadow-lg flex flex-col space-y-2 items-center justify-center hover_on_image_with_div">
                                <div className="font-semibold">Click Shorten Link</div>
                                <div className="z-[1] text-lg font-bold">
                                    ₹{Array.isArray(userData_state.user_month_records) && userData_state.user_month_records[0] ? userData_state.user_month_records[0]?.earningSources?.click_short_link?.income || '0.000' : '0.000'}
                                </div>
                                <img src={ClickShortenLink_icon} className="absolute bottom-3 right-3 w-16 opacity-20 hover_on_image" alt="Click Shorten Link" />
                            </Link>

                            <Link to="/member/offer-wall" className="bg-gradient-to-r from-green-500 to-green-600 text-white relative h-44 m-3 p-2 rounded-xl shadow-lg flex flex-col space-y-2 items-center justify-center hover_on_image_with_div">
                                <div className="font-semibold">OfferWalls</div>
                                <div className="z-[1] text-lg font-bold">
                                    ₹{Array.isArray(userData_state.user_month_records) && userData_state.user_month_records[0] ? userData_state.user_month_records[0]?.earningSources?.offerWall?.income || '0.000' : '0.000'}
                                </div>
                                <img src={OfferWall} className="absolute bottom-3 right-3 w-16 opacity-20 hover_on_image" alt="OfferWall" />
                            </Link>

                            <Link to="/member/refer-and-earn" className="bg-gradient-to-r from-green-500 to-green-600 text-white relative h-44 m-3 p-2 rounded-xl shadow-lg flex flex-col space-y-2 items-center justify-center hover_on_image_with_div">
                                <div className="font-semibold">Referral Income</div>
                                <div className="z-[1] text-lg font-bold">
                                    ₹{Array.isArray(userData_state.user_month_records) && userData_state.user_month_records[0] ? userData_state.user_month_records[0]?.earningSources?.referral_income?.income || '0.000' : '0.000'}
                                </div>
                                <img src={Watch_Video_icon} className="absolute bottom-3 right-3 w-16 opacity-20 hover_on_image" alt="Referral Income" />
                            </Link>
                        </div>
                        <div className="w-full mt-4 bg-white border border-blue-500 rounded-lg shadow-md mb-4">
                            <div className="bg-red-800 text-white p-4 rounded-t-lg flex items-center space-x-2">
                                <FaBullhorn />
                                <span>Announcements</span>
                                <span className="relative flex size-3">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                                    <span className="relative inline-flex size-3 rounded-full bg-red-500"></span>
                                </span>
                            </div>
                            <div className="p-4 space-y-4 overflow-auto hidden-scrollbar">
                                {userData_state?.other_data_announcementsArray?.map((item, index) => (
                                    <div key={index} className='border-b pb-2'>
                                        <span className="text-gray-500 text-sm whitespace-nowrap mb-15">
                                            {item.announcementTime}
                                        </span>
                                        <div dangerouslySetInnerHTML={{ __html: item?.announcementMessage }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='flex justify-center mt-3'>
                            <div className='relative'>
                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    dropdownRef.current.classList.toggle('hidden');
                                }} className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg w-48 justify-between px-4 py-2 text-center inline-flex items-center" type="button">
                                    <span>{dropdownButtonValue_state}</span>
                                    <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                    </svg>
                                </button>
                                <div ref={dropdownRef} id="dropdown" className="bg-white hidden z-[1] rounded-md absolute left-0 right-0 max-h-52 overflow-auto">
                                    <ul onClick={dropdownButtonValue} className="py-2 text-sm">
                                        {userData_state.user_month_records?.map((monthlyData, index) => (
                                            <li key={index} className="block px-4 py-2 text-black hover:bg-slate-100 cursor-pointer">
                                                {monthlyData.monthName}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-auto mt-3 h-[300px] border rounded-lg shadow-lg bg-white custom-scrollbar">
                            <table className="table-auto border-collapse min-w-[370px] w-full">
                                <thead className="bg-green-500 text-white sticky text-sm sm:text-lg top-0">
                                    <tr>
                                        <th className="text-start px-2 md:px-4 py-3 border border-gray-300">Date</th>
                                        <th className="text-start px-2 md:px-4 py-3 border border-gray-300">Self Earnings</th>
                                        <th className="text-start px-2 md:px-4 py-3 border border-gray-300">Referral Earnings</th>
                                        <th className="text-start px-2 md:px-4 py-3 border border-gray-300">Total Earnings</th>
                                    </tr>
                                </thead>
                                <tbody className='text-sm sm:text-lg'>
                                    {monthlyData_state && monthlyData_state.length > 0 ? (
                                        monthlyData_state.reverse().map((table_values, index) => (
                                            <tr key={index} className="odd:bg-gray-100 even:bg-gray-50">
                                                <td className="sm:px-4 py-2 px-2 md:py-4 border border-gray-300">{table_values.date}</td>
                                                <td className="sm:px-4 py-2 px-2 md:py-4 border border-gray-300 text-green-600 font-semibold">₹{table_values.self_earnings || '0.000'}</td>
                                                <td className="sm:px-4 py-2 px-2 md:py-4 border border-gray-300 text-blue-600 font-semibold">₹{table_values.referral_earnings || '0.000'}</td>
                                                <td className="sm:px-4 py-2 px-2 md:py-4 border border-gray-300 text-black font-bold">₹{table_values.Total_earnings || '0.000'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4">
                                                <div className="h-[200px] flex justify-center items-center">
                                                    <div className="text-center text-gray-500 font-semibold">💰 No Earnings Yet! Start Now!</div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className='mt-3'>
                        <Footer />
                    </div>
                </div>
            )}
        </>
    );
}

export default DashBoard;
