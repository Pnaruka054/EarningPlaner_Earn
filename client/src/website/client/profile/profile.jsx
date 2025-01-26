import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        place_state: '',
        zip_code: '',
        country: '',
        mobile_number: '',
        withdrawal_method: '',
        withdrawal_account_information: '',
    });

    // let withdrawal_countryes_state = [
    //     {
    //         country_code: 'IND',
    //         country_name: 'India'
    //     }
    // ]

    const withdrawalMethods_state = [
        { withdrawal_method: 'MoMo', minimum_amount: '$2.0000' },
        { withdrawal_method: 'Payeer', minimum_amount: '$2.0000' },
        { withdrawal_method: 'OVO', minimum_amount: '$5.0000' },
        { withdrawal_method: 'DANA', minimum_amount: '$5.0000' },
        { withdrawal_method: 'bKash', minimum_amount: '$5.0000' },
        { withdrawal_method: 'Nagad', minimum_amount: '$5.0000' },
        { withdrawal_method: 'Airtm', minimum_amount: '$5.0000' },
        { withdrawal_method: 'UPI', minimum_amount: '$5.0000' },
        { withdrawal_method: 'Paytm', minimum_amount: '$10.0000' },
        { withdrawal_method: 'PayPal', minimum_amount: '$10.0000' },
        { withdrawal_method: 'Bitcoin', minimum_amount: '$10.0000' },
        { withdrawal_method: 'USDT', minimum_amount: '$5.0000' },
        { withdrawal_method: 'ShopeePay (Indonesia)', minimum_amount: '$5.0000' },
        { withdrawal_method: 'Bank Transfer for (Vietnam)', minimum_amount: '$5.0000' },
        { withdrawal_method: 'Bank Transfer for (India)', minimum_amount: '$10.0000' },
        { withdrawal_method: 'Bank Transfer for (Indonesia)', minimum_amount: '$5.0000' },
        { withdrawal_method: 'WebMoney', minimum_amount: '$2.0000' },
        { withdrawal_method: 'Perfect Money', minimum_amount: '$2.0000' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

    };

    return (
        <div className="ml-auto flex flex-col justify-between  bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[94vh] mt-12">
            <form method="post" onSubmit={handleSubmit} className='pt-4 px-4 pb-5'>
                <legend className="text-2xl text-blue-600 font-semibold my-4 mx-1 select-none flex justify-between">Profile & Billing Section</legend>
                {success && <div className="bg-green-500 text-white p-4 mb-4 rounded-md">{success}</div>}
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        id="name"
                        value={formData.name}
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
                        value={formData.address}
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
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="place_state" className="block text-gray-700">State</label>
                        <input
                            type="text"
                            name="place_state"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            id="place_state"
                            value={formData.place_state}
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
                            value={formData.zip_code}
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
                            value={formData.country}
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
                            value={formData.mobile_number}
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
                                value={formData.withdrawal_method}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Choose</option>
                                {withdrawalMethods_state.map((method, index) => (
                                    <option key={index} value={method.withdrawal_method}>{method.withdrawal_method}</option>
                                ))}
                            </select>
                        </div>
                        <div className='mt-3 leading-[2.5] sm:mb-0 mb-4' style={{ fontSize: "14px" }}>
                            <p>- For Payeer add your Account number. (Example: P123***)</p>
                            <p>- For MM, add phone number.</p>
                            <p>- For OVO, add OVO number.</p>
                            <p>- For DANA, add DANA number.</p>
                            <p>- For bKash, add your bKash number</p>
                            <p>- For Airtm, add your email or Airtm username.</p>
                            <p>- For UPI, add your UPI id</p>
                            <p>- For Paytm, add your phone number</p>
                            <p>- For PayPal, add your email.</p>
                            <p>- For Bitcoin, add your wallet address or Binance account email address.</p>
                            <p>- For USDT, add your USDT wallet address + network name or Binance account email address.</p>
                            <p>- For ShopeePay, add phone number.</p>
                            <p>- For bank transfer add your account holder name, Bank Name and Account number</p>
                            <p>- For bank transfer (India) add your First name, Last name, Account number and IFSC code</p>
                            <p>- For bank transfer (Indonesia) add your Bank Account Number and Bank Name</p>
                            <p>- For Web Money, add your purse. (Example: Z123***)</p>
                        </div>
                    </div>
                    <div className="mb-4 -mt-5 bg-white">
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr>
                                    <th className="p-2 text-left text-gray-700">Withdraw Method</th>
                                    <th className="p-2 text-left text-gray-700">Minimum Withdrawal Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {withdrawalMethods_state.map((method, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="p-2">{method.withdrawal_method}</td>
                                        <td className="p-2">{method.minimum_amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="withdrawal_account_information" className="block text-gray-700">Withdrawal Account</label>
                    <textarea
                        name="withdrawal_account_information"
                        className="w-full p-3 border border-gray-300 rounded-md"
                        id="withdrawal_account_information"
                        rows="5"
                        value={formData.withdrawal_account_information}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <button
                    // disabled={!submit_process_state}
                    // className={`w-full py-3 mt-4 text-white rounded-md ${!submit_process_state ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
                    className={`w-full py-3 mt-4 text-white rounded-md bg-blue-600 hover:bg-blue-700"}`}
                    type="submit"
                >
                    {/* {submit_process_state ? "Submit" : <i className="fa-solid fa-spinner fa-spin"></i>} */}
                    "Submit"
                </button>
            </form >
        </div >
    );
};

export default Profile;
