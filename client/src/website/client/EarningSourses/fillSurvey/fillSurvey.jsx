import React, { useEffect, useState } from 'react';
import ProcessBgBlack from '../../components/processBgBlack/processBgBlack';
import Footer from '../../components/footer/footer';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import showNotificationWith_timer from '../../components/showNotificationWith_timer';
import showNotification from '../../components/showNotification';
import ProcessBgSeprate from '../../components/processBgSeprate/processBgSeprate'

const FillSurvey = ({ setAvailableBalance_forNavBar_state }) => {
    let [data_process_state, setData_process_state] = useState(false);
    let [surveyWebsites_state, setSurveyWebsites_state] = useState([]);
    const navigation = useNavigate();


    const fetchData = async () => {
        setData_process_state(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/userIncomeRoute/user_survey_available_get`, {
                withCredentials: true
            });

            setSurveyWebsites_state(response.data.msg.surveysWebsites);

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
            <div className="ml-auto flex flex-col justify-between  bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[94vh] mt-12">
                <ProcessBgSeprate />
            </div>
        )
    }
    return (
        <div className="ml-auto flex flex-col justify-between bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[94vh] mt-12 custom-scrollbar">
            <div className="px-2 py-2">
                <div className="text-2xl text-blue-600 font-semibold my-4 mx-2 select-none flex justify-between">
                    Fill Surveys
                </div>
                <div className="px-4 py-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {surveyWebsites_state.map((platform, index) => (
                        <div key={index} className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between items-center border hover:shadow-lg transition">
                            <h3 className="text-lg font-semibold text-gray-800">{platform.surveyNetworkName}</h3>
                            <a href={platform.url} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                                Start Survey
                            </a>
                        </div>
                    ))}
                </div>
            </div>
            <div className='mt-3'>
                <Footer />
            </div>
        </div>
    );
}

export default FillSurvey;
