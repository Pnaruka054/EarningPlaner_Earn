import React, { useEffect, useState } from 'react';
import Footer from '../../components/footer/footer';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import showNotificationWith_timer from '../../components/showNotificationWith_timer';
import showNotification from '../../components/showNotification';
import ProcessBgSeprate from '../../components/processBgSeprate/processBgSeprate'
import { Helmet } from 'react-helmet';

const OfferWall = ({ setAvailableBalance_forNavBar_state }) => {
    let [data_process_state, setData_process_state] = useState(false);
    let [offerWallsData_state, setOfferWallsData_state] = useState([]);
    const navigation = useNavigate();

    const fetchData = async () => {
        setData_process_state(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/userIncomeRoute/user_offerWall_get`, {
                withCredentials: true
            });
            setOfferWallsData_state(response.data.msg);
            setAvailableBalance_forNavBar_state(response.data.msg.available_balance)
        } catch (error) {
            console.error(error);
            if (error.response.data.jwtMiddleware_token_not_found_error || error.response.data.jwtMiddleware_user_not_found_error) {
                navigation('/login');
            } else if (error.response.data.jwtMiddleware_error) {
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
            }
        } finally {
            setData_process_state(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    if (data_process_state) {
        return (
            <div className="ml-auto flex flex-col justify-between  bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[93.3dvh] mt-12">
                <ProcessBgSeprate />
            </div>
        )
    }

    return (
        <>
            <Helmet>
                <title>EarnWiz - OfferWalls</title>
                <meta name="description" content="Share your opinions and earn rewards on EarnWiz by filling out surveys. Visit our fill survey earnings page and start earning today." />
            </Helmet>
            <div className="ml-auto flex flex-col justify-between bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[93.3dvh] mt-12 custom-scrollbar">
                <div className="px-2 py-2">
                    <div className="text-2xl text-blue-600 font-semibold my-4 mx-2 select-none flex justify-between">
                        OfferWalls
                    </div>
                    <div className='px-4 py-2'>
                        <div className="bg-white shadow-md p-6 rounded-lg text-center mb-5">
                            <h2 className="text-xl font-semibold text-gray-800 mb-5">💰 Earnings Summary</h2>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-4 text-gray-700">
                                <div className="bg-gray-100 p-3 rounded-lg">
                                    <div className="font-semibold">Today Earnings:</div>
                                    <div className="text-green-600 font-bold ml-2">₹{offerWallsData_state.today_offerWallIncome || 0}</div>
                                </div>
                                <div className="bg-gray-100 p-3 rounded-lg">
                                    <div className="font-semibold">Total OfferWalls:</div>
                                    <div className="text-blue-600 font-bold ml-2">{offerWallsData_state.total_offerWall || 0}</div>
                                </div>
                                <div className="bg-gray-100 p-3 rounded-lg">
                                    <div className="font-semibold">Completed:</div>
                                    <div className="text-green-600 font-bold ml-2">{offerWallsData_state.today_completed || 0}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="px-4 py-2 grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {offerWallsData_state?.offerWallData_after_replace?.map((platform, index) => (
                            <div key={index} className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between items-center border transition">
                                <h3 className="text-lg font-semibold text-gray-800">{platform?.offerWallName}</h3>
                                <Link
                                    to={`/member/offer-wall/${encodeURIComponent(platform?.offerWallApiLink)}`}
                                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                >
                                    Start
                                </Link>
                            </div>
                        ))}
                    </div>
                    <div className='bg-white rounded shadow px-5 py-2 mt-3'>
                        <p className='text-center text-xl font-medium drop-shadow-[0_0_0.5px_blue] text-blue-600'>OfferWalls Instructions</p>
                        <hr className='mt-2 border' />
                        <ul className='mt-4 font-medium text-gray-500 drop-shadow-sm space-y-4'>
                            {
                                offerWallsData_state?.other_data_offerWalls_instructions?.map((value, index) => <li key={index} className='instruction-list-image' dangerouslySetInnerHTML={{ __html: value }}></li>)
                            }
                        </ul>
                    </div>
                </div>
                <div className='mt-3'>
                    <Footer />
                </div>
            </div>
        </>
    );
}

export default OfferWall;
