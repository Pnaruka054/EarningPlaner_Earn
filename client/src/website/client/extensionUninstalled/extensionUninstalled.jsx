import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ExtensionUninstalled = ({ setshow_NavBar_state }) => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        setshow_NavBar_state(true);
    }, [setshow_NavBar_state]);

    useEffect(() => {
        // URL query parameters को पढ़ें
        const params = new URLSearchParams(location.search);
        const uninstallParam = params.get("uninstall");

        // यदि uninstall=true न हो तो redirect करें
        if (uninstallParam !== "true") {
            navigate("/");
        } else {
            // अगर सही है, तो localStorage से isExtension हटाएं
            localStorage.removeItem("isExtension");
        }
    }, [location, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <h1 className="text-2xl font-bold text-center mb-4">
                    Extension Uninstalled
                </h1>
                <p className="text-gray-700 text-center mb-6">
                    It looks like you have uninstalled the extension. Some features may not work as expected.
                    Please reinstall the extension to enjoy full functionality.
                </p>
                <a
                    href="/"
                    className="block text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                >
                    Go to Homepage
                </a>
            </div>
        </div>
    );
};

export default ExtensionUninstalled;
