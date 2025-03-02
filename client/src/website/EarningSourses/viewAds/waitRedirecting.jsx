import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

const WaitRedirecting = () => {
    const [redirectLink, setRedirectLink] = useState('');
    const [waitingTimer_state, setWaitingTimer_state] = useState(6);
    const [isAbort_state, setIsAbort_state] = useState(false);
    const channel = new BroadcastChannel("viewAds_channel");

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const link = queryParams.get('link');
        if (link) {
            setRedirectLink(decodeURIComponent(link));
        }
        channel.onmessage = (event) => {
            if (event.data === "isAbort") {
                setIsAbort_state(true)
            }
        };

        function handle_userStayOrNot() {
            let isExist = sessionStorage.getItem("isStay")
            if (!isExist) {
                channel.postMessage("isAbortFromWaitingPage")
            }
        }

        window.addEventListener("beforeunload", handle_userStayOrNot)
        return () => {
            channel.close(); // Cleanup channel on unmount
            window.removeEventListener("beforeunload", handle_userStayOrNot)
        };
    }, []);

    // For ads: inject external scripts
    useEffect(() => {
        const scripts = [
            { src: "https://kulroakonsu.net/88/tag.min.js", attributes: { 'data-zone': '132939', 'data-cfasync': 'false' } },
            { src: "https://js.onclckmn.com/static/onclicka.js", attributes: { 'data-admpid': '287247' } },
            { src: "https://js.wpadmngr.com/static/adManager.js", attributes: { 'data-admpid': '287339' } }
        ];

        const scriptElements = scripts.map(({ src, attributes }) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            Object.entries(attributes).forEach(([key, value]) => {
                script.setAttribute(key, value);
            });
            document.body.appendChild(script);
            return script;
        });

        return () => {
            scriptElements.forEach(script => document.body.removeChild(script));
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
            sessionStorage.setItem("isStay", "true")
            window.location.replace(redirectLink);
        }
    };

    return (
        <>
            <Helmet>
                <title>EarnWiz Verifying Click</title>
            </Helmet>
            <div className="flex items-center justify-center min-h-screen bg-blue-50">
                <div className="bg-white p-8 rounded-xl shadow-lg w-96">
                    <h2 className="text-3xl font-semibold text-center text-blue-600 mb-4">Please Wait...</h2>
                    <p className="text-xl text-center text-gray-700 mb-4">We are processing</p>
                    <div className="mt-4 text-center">
                        {waitingTimer_state > 0 ? (
                            <p className="text-2xl font-bold text-blue-500">
                                Redirect in: {waitingTimer_state} seconds
                            </p>
                        ) : (
                            <button
                                disabled={isAbort_state ? true : false}
                                className={`px-4 py-2 rounded text-white ${isAbort_state
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-500 hover:bg-blue-600"
                                    }`}
                                onClick={handleRedirect}
                            >
                                Click here to continue
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
        </>
    );
};

export default WaitRedirecting;
