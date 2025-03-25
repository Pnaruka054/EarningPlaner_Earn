import { useEffect, useState } from 'react';
import { FaAndroid, FaDownload } from 'react-icons/fa';

const AppInstallButton = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallButton, setShowInstallButton] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallButton(true);
        };

        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        setShowInstallButton(false);
        setDeferredPrompt(null);
    };

    return (
        showInstallButton && (
            <div className="fixed bottom-4 right-4">
                <button
                    onClick={handleInstallClick}
                    className="relative flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 focus:outline-none"
                >
                    {/* Main Android Icon */}
                    <FaAndroid className="w-8 h-8" />
                    {/* Overlayed Download Icon */}
                    <span className="absolute bottom-0 right-0 bg-white text-green-600 rounded-full p-1">
                        <FaDownload className="w-4 h-4" />
                    </span>
                </button>
            </div>
        )
    );
};

export default AppInstallButton;
