import { useEffect, useState } from "react";
import { FaAndroid, FaDownload } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

let globalDeferredPrompt = null; // ✅ Global variable to store the prompt

const AppInstallButton = () => {
    const [showInstallButton, setShowInstallButton] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Check if the app is running in standalone mode (PWA)
        if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone) {
            setIsStandalone(true);
            return;
        }

        const handler = (e) => {
            e.preventDefault(); // Block automatic prompt
            globalDeferredPrompt = e; // Store the event globally
            setShowInstallButton(true); // Show the install button
        };

        window.addEventListener("beforeinstallprompt", handler);

        // Cleanup function
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    useEffect(() => {
        // When location changes, check if the button should be shown again
        if (globalDeferredPrompt) {
            setShowInstallButton(true);
        }
    }, [location.pathname]);

    const handleInstallClick = async () => {
        if (globalDeferredPrompt) {
            globalDeferredPrompt.prompt(); // Show the install prompt
            const { outcome } = await globalDeferredPrompt.userChoice; // Wait for user choice
            console.log("User choice:", outcome); // Log user's choice (accepted or dismissed)
            globalDeferredPrompt = null; // Reset deferredPrompt after use
            setShowInstallButton(false); // Hide button after interaction
        } else {
            AppInstallPopup(); // Show manual installation instructions if prompt is unavailable
        }
    };

    // Hide button if app is already installed (PWA mode)
    if (isStandalone) return null;

    return (
        showInstallButton && (
            <div className="fixed bottom-4 right-4">
                <button
                    onClick={handleInstallClick}
                    className="relative flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 focus:outline-none"
                >
                    <FaAndroid className="w-8 h-8" />
                    <span className="absolute bottom-0 right-0 bg-white text-green-600 rounded-full p-1">
                        <FaDownload className="w-4 h-4" />
                    </span>
                </button>
            </div>
        )
    );
};

// Manual Install Popup
const AppInstallPopup = () => {
    Swal.fire({
        title: "How to Install App?",
        html: `
        <div class="text-left">
            <p><b>For Chrome (Android):</b></p>
            <ol class="list-decimal pl-4">
                <li>Open the browser menu (⋮ three dots).</li>
                <li>Tap on "<b>Add to Home Screen</b>".</li>
                <li>Click "Add" and the app will be installed.</li>
            </ol>
            <br>
            <p><b>For Safari (iPhone):</b></p>
            <ol class="list-decimal pl-4">
                <li>Click the "<b>Share</b>" button (⬆️).</li>
                <li>Select "<b>Add to Home Screen</b>".</li>
                <li>Tap "Add" to install the app.</li>
            </ol>
        </div>
        `,
        showConfirmButton: true,
        confirmButtonText: "Got it!",
        background: "#fff",
    });
};

export default AppInstallButton;
