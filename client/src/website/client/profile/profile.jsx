import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import ProcessBgBlack from '../components/processBgBlack/processBgBlack';
import showNotificationWith_timer from '../components/showNotificationWith_timer';
import showNotification from '../components/showNotification';

const Profile = ({setAvailableBalance_forNavBar_state}) => {
    const [formData_state, setFormData_state] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        mobile_number: '',
        withdrawal_method: '',
        withdrawal_account_information: '',
        withdrawal_methods_data: []
    });
    const navigation = useNavigate();
    let [data_process_state, setData_process_state] = useState(false);
    let [submit_process_state, setSubmit_process_state] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            setData_process_state(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/userRoute/userProfileData_get`, {
                    withCredentials: true
                });
                setAvailableBalance_forNavBar_state(response?.data?.msg?.available_balance);
                setFormData_state((prev) => ({ ...prev, ...response.data.msg }));
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
        fetchData();
    }, []);
    let dataBase_patch_userData = async (obj) => {
        try {
            await axios.patch(`${import.meta.env.VITE_SERVER_URL}/userRoute/userProfileData_patch`, obj, {
                withCredentials: true
            });
            showNotification(false, "Profile Updated Successfully!");
        } catch (error) {
            console.error(error)
            if (error?.response?.data?.error_msg) {
                showNotificationWith_timer(true, error?.response?.data?.error_msg);
            } else {
                showNotification(true, "Something went wrong, please try again.");
            }
        } finally {
            setSubmit_process_state(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData_state((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmit_process_state(true);
        let obj = {
            name: formData_state.name,
            address: formData_state.address,
            city: formData_state.city,
            state: formData_state.state,
            zip_code: formData_state.zip_code,
            mobile_number: formData_state.mobile_number,
            withdrawal_method: formData_state.withdrawal_method,
            withdrawal_account_information: formData_state.withdrawal_account_information,
        }
        dataBase_patch_userData(obj);
    };

    return (
        <div className="ml-auto flex flex-col justify-between  bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[94vh] mt-12">
            <form method="post" onSubmit={handleSubmit} className='pt-4 px-4 pb-5'>
                <legend className="text-2xl text-blue-600 font-semibold my-4 mx-1 select-none flex justify-between">Profile & Billing Section</legend>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        id="name"
                        value={formData_state.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="address" className="block text-gray-700">Address</label>
                    <input
                        type="text"
                        name="address"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        id="address"
                        value={formData_state.address}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label htmlFor="city" className="block text-gray-700">City</label>
                        <input
                            type="text"
                            name="city"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            id="city"
                            value={formData_state.city}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="state" className="block text-gray-700">State</label>
                        <input
                            type="text"
                            name="state"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            id="state"
                            value={formData_state.state}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label htmlFor="zip_code" className="block text-gray-700">ZIP</label>
                        <input
                            type="text"
                            name="zip_code"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            id="zip_code"
                            value={formData_state.zip_code}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/* <div className="mb-4">
                        <label htmlFor="country" className="block text-gray-700">Country</label>
                        <select
                            name="country"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            id="country"
                            value={formData_state.country}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Choose</option>
                            {withdrawal_countryes_state.map((country, index) => (
                                <option key={index} value={country.country_code}>
                                    {country.country_name}
                                </option>
                            ))}
                        </select>
                    </div> */}
                    <div className="mb-4">
                        <label htmlFor="mobile_number" className="block text-gray-700">Phone Number</label>
                        <input
                            type="text"
                            name="mobile_number"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            id="mobile_number"
                            value={formData_state.mobile_number}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <legend className="text-xl font-semibold mt-6">Withdrawal Info</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <div className="mb-4">
                            <label htmlFor="withdrawal_method" className="block mt-4 text-gray-700">Withdrawal Method</label>
                            <select
                                name="withdrawal_method"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                id="withdrawal_method"
                                value={formData_state.withdrawal_method}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Choose</option>
                                {formData_state.withdrawal_methods_data?.map((method, index) => (
                                    <option key={index} value={method.withdrawal_method}>{method.withdrawal_method}</option>
                                ))}
                            </select>
                        </div>
                        <ul className='mt-3 space-y-5 sm:mb-0 mb-4' style={{ fontSize: "14px" }}>
                            {formData_state.withdrawal_methods_data?.map((method, index) => (
                                <li className='purple-right-list-image' key={index}> {method.description}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-4 bg-white flex">
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr>
                                    <th className="p-2 text-left text-gray-700">Withdraw Method</th>
                                    <th className="p-2 text-left text-gray-700">Minimum Withdrawal Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData_state.withdrawal_methods_data?.map((method, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="p-2">{method.withdrawal_method}</td>
                                        <td className="p-2">{method.minimum_amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="my-4">
                    <label htmlFor="withdrawal_account_information" className="block text-gray-700">Withdrawal Account</label>
                    <textarea
                        name="withdrawal_account_information"
                        className="w-full p-3 border border-gray-300 rounded-md"
                        id="withdrawal_account_information"
                        rows="5"
                        value={formData_state.withdrawal_account_information}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <button type="submit" disabled={submit_process_state} className={`${submit_process_state ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"} w-full py-3 mt-4 text-white rounded mb-2 transition`}>
                    {!submit_process_state ? "Submit" : <i className="fa-solid fa-spinner fa-spin"></i>}
                </button>
            </form >
            {(data_process_state || submit_process_state) && <ProcessBgBlack />}
        </div >
    );
};

export default Profile;
