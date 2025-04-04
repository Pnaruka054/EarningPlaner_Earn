import React, { useEffect, useState } from 'react';
import Footer from '../components/footer/footer';
import ProcessBgSeprate from '../components/processBgSeprate/processBgSeprate';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Step_completed from '../../assets/step_completed.svg'
import Step_editing from '../../assets/step_editing.svg'
import { encryptData } from '../components/encrypt_decrypt_data';
import ProcessBgBlack from '../components/processBgBlack/processBgBlack';
import axios from 'axios';
import Swal from 'sweetalert2';
import showNotification from '../components/showNotification';
import { FaArrowLeft } from 'react-icons/fa';

const AdvertiserCreate = ({ setAvailableBalance_forNavBar_state }) => {
    let [data_process_state, setData_process_state] = useState(true);
    const [submit_process_state, setSubmit_process_state] = useState(false);
    const [errors_state, setErrors_state] = useState({});
    // All fetched data
    const [all_data_state, setAll_data_state] = useState({});

    const navigation = useNavigate();

    const [selectedOption_state, setSelectedOption_state] = useState("");
    const [step_state, setStep_state] = useState(1);
    const [formData_state, setFormData_state] = useState({
        step_2_title: "",
        step_2_url: "",
        step_2_description: "",
        step_3_duration: "",
        step_3_total_views: "",
        step_3_interval_in_hours: "",
        step_3_enableLimit: "",
        step_3_limitViewsPerDay: "",
        step_4_subTotal: "",
    });

    const handleChange = (e) => {
        setFormData_state({ ...formData_state, [e.target.name]: e.target.value });
        setErrors_state({ ...errors_state, [e.target.name]: "" })
    };

    const handleSliderChange = (e) => {
        setFormData_state({ ...formData_state, [e.target.name]: parseInt(e.target.value) });
        setErrors_state({ ...errors_state, [e.target.name]: "" })
    };

    const handleToggle = (e) => {
        setFormData_state({ ...formData_state, [e.target.name]: !formData_state.step_3_enableLimit });
    };

    const handleNext = () => {
        if (selectedOption_state && step_state < 4) {
            if (step_state === 2) {
                let newErrors = {};
                if (!formData_state.step_2_title.trim()) {
                    newErrors.step_2_title = "Title is a required field";
                }
                if (!formData_state.step_2_url.trim()) {
                    newErrors.step_2_url = "Url is a required field";
                } else {
                    const url = formData_state.step_2_url.trim();
                    if (selectedOption_state === "youtube") {
                        const youtubePattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}$/;
                        if (!youtubePattern.test(url)) {
                            newErrors.step_2_url = "Please enter a valid YouTube video URL";
                        }
                    } else {
                        const generalUrlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/\S*)?$/;
                        if (!generalUrlPattern.test(url)) {
                            newErrors.step_2_url = "Please enter a valid URL";
                        }
                    }
                }

                if (!formData_state.step_2_description.trim()) {
                    newErrors.step_2_description = "Description is a required field";
                }

                if (Object.keys(newErrors).length > 0) {
                    return setErrors_state(newErrors);
                }
            } else if (step_state === 3) {
                let newErrors = {};
                if (!formData_state.step_3_duration.trim() || formData_state.step_3_duration.trim() === "Choose Any One") {
                    newErrors.step_3_duration = "Duration is a required field";
                }
                if (!formData_state.step_3_total_views.trim()) {
                    newErrors.step_3_total_views = "Total Views is a required field";
                }
                if (!formData_state.step_3_interval_in_hours) {
                    newErrors.step_3_interval_in_hours = "Interval is a required field";
                }
                if (formData_state.step_3_enableLimit && !formData_state.step_3_limitViewsPerDay.trim()) {
                    newErrors.step_3_limitViewsPerDay = "Per Day Limit is a required field";
                }
                if (Number(formData_state.step_3_total_views) < Number(formData_state.step_3_limitViewsPerDay)) {
                    newErrors.step_3_limitViewsPerDay = "Per Day Limit must not be greater than total views";
                }
                if (Object.keys(newErrors).length > 0) {
                    return setErrors_state(newErrors);
                }
                let subtotal = (parseFloat(formData_state.step_3_duration.split("-")[1]) * parseFloat(formData_state.step_3_total_views)).toFixed(3)
                setFormData_state({ ...formData_state, step_4_subTotal: subtotal })
            }
            setErrors_state({})
            setStep_state(step_state + 1);
        }
    };

    const handleprev = () => {
        if (selectedOption_state && step_state > 1) {
            setStep_state(step_state - 1)
        }
    };

    // get all data from server
    const fetchData = async () => {
        setData_process_state(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/advertiserRoute/advertiserCreateDataGet`, {
                withCredentials: true
            });
            setAll_data_state(response?.data?.msg);
            setAvailableBalance_forNavBar_state(response?.data?.msg?.userAvailableBalance);
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
        const handle_userOnline = () => {
            fetchData();
        };

        window.addEventListener('online', handle_userOnline);

        return () => {
            window.removeEventListener('online', handle_userOnline);
        };
    }, []);

    let dataBase_post_newCampaign = async (obj) => {
        setSubmit_process_state(true);
        try {
            let encryptedObj = await encryptData(obj)
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/advertiserRoute/advertiserDataPost`, { obj: encryptedObj }, {
                withCredentials: true
            });
            if (response.status === 200) {
                showNotification(false, "Your campaign has been successfully submitted.");
                setAll_data_state(response?.data?.msg);
                setAvailableBalance_forNavBar_state(response?.data?.msg?.userAvailableBalance);
            }
        } catch (error) {
            console.error(error);
            if (error.response.data.jwtMiddleware_token_not_found_error) {
                Swal.fire({
                    title: 'Authentication Error',
                    text: 'Please log in again to continue.',
                    icon: 'error',
                    timer: 5000,
                    timerProgressBar: true,
                    confirmButtonText: 'OK',
                    didClose: () => {
                        navigation('/login');
                    }
                });
            } else if (error.response.data.jwtMiddleware_error) {
                Swal.fire({
                    title: 'Session Expired',
                    text: 'Your session has expired. Please log in again.',
                    icon: 'error',
                    timer: 5000,
                    timerProgressBar: true,
                    confirmButtonText: 'OK',
                    didClose: () => {
                        navigation('/login');
                    }
                });
            } else {
                showNotification(true, "Something went wrong, please try again.");
            }
        } finally {
            setSubmit_process_state(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>EarnWiz - Create Campaigns</title>
                <meta name="description" content="" />
            </Helmet>
            {data_process_state ? (
                <div className="ml-auto flex flex-col justify-between bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[93.3dvh] mt-[6.7dvh]">
                    <ProcessBgSeprate />
                </div>
            ) : (
                <div className="ml-auto flex flex-col justify-between bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[93.3dvh] mt-[6.7dvh] custom-scrollbar">
                    <div className='px-4 py-2'>
                        <div className='text-2xl text-blue-600 font-semibold my-4 select-none flex justify-between'>
                            Create Campaigns
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                            <button
                                onClick={() => navigation(-1)}
                                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
                            >
                                <FaArrowLeft className="mr-2" /> Back
                            </button>
                            <div className='my-3 text-center sm:text-right'>
                                <span className="font-medium text-gray-700">Deposit Balance:</span>
                                <span className="ml-2 text-2xl font-bold text-green-600">
                                    ₹{all_data_state?.userDepositBalance || 0}
                                </span>
                            </div>
                        </div>
                        <div className="mx-auto p-6 bg-white rounded-lg shadow-md">
                            {/* Progress Bar */}
                            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 md:mb-6 mb-4 space-y-4 md:space-y-0">

                                {/* Step 1 */}
                                <div className="flex items-center space-x-2">
                                    {step_state === 1 ? (
                                        <>
                                            <img src={Step_editing} draggable="false" className="w-8 h-8 rounded-full" alt="Step 1 editing" />
                                            <span className="text-blue-500 font-semibold">Type</span>
                                        </>
                                    ) : step_state > 1 ? (
                                        <>
                                            <img src={Step_completed} draggable="false" className="w-8 h-8 rounded-full" alt="Step 1 completed" />
                                            <span className="text-blue-500 font-semibold">Type</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-8 h-8 flex items-center justify-center bg-gray-300 text-gray rounded-full">1</div>
                                            <span className="text-gray-500 font-semibold">Type</span>
                                        </>
                                    )}
                                </div>

                                <span className="hidden md:inline">➝</span>

                                {/* Step 2 */}
                                <div className="flex items-center space-x-2">
                                    {step_state === 2 ? (
                                        <>
                                            <img src={Step_editing} draggable="false" className="w-8 h-8 rounded-full" alt="Step 2 editing" />
                                            <span className="text-blue-500 font-semibold">Info</span>
                                        </>
                                    ) : step_state > 2 ? (
                                        <>
                                            <img src={Step_completed} draggable="false" className="w-8 h-8 rounded-full" alt="Step 2 completed" />
                                            <span className="text-blue-500 font-semibold">Info</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-8 h-8 flex items-center justify-center bg-gray-300 text-gray-700 rounded-full">2</div>
                                            <span className="text-gray-500">Info</span>
                                        </>
                                    )}
                                </div>

                                <span className="hidden md:inline">➝</span>

                                {/* Step 3 */}
                                <div className="flex items-center space-x-2">
                                    {step_state === 3 ? (
                                        <>
                                            <img src={Step_editing} draggable="false" className="w-8 h-8 rounded-full" alt="Step 3 editing" />
                                            <span className="text-blue-500 font-semibold">Reward</span>
                                        </>
                                    ) : step_state > 3 ? (
                                        <>
                                            <img src={Step_completed} draggable="false" className="w-8 h-8 rounded-full" alt="Step 3 completed" />
                                            <span className="text-blue-500 font-semibold">Reward</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-8 h-8 flex items-center justify-center bg-gray-300 text-gray-700 rounded-full">3</div>
                                            <span className="text-gray-500">Reward</span>
                                        </>
                                    )}
                                </div>

                                <span className="hidden md:inline">➝</span>

                                {/* Step 4 */}
                                <div className="flex items-center space-x-2">
                                    {step_state === 4 ? (
                                        <>
                                            <img src={Step_editing} draggable="false" className="w-8 h-8 rounded-full" alt="Step 4 editing" />
                                            <span className="text-blue-500 font-semibold">Preview</span>
                                        </>
                                    ) : step_state > 4 ? (
                                        <>
                                            <img src={Step_completed} draggable="false" className="w-8 h-8 rounded-full" alt="Step 4 completed" />
                                            <span className="text-blue-500 font-semibold">Preview</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-8 h-8 flex items-center justify-center bg-gray-300 text-gray-700 rounded-full">4</div>
                                            <span className="text-gray-500">Preview</span>
                                        </>
                                    )}
                                </div>

                            </div>

                            {step_state === 1 && <div>
                                {/* Campaign Type Selection */}
                                <div>
                                    <h3 className="text-lg font-bold mb-2">Campaign Type</h3>
                                    <div className="space-y-3">
                                        {/* Window */}
                                        <label className="flex items-start space-x-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="campaign"
                                                value="window"
                                                className="mt-1"
                                                checked={selectedOption_state === "window"}
                                                onChange={() => setSelectedOption_state("window")}
                                            />
                                            <div>
                                                <span className="font-semibold">Window</span>
                                                <p className="text-gray-600 text-sm">Your URL will be opened in a new tab.</p>
                                            </div>
                                        </label>

                                        {/* iFrame */}
                                        <label className="flex items-start space-x-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="campaign"
                                                value="iframe"
                                                className="mt-1"
                                                checked={selectedOption_state === "iframe"}
                                                onChange={() => setSelectedOption_state("iframe")}
                                            />
                                            <div>
                                                <span className="font-semibold">iFrame</span>
                                                <p className="text-gray-600 text-sm">
                                                    Your URL will be opened inside an iframe. Make sure your URL allows iframe loading.
                                                </p>
                                            </div>
                                        </label>

                                        {/* YouTube */}
                                        <label className="flex items-start space-x-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="campaign"
                                                value="youtube"
                                                className="mt-1"
                                                checked={selectedOption_state === "youtube"}
                                                onChange={() => setSelectedOption_state("youtube")}
                                            />
                                            <div>
                                                <span className="font-semibold">YouTube</span>
                                                <p className="text-gray-600 text-sm">Boost your YouTube video views.</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>}

                            {step_state === 2 && (
                                <div>
                                    {/* Title and URL Fields */}
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-1">Title</label>
                                            <input
                                                type="text"
                                                placeholder="Title"
                                                name="step_2_title"
                                                value={formData_state.step_2_title}
                                                onChange={handleChange}
                                                className={`w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 ${errors_state.step_2_title ? "border-red-500" : "border-gray-300"}`}
                                            />
                                            {errors_state.step_2_title && <p className="text-red-500 text-sm">{errors_state.step_2_title}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-1">Url</label>
                                            <input
                                                type="text"
                                                placeholder="Url"
                                                name="step_2_url"
                                                value={formData_state.step_2_url}
                                                onChange={handleChange}
                                                className={`w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 ${errors_state.step_2_url ? "border-red-500" : "border-gray-300"}`}
                                            />
                                            {errors_state.step_2_url && <p className="text-red-500 text-sm">{errors_state.step_2_url}</p>}
                                        </div>
                                    </div>

                                    {/* Description Field */}
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-medium mb-1">Description</label>
                                        <textarea
                                            placeholder="Description"
                                            name="step_2_description"
                                            value={formData_state.step_2_description}
                                            onChange={handleChange}
                                            className={`w-full border rounded-lg px-3 py-2 h-24 focus:ring focus:ring-blue-300 ${errors_state.step_2_description ? "border-red-500" : "border-gray-300"}`}
                                        ></textarea>
                                        {errors_state.step_2_description && <p className="text-red-500 text-sm">{errors_state.step_2_description}</p>}
                                    </div>
                                </div>
                            )}

                            {step_state === 3 && (
                                <div>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-1">Duration</label>
                                            <select
                                                name="step_3_duration"
                                                value={formData_state.step_3_duration}
                                                onChange={handleChange}
                                                className={`w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 ${errors_state.step_3_duration ? "border-red-500" : "border-gray-300"
                                                    }`}
                                            >
                                                <option value="Choose Any One">Choose Any One</option>
                                                <option value="5-0.01">5 seconds - ₹0.01 per view</option>
                                                <option value="10-0.02">10 seconds - ₹0.02 per view</option>
                                                <option value="15-0.03">15 seconds - ₹0.03 per view</option>
                                            </select>
                                            {errors_state.step_3_duration && (
                                                <p className="text-red-500 text-sm">{errors_state.step_3_duration}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-1">Total Views</label>
                                            <input
                                                type="number"
                                                name="step_3_total_views"
                                                value={formData_state.step_3_total_views}
                                                placeholder="Enter total views"
                                                onChange={handleChange}
                                                className={`w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 ${errors_state.step_3_total_views ? "border-red-500" : "border-gray-300"
                                                    }`}
                                            />
                                            {errors_state.step_3_total_views && (
                                                <p className="text-red-500 text-sm">{errors_state.step_3_total_views}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Interval Slider */}
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-medium mb-1">Interval</label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="24"
                                            step="1"
                                            name="step_3_interval_in_hours"
                                            value={formData_state.step_3_interval_in_hours}
                                            onChange={handleSliderChange}
                                            className="w-full"
                                        />
                                        <p className="text-gray-600 mt-1">
                                            User can watch this ad once every <strong>{formData_state.step_3_interval_in_hours || 13} hours</strong>
                                        </p>
                                        {errors_state.step_3_interval_in_hours && (
                                            <p className="text-red-500 text-sm">{errors_state.step_3_interval_in_hours}</p>
                                        )}
                                    </div>

                                    {/* Enable Limit Toggle with custom switch */}
                                    <div className="mb-4">
                                        <label className="inline-flex items-center cursor-pointer gap-2">
                                            <input
                                                type="checkbox"
                                                checked={formData_state.step_3_enableLimit}
                                                name="step_3_enableLimit"
                                                onChange={handleToggle}
                                                className="sr-only peer"
                                            />
                                            <div className="relative w-10 h-5 bg-gray-300 rounded-full transition-all duration-300 peer-checked:bg-green-500">
                                                <div
                                                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-md ${formData_state.step_3_enableLimit ? "translate-x-5" : ""
                                                        }`}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">
                                                Enable Limit: {formData_state.step_3_enableLimit ? "On" : "Off"}
                                            </span>
                                        </label>
                                    </div>

                                    {/* Limit Views Per Day - Shown Only if Toggle is ON */}
                                    {formData_state.step_3_enableLimit && (
                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-medium mb-1">Limit Views Per Day</label>
                                            <input
                                                type="number"
                                                name="step_3_limitViewsPerDay"
                                                placeholder="Enter views per day"
                                                value={formData_state.step_3_limitViewsPerDay}
                                                onChange={handleChange}
                                                className={`w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 ${errors_state.step_3_limitViewsPerDay ? "border-red-500" : "border-gray-300"
                                                    }`}
                                            />
                                            {errors_state.step_3_limitViewsPerDay && (
                                                <p className="text-red-500 text-sm">{errors_state.step_3_limitViewsPerDay}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {step_state === 4 && (
                                <div className="bg-white p-6 rounded-md space-y-4">
                                    <h2 className="text-lg font-semibold mb-2">Preview Campaign</h2>

                                    {/* Summary Table */}
                                    <div className="space-y-2">
                                        {/* Title */}
                                        <div className="grid grid-cols-2">
                                            <span className="font-medium w-32">Title:</span>
                                            <span>{formData_state.step_2_title}</span>
                                        </div>

                                        {/* Description */}
                                        <div className="grid grid-cols-2">
                                            <span className="font-medium w-32">Description:</span>
                                            <span>{formData_state.step_2_description}</span>
                                        </div>

                                        {/* URL */}
                                        <div className="grid grid-cols-2">
                                            <span className="font-medium w-32">URL:</span>
                                            <a
                                                href={formData_state.step_2_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title={formData_state.step_2_url}
                                                className="text-green-600 truncate"
                                            >
                                                {formData_state.step_2_url}
                                            </a>
                                        </div>


                                        {/* Type */}
                                        <div className="grid grid-cols-2 items-center">
                                            <span className="font-medium w-32">Type:</span>
                                            <div className="inline-flex items-center">
                                                <span className="px-2 py-1 bg-green-600 text-white rounded-sm text-md">
                                                    {selectedOption_state}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Price (Derived from Duration) */}
                                        <div className="grid grid-cols-2">
                                            <span className="font-medium w-32">Price:</span>
                                            <span>
                                                {formData_state.step_3_duration
                                                    ? "₹" + formData_state.step_3_duration.split("-")[1]
                                                    : "N/A"}
                                            </span>
                                        </div>

                                        {/* Total Views */}
                                        <div className="grid grid-cols-2">
                                            <span className="font-medium w-32">Total Views:</span>
                                            <span>
                                                {formData_state.step_3_total_views
                                                    ? formData_state.step_3_total_views
                                                    : "N/A"}
                                            </span>
                                        </div>

                                        {/* Timer (Derived from Duration) */}
                                        <div className="grid grid-cols-2">
                                            <span className="font-medium w-32">Timer:</span>
                                            <span>
                                                {formData_state.step_3_duration
                                                    ? formData_state.step_3_duration.split(" - ")[0]
                                                    : "N/A"}
                                            </span>
                                        </div>

                                        {/* Interval */}
                                        <div className="grid grid-cols-2">
                                            <span className="font-medium w-32">Interval:</span>
                                            <span>{formData_state.step_3_interval_in_hours} hours</span>
                                        </div>

                                        {/* Daily Limit */}
                                        <div className="grid grid-cols-2">
                                            <span className="font-medium w-32">Daily limit:</span>
                                            <span>
                                                {formData_state.step_3_enableLimit
                                                    ? `${formData_state.step_3_limitViewsPerDay} views`
                                                    : "No limit"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Subtotal */}
                                    <div>
                                        <p className="text-gray-700 font-medium">
                                            Subtotal:{" "}
                                            <span className="text-lg font-bold">
                                                ₹{formData_state.step_4_subTotal}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className='flex justify-between'>
                                {/* Prev Button */}
                                <div className="mt-6 flex justify-end">
                                    <button
                                        className={`px-6 py-2 rounded-lg text-white font-semibold 
                                      ${step_state === 1 ? "hidden" : ""} 
                                      ${selectedOption_state ? "bg-yellow-500 hover:bg-yellow-600" : "bg-gray-300 cursor-not-allowed"}
                                    `}
                                        disabled={!selectedOption_state}
                                        onClick={handleprev}
                                    >
                                        Prev
                                    </button>
                                </div>


                                {/* Next Button */}
                                {step_state < 4 && <div className="mt-6 flex justify-end">
                                    <button
                                        className={`px-6 py-2 rounded-lg text-white font-semibold ${selectedOption_state ? "bg-teal-500 hover:bg-teal-600" : "bg-gray-300 cursor-not-allowed"}`}
                                        disabled={!selectedOption_state}
                                        onClick={handleNext}
                                    >
                                        Next
                                    </button>
                                </div>}

                                {/* Create Button */}
                                {step_state === 4 && <div className="mt-6 flex justify-end">
                                    <button
                                        className={`px-6 py-2 rounded-lg text-white font-semibold ${selectedOption_state ? "bg-teal-500 hover:bg-teal-600" : "bg-gray-300 cursor-not-allowed"}`}
                                        disabled={!selectedOption_state}
                                        onClick={() => dataBase_post_newCampaign({ ...formData_state, selectedOption_state })}
                                    >
                                        Create
                                    </button>
                                </div>}
                            </div>
                        </div>
                    </div>
                    {submit_process_state && <ProcessBgBlack />}
                    <div className='mt-3'>
                        <Footer />
                    </div>
                </div>
            )}
        </>
    );
}


export default AdvertiserCreate;