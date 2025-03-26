import { useEffect, useRef, useState } from 'react';

const UserNetworkStatusCheck = () => {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const networkStatusRef = useRef(null);

    const updateNetworkStatus = (message, classes, status) => {
        if (networkStatusRef.current) {
            networkStatusRef.current.innerHTML = `
                <div class="rounded-[5%] h-96 w-full font-bold text-white pt-1 drop-shadow select-none text-sm ${classes}">
                  ${message}
                </div>
            `;
            if (status === 'offline') {
                networkStatusRef.current.className = 'fixed top-0 bottom-0 right-0 left-0 bg-[#0005] z-10 text-center flex items-end';
            } else if (status === 'online') {
                setTimeout(() => {
                    networkStatusRef.current.className = 'hidden';
                }, 1200);
            }
        }
    };

    useEffect(() => {
        // First time user ka internet status check karega
        if (!navigator.onLine) {
            updateNetworkStatus('You are Offline', 'bg-gray-500 offlineAnimation', 'offline');
        } else {
            updateNetworkStatus('You are Online', 'bg-green-500 OnlineAnimation', 'online');
        }

        const handleOnline = () => {
            setIsOffline(false);
            updateNetworkStatus('You are Online', 'bg-green-500 OnlineAnimation', 'online');
        };

        const handleOffline = () => {
            setIsOffline(true);
            updateNetworkStatus('You are Offline', 'bg-gray-500 offlineAnimation', 'offline');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return <div id="networkStatus" ref={networkStatusRef} className="hidden" />;
};

export default UserNetworkStatusCheck;
