import React, { useEffect, useRef, useState } from 'react';
import Footer from '../../components/footer/footer';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import showNotificationWith_timer from '../../components/showNotificationWith_timer';
import showNotification from '../../components/showNotification';
import ProcessBgSeprate from '../../components/processBgSeprate/processBgSeprate'
import { Helmet } from 'react-helmet';
import io from "socket.io-client";
import earningSound from '../../components/earningSound'

const socket = io(import.meta.env.VITE_SERVER_URL, {
    withCredentials: true, // Allow cookies to be sent automatically
    transports: ["websocket"], // Ensure WebSocket transport
});

const ViewOfferWall = ({ setAvailableBalance_forNavBar_state }) => {
    const { encodedUrl } = useParams();
    let [data_process_state, setData_process_state] = useState(false);
    let [offerWallsData_state, setOfferWallsData_state] = useState([]);
    const [decodedUrl_state, setDecodedUrl_state] = useState('');
    const [iframeLoaded, setIframeLoaded] = useState(false);  // ✅ iframe load status
    const navigation = useNavigate();

    useEffect(() => {
        if (encodedUrl) {
            setDecodedUrl_state(decodeURIComponent(encodedUrl));
        }
    }, [encodedUrl]);

    useEffect(() => {
        setData_process_state(true);
        socket.emit("serverMessage_for_viewOfferWall_balance", { success: true }, (response) => {
            setData_process_state(false);
            if (response.error) {
                try {
                    const errorObj = JSON.parse(response.error);
                    console.error("Emit callback error:", errorObj);
                    showNotification(true, "Something went wrong, please try again.");
                } catch (parseError) {
                    console.error("Error parsing response error:", parseError);
                    showNotification(true, "Something went wrong, please try again.");
                }
            } else {
                setOfferWallsData_state(response.msg);
                setAvailableBalance_forNavBar_state(response.msg.available_balance);
            }
        });

        // Listener for real-time updates on offer wall balance
        const handleOfferWallBalance = (response) => {
            if (response.error) {
                try {
                    const errorObj = JSON.parse(response.error);
                    console.error("Real-time update error:", errorObj);
                    showNotification(true, "Something went wrong, please try again.");
                } catch (parseError) {
                    console.error("Error parsing real-time response error:", parseError);
                    showNotification(true, "Something went wrong, please try again.");
                } finally {
                    earningSound(true, false)
                }
            } else {
                setOfferWallsData_state(response.msg);
                setAvailableBalance_forNavBar_state(response.msg.available_balance);
                earningSound(true, true)
            }
        };

        socket.on("serverMessage_for_viewOfferWall_balance", handleOfferWallBalance);

        // Socket connection error listener
        const handleConnectError = (err) => {
            try {
                if (typeof err.message === "string" && err.message.startsWith("{")) {
                    const errorObj = JSON.parse(err.message);
                    console.error("Connection error:", errorObj);

                    if (errorObj.jwtMiddleware_token_not_found_error || errorObj.jwtMiddleware_user_not_found_error) {
                        navigation('/login');
                    } else if (errorObj.jwtMiddleware_error) {
                        showNotificationWith_timer(true, 'Your session has expired. Please log in again.', '/login', navigation);
                    } else {
                        showNotification(true, "Something went wrong, please try again.");
                    }
                } else {
                    console.error("Non-JSON WebSocket error:", err.message);
                    showNotification(true, "WebSocket connection failed. Please try again.");
                }
            } catch (parseError) {
                console.error("Error parsing connection error message:", parseError);
                showNotification(true, "Something went wrong, please try again.");
            }
        };

        socket.on("connect_error", handleConnectError);
        return () => {
            socket.off("serverMessage_for_viewOfferWall_balance", handleOfferWallBalance);
            socket.off("connect_error", handleConnectError);
        };
    }, []);

    return (
        <>
            <Helmet>
                <title>EarnWiz - OfferWalls</title>
                <meta name="description" content="Share your opinions and earn rewards on EarnWiz by filling out surveys. Visit our fill survey earnings page and start earning today." />
            </Helmet>
            {data_process_state ? (
                <div className="ml-auto flex flex-col justify-between bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[93.3dvh] mt-[6.7dvh]">
                    <ProcessBgSeprate />
                </div>
            ) : (
                <div className="ml-auto flex flex-col justify-between bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[93.3dvh] mt-[6.7dvh] custom-scrollbar">
                    <div className="px-2 py-2">
                        <div className="text-2xl text-blue-600 font-semibold my-4 mx-2 select-none flex justify-between">
                            OfferWalls
                        </div>
                        <div className='px-4 py-2'>
                            <div className="bg-white p-4 sm:p-6 shadow-md rounded-lg relative flex flex-col justify-center items-center">
                                <h2 className="text-xl font-semibold text-gray-800 mb-5">💰 Earnings Summary</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 text-gray-700">
                                    <div className="bg-gray-100 p-3 rounded-lg text-center">
                                        <div className="font-semibold">Today Earnings:</div>
                                        <div className="text-green-600 font-bold ml-2">₹{offerWallsData_state.today_offerWallIncome || 0}</div>
                                    </div>
                                    <div className="bg-gray-100 p-3 rounded-lg text-center">
                                        <div className="font-semibold">Total offerWalls:</div>
                                        <div className="text-blue-600 font-bold ml-2">{offerWallsData_state.total_offerWall || 0}</div>
                                    </div>
                                    <div className="bg-gray-100 p-3 rounded-lg text-center">
                                        <div className="font-semibold">Completed:</div>
                                        <div className="text-green-600 font-bold ml-2">{offerWallsData_state.today_completed || 0}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ✅ Loader ya alternative content jab tak iframe load nahi hota */}
                        <div className="px-4 py-2">
                            {!iframeLoaded && (
                                <div className="flex justify-center items-center min-h-[300px]">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
                                </div>
                            )}

                            <iframe
                                className='rounded-lg'
                                style={{ width: "100%", height: `1000px`, border: "none", display: iframeLoaded ? "block" : "none" }}
                                scrolling="yes"
                                src={decodedUrl_state}
                                onLoad={() => setIframeLoaded(true)}  // ✅ Jab iframe load ho jaye, state update ho
                            />
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

export default ViewOfferWall;
