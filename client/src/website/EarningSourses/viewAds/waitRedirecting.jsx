import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

const WaitRedirecting = () => {
    const [redirectLink, setRedirectLink] = useState('');
    const [waitingTimer_state, setWaitingTimer_state] = useState(6);

    // Get redirect link from query params on mount
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const link = queryParams.get('link');
        if (link) {
            setRedirectLink(decodeURIComponent(link));
        }
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

    // Before unload handler to set localStorage if page is closed without success
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            const isSuccess = localStorage.getItem('isSuccess');
            if (!isSuccess) {
                localStorage.setItem('isSuccess', 'false');
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    // Redirect handler which sets localStorage and then redirects
    const handleRedirect = () => {
        if (redirectLink) {
            const parts = redirectLink.split('||');
            // Store necessary values in localStorage
            localStorage.setItem('isSuccess', parts[1] + '||' + parts[2]);
            window.location.href = parts[0];
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
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
