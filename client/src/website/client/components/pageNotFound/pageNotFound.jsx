import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = ({ setshow_NavBar_state }) => {
    useEffect(() => {
        setshow_NavBar_state(true);
    }, [setshow_NavBar_state]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-800 px-4">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-red-500 mb-4">Oops! 😵</h1>
                <p className="text-xl mb-6 text-gray-600">
                    It seems like you've taken a wrong turn. Don't worry, we'll get you back on track! 🚀
                </p>
                <p className="text-lg font-medium text-gray-500">404 - Page Not Found 🕵️‍♂️</p>
                <Link
                    to="/"
                    className="mt-6 inline-block px-8 py-3 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition duration-300"
                >
                    Go Back Home 🏠
                </Link>
            </div>
        </div>
    );
};

export default PageNotFound;
