import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios'
import ProcessBgBlack from '../../components/processBgBlack/processBgBlack';
import { AlertTriangle } from "lucide-react";

const WaitRedirecting = () => {
    const [redirectLink, setRedirectLink] = useState('');
    const [waitingTimer_state, setWaitingTimer_state] = useState(6);
    const [isAbort_state, setIsAbort_state] = useState(false);
    const [adBlockDetected_state, setAdBlockDetected_state] = useState(false);
    const channel = new BroadcastChannel("viewAds_channel");
    const [vpn_detected_state, setVpn_detected_state] = useState(false);
    const [data_process_state, setData_process_state] = useState(false);

    // Process query params and broadcast channel events
    useEffect(() => {
        const vpnChecker = async () => {
            setData_process_state(true)
            try {
                let response = await axios.get("https://bitcotasks.com/promote/41234")
                if (response.data.trim() === "Proxy Detected!") {
                    setVpn_detected_state(true)
                }
            } catch (error) {
                console.error(response)
            } finally {
                setData_process_state(false)
            }
        }
        vpnChecker()

        const queryParams = new URLSearchParams(window.location.search);
        const link = queryParams.get('link');
        if (link) {
            setRedirectLink(decodeURIComponent(link));
        }
        channel.onmessage = (event) => {
            if (event.data === "isAbort") {
                setIsAbort_state(true);
            }
        };

        function handle_userStayOrNot() {
            let isExist = sessionStorage.getItem("isStay");
            let idExist1 = sessionStorage.getItem('isStayOnPage')
            if (!isExist && !idExist1) {
                channel.postMessage("isAbortFromWaitingPage");
                sessionStorage.setItem("isStayOnPage", "true");
            }
        }

        window.addEventListener("beforeunload", handle_userStayOrNot);
        return () => {
            channel.close(); // Cleanup channel on unmount
            window.removeEventListener("beforeunload", handle_userStayOrNot);
        };
    }, []);

    // Load external ad scripts and detect ad blockers
    useEffect(() => {
        const scripts = [
            { src: "https://kulroakonsu.net/88/tag.min.js", attributes: { 'data-zone': '132939', 'data-cfasync': 'false' } },
            { src: "https://js.onclckmn.com/static/onclicka.js", attributes: { 'data-admpid': '287247' } },
            { src: "https://js.wpadmngr.com/static/adManager.js", attributes: { 'data-admpid': '287339' } }
        ];

        let loadedScripts = 0;
        const scriptElements = scripts.map(({ src, attributes }) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            Object.entries(attributes).forEach(([key, value]) => {
                script.setAttribute(key, value);
            });

            // If script loads successfully
            script.onload = () => {
                loadedScripts++;
            };

            // If script fails to load (likely blocked by an ad blocker)
            script.onerror = () => {
                setAdBlockDetected_state(true);
            };

            document.body.appendChild(script);
            return script;
        });

        return () => {
            scriptElements.forEach(script => {
                document.body.removeChild(script);
            });
        };
    }, []);
    // Load external ad scripts for hilltop ads.
    useEffect(() => {
        const scriptContainer = document.getElementById("script-container");

        // Pehli Script
        const script1 = document.createElement("script");
        script1.src = "\/\/shady-ride.com\/bNXOVXs.doGwlj0aY\/WvdtiLYdWw5kunZ\/XrII\/ZeEmJ9\/urZFULlJkyPSTQYpxeNyzGcMxhMhDng-t\/Nej\/EU3JNkz\/ElwjOfQT";
        script1.async = true;
        script1.referrerPolicy = "no-referrer-when-downgrade";

        // Dusri Script
        const script2 = document.createElement("script");
        script2.src = "\/\/bechipivy.com\/c\/D\/9s6lb.2Z5\/l\/SQW-Qo9GNSjAEC3\/NqzsEUyuMaCQ0Y2jMeT\/c_3xMqTCIfxx";
        script2.async = true;
        script2.referrerPolicy = "no-referrer-when-downgrade";

        // Scripts ko add karna
        scriptContainer.appendChild(script1);
        scriptContainer.appendChild(script2);

        return () => {
            // Cleanup: Scripts remove karna
            scriptContainer.removeChild(script1);
            scriptContainer.removeChild(script2);
        };
    }, []);

    // Timer countdown useEffect
    useEffect(() => {
        let interval = null;
        if (waitingTimer_state > 0) {
            interval = setInterval(() => {
                setWaitingTimer_state(prev => prev - 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [waitingTimer_state]);

    // Redirect handler which sets localStorage and then redirects
    const handleRedirect = () => {
        if (redirectLink) {
            channel.postMessage(`isSuccess`);
            sessionStorage.setItem("isStay", "true");
            window.location.replace(redirectLink);
        }
    };

    // If ad blocker detected, render an error page
    if (adBlockDetected_state) {
        return (
            <>
                <Helmet>
                    <title>Ad Blocker Detected</title>
                </Helmet>
                <div className="flex items-center justify-center min-h-screen px-4">
                    <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
                        <AlertTriangle className="text-red-600 w-12 h-12 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-red-600 mb-2">Ad Blocker Detected</h2>
                        <p className="text-lg text-gray-700">
                            It appears that you are using an ad blocker. Please disable your ad blocker to continue your earnings.
                        </p>
                    </div>
                </div>
            </>
        );
    }

    if (vpn_detected_state) {
        return (
            <>
                <Helmet>
                    <title>Proxy Detected</title>
                </Helmet>
                <div className="flex items-center justify-center min-h-screen px-4">
                    <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
                        <AlertTriangle className="text-red-600 w-12 h-12 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-red-600 mb-2">Proxy Detected</h2>
                        <p className="text-lg text-gray-700">
                            We have detected that you are using a Proxy. Please disable your Proxy to continue your earnings.
                        </p>
                    </div>
                </div>
            </>
        );
    }

    // Main content if no ad blocker is detected
    return (
        <>
            <Helmet>
                <title>EarnWiz Verifying Click</title>
            </Helmet>
            <div className="flex flex-col items-center justify-center overflow-auto custom-scrollbar min-h-screen bg-blue-50">
                <div className='mb-5' id="script-container"></div>
                <div className="bg-white p-8 rounded-xl shadow-lg w-full sm:w-96">
                    <h2 className="text-3xl font-semibold text-center text-blue-600 mb-4">Please Wait...</h2>
                    <p className="text-xl text-center text-gray-700 mb-4">We are processing</p>
                    <div className="mt-4 text-center">
                        {waitingTimer_state > 0 ? (
                            <p className="text-2xl font-bold text-blue-500">
                                Redirect in: {waitingTimer_state} seconds
                            </p>
                        ) : (
                            <button
                                disabled={isAbort_state}
                                className={`px-4 py-2 rounded text-white ${isAbort_state
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-500 hover:bg-blue-600"
                                    }`}
                                onClick={handleRedirect}
                            >
                                Claim Bonus
                            </button>
                        )}
                        <p className="text-sm text-gray-500 mt-4">
                            Please stay on this page until you are redirected.
                        </p>
                        <p className="text-sm text-red-500 font-semibold mt-2">
                            Important: Do not close or refresh the window.
                        </p>
                    </div>
                </div>
            </div>
            {data_process_state && <ProcessBgBlack />}
        </>
    );
};

export default WaitRedirecting;