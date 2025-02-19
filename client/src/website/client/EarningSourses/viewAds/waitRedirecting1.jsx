import React, { useEffect, useState } from 'react';

const randomNumber = Math.floor(Math.random() * 3) + 1;
const WaitRedirecting = () => {
    const [redirectLink, setRedirectLink] = useState('');
    const [waitingTimer_state, setWaitingTimer_state] = useState(5);
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const link = queryParams.get('link');
        if (link) {
            setRedirectLink(decodeURIComponent(link));
        }
    }, []);

    useEffect(() => {
        let interval = setInterval(() => {
            setWaitingTimer_state((prev) => prev - 1);
        }, 1000);

        if (waitingTimer_state === randomNumber && redirectLink) {
            setIsRedirecting(true);
            sessionStorage.setItem('isUserClosed', 'true')
            clearInterval(interval);
            window.postMessage({ action: "takeTab", data: true }, "*");
            window.location.href = redirectLink.split('||')[0];
        }
        let isUserClosed = sessionStorage.getItem('isUserClosed')
        const handleBeforeUnload = (event) => {
            if (!isUserClosed) {
                localStorage.setItem('isSuccess', 'false');
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            clearInterval(interval);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [waitingTimer_state, redirectLink]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-50">
            <div className="bg-white p-8 rounded-xl shadow-lg w-96">
                <h2 className="text-3xl font-semibold text-center text-blue-600 mb-4">Please Wait...</h2>
                <p className="text-xl text-center text-gray-700 mb-4">We are processing</p>
                <div className="mt-4 text-center">
                    <p className="text-2xl font-bold text-blue-500">Redirect in : {waitingTimer_state} seconds</p>
                    <p className="text-sm text-gray-500 mt-4">Please stay on this page until you are redirected. If you close or navigate away, the process may be interrupted.</p>
                    <p className="text-sm text-red-500 font-semibold mt-2">Important: Do not close or refresh the window.</p>
                </div>
            </div>
        </div>
    );
}

export default WaitRedirecting;
