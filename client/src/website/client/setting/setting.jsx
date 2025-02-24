import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../components/footer/footer';
import ProcessBgBlack from '../components/processBgBlack/processBgBlack';
import showNotificationWith_timer from '../components/showNotificationWith_timer';
import showNotification from '../components/showNotification';
import formatTime from '../components/formatTime';
import ProcessBgSeprate from '../components/processBgSeprate/processBgSeprate'

const Setting = ({ setAvailableBalance_forNavBar_state }) => {
    // States for ChangePassword component
    const [currentPassword_state, setCurrentPassword_state] = useState('');
    const [newPassword_state, setNewPassword_state] = useState('');
    const [confirmPassword_state, setConfirmPassword_state] = useState('');
    const [availableEmail_state, setavailableEmail_state] = useState('');
    const [newEmail_state, setNewEmail_state] = useState('');
    const [email_address_state, setEmail_address_state] = useState('');
    let [data_process_state, setData_process_state] = useState(false);
    let [submit_process_state, setSubmit_process_state] = useState(false);

    const navigation = useNavigate();

    const fetchData = async () => {
        setData_process_state(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/userRoute/userpassword_and_email_get`, {
                withCredentials: true
            });
            setAvailableBalance_forNavBar_state(response.data.msg.available_balance)
            setavailableEmail_state(response.data.msg.email_address)
        } catch (error) {
            console.error(error);
            if (error?.response?.data?.jwtMiddleware_token_not_found_error || error?.response?.data?.jwtMiddleware_user_not_found_error) {
                navigation('/login');
            } else if (error?.response?.data?.jwtMiddleware_error) {
                showNotificationWith_timer(true, 'Your session has expired. Please log in again.', '/login', navigation);
            } else {
                showNotification(true, "Something went wrong, please try again.");
            }
        } finally {
            setData_process_state(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    const location = useLocation();

    useEffect(() => {
        return () => Swal.close(); // ✅ Route change hone par Swal close ho jayega
    }, [location]);

    const userDataUpdate_patch = async (obj) => {
        setSubmit_process_state(true);
        try {
            const response = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/userRoute/userpassword_and_email_patch`, obj, {
                withCredentials: true
            });
            fetchData()
            showNotification(false, response?.data?.msg);
        } catch (error) {
            console.error(error);
            if (error?.response?.data?.jwtMiddleware_token_not_found_error || error?.response?.data?.jwtMiddleware_user_not_found_error) {
                navigation('/login');
            } else if (error?.response?.data?.jwtMiddleware_error) {
                showNotificationWith_timer(true, 'Your session has expired. Please log in again.', '/login', navigation);
            } else {
                showNotification(true, "Something went wrong, please try again.");
            }

            if (error?.response?.data?.error_msg === 'Already Email update reset registered') {
                const { error_msg, time_left } = error.response.data;
                if (error_msg === 'Already Email update reset registered') {
                    Swal.fire({
                        toast: true,
                        title: 'Please wait before trying again.',
                        html: `Time remaining: <b>${formatTime(time_left)}</b>`,
                        icon: 'info',
                        timer: time_left,
                        timerProgressBar: true,
                        position: 'top-right',
                        showConfirmButton: false,
                        allowOutsideClick: true,  // ✅ Now dismisses when clicked outside
                        didOpen: () => {
                            const b = Swal.getHtmlContainer().querySelector('b');
                            const countdownInterval = setInterval(() => {
                                if (Swal.isVisible()) {
                                    b.textContent = formatTime(time_left);
                                } else {
                                    clearInterval(countdownInterval);
                                }
                            }, 1000);
                            ["click", "scroll", "wheel", "touchend"].forEach(event =>
                                window.addEventListener(event, () => Swal.close(), { once: true })
                            );
                        },
                    });


                }
            }

        } finally {
            setSubmit_process_state(false);
        }
    }

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword_state === currentPassword_state) {
            return
        }
        let obj = {
            currentPassword_state,
            newPassword_state
        }
        userDataUpdate_patch(obj)
    };

    const handleChangeEmail = async (e) => {
        e.preventDefault();
        if (email_address_state !== newEmail_state) {
            return
        }
        let obj = {
            email_address: newEmail_state
        }
        userDataUpdate_patch(obj)
    };
    if (data_process_state) {
        return (
            <div className="ml-auto flex flex-col justify-between  bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[94vh] mt-12">
                <ProcessBgSeprate />
            </div>
        )
    }
    return (
        <div className="ml-auto flex flex-col justify-between bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[94vh] mt-12">
            <div className='px-2 py-2'>
                <div className='text-2xl text-blue-600 font-semibold my-4 mx-2 select-none flex justify-between'>
                    Settings
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Change Password</h3>
                    <form onSubmit={handleChangePassword} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <div className="mb-3">
                            <label className="text-sm font-semibold text-gray-700">Current Password</label>
                            <input
                                type="password"
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                                placeholder="Enter current password"
                                value={currentPassword_state || ''}
                                onChange={(e) => setCurrentPassword_state(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="text-sm font-semibold text-gray-700">New Password</label>
                            <input
                                type="password"
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                                placeholder="Enter new password"
                                value={newPassword_state || ''}
                                onChange={(e) => setNewPassword_state(e.target.value)}
                                pattern=".{8,}"
                                title="Password must be at least 8 characters long."
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="text-sm font-semibold text-gray-700">Confirm New Password</label>
                            <input
                                type="password"
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                                placeholder="Re-enter new password"
                                value={confirmPassword_state || ''}
                                onChange={(e) => setConfirmPassword_state(e.target.value)}
                                pattern=".{8,}"
                                title="Password must be at least 8 characters long."
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submit_process_state}
                            className={`w-full py-3 font-semibold text-white rounded-md transition ${!submit_process_state ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {!submit_process_state ? 'Update Password' : <i className="fa-solid fa-spinner fa-spin"></i>}
                        </button>
                    </form>

                    {/* Change Email Section */}
                    <h2 className="text-xl font-bold text-gray-800 mt-6 mb-2">📧 Update Your Email</h2>
                    <p className="text-gray-600 text-sm mb-4">Make sure to enter a valid email address that you have access to.</p>

                    <form onSubmit={handleChangeEmail} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <div className="mb-3">
                            <label className="text-sm font-semibold text-gray-700">Current Email</label>
                            <input
                                type="text"
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100"
                                value={availableEmail_state || ''}
                                readOnly
                                disabled
                            />
                        </div>
                        <div className="mb-3">
                            <label className="text-sm font-semibold text-gray-700">New Email</label>
                            <input
                                type="email"
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                                placeholder="Enter new email"
                                value={newEmail_state || ''}
                                onChange={(e) => setNewEmail_state(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="text-sm font-semibold text-gray-700">Confirm New Email</label>
                            <input
                                type="email"
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                                placeholder="Re-enter new email"
                                value={email_address_state || ''}
                                onChange={(e) => setEmail_address_state(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submit_process_state}
                            className={`w-full py-3 font-semibold text-white rounded-md transition ${!submit_process_state ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {!submit_process_state ? 'Update Email' : <i className="fa-solid fa-spinner fa-spin"></i>}
                        </button>
                    </form>
                </div>
            </div>
            {submit_process_state && <ProcessBgBlack />}
            <div className='mt-3'>
                <Footer />
            </div>
        </div>
    );
}

export default Setting;
