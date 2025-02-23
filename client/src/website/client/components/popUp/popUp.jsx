import React from 'react';
import { useNavigate } from 'react-router-dom';
import showNotification from '../showNotification';
import showNotificationWith_timer from '../showNotificationWith_timer';

const PopUp = ({ heading, btn1_text, btn2_text, setLogOut_btnClicked }) => {
    const navigation = useNavigate(); // Initialize the navigation function

    // Function to handle JWT removal and logout
    const handleJWTRemoval = async () => {
        // Call the logout API to remove the JWT from cookies
        const baseUrl = import.meta.env.VITE_SERVER_URL; // Access the VITE_ variable
        const response = await fetch(`${baseUrl}/userRoute/logout`, {
            method: 'POST',
            credentials: 'include', // Include cookies in the request
        });

        if (response.ok) {
            setLogOut_btnClicked(false); // Notify parent component that the user is logged out
            navigation('/login'); // Redirect to the login page
            showNotificationWith_timer(false, 'LogOut success!', '/', navigation);
        } else {
            console.error('Logout failed');
            showNotification(true, "Something went wrong, please try again.");
        }
    };

    return (
        <div className='fixed select-none top-0 left-0 right-0 bottom-0 z-[2] flex justify-center items-center bg-[#00000067]'>
            <div className='bg-white inline-block p-6 rounded-md shadow-xl'>
                <div className='text-xl font-medium'>
                    <p>{heading}</p>
                </div>
                <div className='flex justify-around mt-4'>
                    <button
                        onClick={handleJWTRemoval} // Call the function to remove JWT
                        className='px-4 py-1 font-medium text-lg text-white rounded-md bg-red-500'>
                        {btn1_text}
                    </button>
                    <button
                        onClick={() => {
                            setLogOut_btnClicked(false)
                            showNotificationWith_timer(true, 'LogOut canceled', '', navigation);
                        }}
                        className='px-4 py-1 font-medium text-lg text-white rounded-md bg-gray-500'>
                        {btn2_text}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PopUp;
