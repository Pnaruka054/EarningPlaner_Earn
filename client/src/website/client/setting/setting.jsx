import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/footer/footer';

const Setting = () => {
    // States for ChangePassword component
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [submitProcessPassword, setSubmitProcessPassword] = useState(true);

    // States for ChangeEmail component
    const [newEmail, setNewEmail] = useState('');
    const [gmail_address, setGmail_address] = useState('');
    const [currentEmail, setCurrentEmail] = useState('psadfh');
    const [submitProcessEmail, setSubmitProcessEmail] = useState(true);

    const handleChangePassword = async (e) => {
        e.preventDefault();

    };

    const handleChangeEmail = async (e) => {
        e.preventDefault();

    };

    return (
        <div className="ml-auto flex flex-col justify-between bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[94vh] mt-12">
            <div className='px-2 py-2'>
                <div className='text-2xl text-blue-600 font-semibold my-4 mx-2 select-none flex justify-between'>
                    Settings
                </div>
                <div className="px-4 py-2">
                    {/* Change Password Section */}
                    {passwordError && <div className="alert alert-warning mb-4 p-4 bg-yellow-100 text-yellow-800">{passwordError}</div>}
                    {passwordSuccess && <div className="alert alert-success mb-4 p-4 bg-green-100 text-green-800">{passwordSuccess}</div>}
                    <form onSubmit={handleChangePassword} className='bg-white rounded-lg shadow-md px-2 py-4'>
                        <div className="mb-4">
                            <input
                                type="password"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Current Password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="password"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <input
                                type="password"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!submitProcessPassword}
                            className={`w-full py-3 bg-blue-500 text-white rounded-md ${!submitProcessPassword ? 'bg-gray-500' : 'hover:bg-blue-600'}`}
                        >
                            {submitProcessPassword ? 'Change Password' : <i className="fa-solid fa-spinner fa-spin"></i>}
                        </button>
                    </form>

                    {/* Change Email Section */}
                    <form onSubmit={handleChangeEmail} className='bg-white rounded-lg shadow-md my-5 px-2 py-4'>
                        <div className="mb-4">
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={currentEmail}
                                readOnly
                                disabled
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="email"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="New Email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <input
                                type="email"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Re-enter New Email"
                                value={gmail_address}
                                onChange={(e) => setGmail_address(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!submitProcessEmail}
                            className={`w-full py-3 bg-blue-500 text-white rounded-md ${!submitProcessEmail ? 'bg-gray-500' : 'hover:bg-blue-600'}`}
                        >
                            {submitProcessEmail ? 'Change Email' : <i className="fa-solid fa-spinner fa-spin"></i>}
                        </button>
                    </form>
                </div>
            </div>
            <div className='mt-3'>
                <Footer />
            </div>
        </div>
    );
}

export default Setting;
