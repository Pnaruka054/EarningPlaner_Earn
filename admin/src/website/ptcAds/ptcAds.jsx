import React, { useState } from 'react';
import SideMenu from '../components/sideMenu/sideMenu';
import axios from 'axios'
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import { useRef } from 'react';
import ProcessBgBlack from "../components/processBgBlack/processBgBlack";
import showNotification from "../components/showNotification";
import { FaRegFrown } from 'react-icons/fa';

const PTCAds = () => {
    let [data_process_state, setData_process_state] = useState(false);
    const [PTCAds_total_minimum_Views_state, setPTCAds_total_minimum_Views_state] = useState("");
    const [PTCadvertiserCampaigns_data_state, setPTCadvertiserCampaigns_data_state] = useState([]);
    const [formData_state, setFormData_state] = useState({
        window: [{ time: "", price: "" }],
        iframe: [{ time: "", price: "" }],
        youtube: [{ time: "", price: "" }],
    });

    const handleDynamicChange = (e, section, index) => {
        const { name, value } = e.target;

        // Allow empty value
        if (value === "") {
            setFormData_state((prev) => {
                const updatedSection = [...prev[section]];
                updatedSection[index][name] = value;
                return { ...prev, [section]: updatedSection };
            });
            return;
        }

        // Allow integer or decimal numbers
        const pattern = /^(\d+(\.\d*)?|\.\d+)$/;
        if (!pattern.test(value)) {
            return;
        }

        setFormData_state((prev) => {
            const updatedSection = [...prev[section]];
            updatedSection[index][name] = value;
            return { ...prev, [section]: updatedSection };
        });
    };

    const addNewField = (section) => {
        setFormData_state(prev => ({
            ...prev,
            [section]: [...prev[section], { time: "", price: "" }]
        }));
    };

    const removeField = (section, index) => {
        setFormData_state((prev) => {
            const updatedFields = [...prev[section]];
            updatedFields.splice(index, 1);
            return { ...prev, [section]: updatedFields };
        });
    };


    const handle_priceSubmit_update = () => {
        PTCAds_database_patch(formData_state, 'price');
    }

    const navigation = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setData_process_state(true);

                const response = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/admin/getPTCAdsData`,
                    { withCredentials: true }
                );

                if (response?.data?.msg) {
                    const { other_data_PTCAds: { PTCAds_instructions, PTCAds_total_minimum_Views, window, iframe, youtube }, PTCadvertiserCampaigns_data } = response.data.msg;
                    setPTCAdsInstructions_state(PTCAds_instructions.join("\n"))
                    setPTCAds_total_minimum_Views_state(PTCAds_total_minimum_Views)
                    setPTCadvertiserCampaigns_data_state(PTCadvertiserCampaigns_data)
                    setFormData_state((prev) => ({ ...prev, window, iframe, youtube }))
                }
            } catch (error) {
                console.error("Error fetching PTC ads data:", error);
                if (error.response.data.error_msg) {
                    showNotification(true, error.response.data.error_msg);
                } else if (error.response.data.adminJWT_error_msg) {
                    showNotification(true, error.response.data.adminJWT_error_msg);
                    navigation('/')
                } else {
                    showNotification(true, "Something went wrong, please try again.");
                }
            } finally {
                setData_process_state(false);
            }
        };
        fetchData()
    }, []);

    // handle PTC ads update data
    const [PTCAdsInstructions_state, setPTCAdsInstructions_state] = useState('');

    const PTCAds_database_patch = async (data, btnName) => {
        try {
            setData_process_state(true);

            const response = await axios.patch(
                `${import.meta.env.VITE_SERVER_URL}/admin/patch_PTCAds_data`,
                { data, btnName },
                { withCredentials: true }
            );
            if (response?.data?.msg) {
                const { PTCAds_instructions, PTCAds_total_minimum_Views } = response.data.msg;
                if (PTCAds_total_minimum_Views) {
                    setPTCAds_total_minimum_Views_state(PTCAds_total_minimum_Views)
                } else {
                    setPTCAdsInstructions_state(PTCAds_instructions.join("\n"))
                }
                showNotification(false, "updated successfull!");
            }
        } catch (error) {
            console.error("Error patch PTC ads data data:", error);
            if (error.response.data.error_msg) {
                showNotification(true, error.response.data.error_msg);
            } else if (error.response.data.adminJWT_error_msg) {
                showNotification(true, error.response.data.adminJWT_error_msg);
                navigation('/')
            } else {
                showNotification(true, "Something went wrong, please try again.");
            }
        } finally {
            setData_process_state(false);
        }
    }

    const handle_PTCAdsInstructions_update = () => {
        if (PTCAdsInstructions_state.trim() !== '') {
            Swal.fire({
                title: "Are you sure?",
                text: "Update This Instructions?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, update it!",
                cancelButtonText: "Cancel"
            }).then((result) => {
                if (result.isConfirmed) {
                    PTCAds_database_patch(PTCAdsInstructions_state.split("\n"), 'text')
                }
            });
        }
    };

    const handle_PTCAdsLimit_update = () => {
        const limit = parseFloat(PTCAds_total_minimum_Views_state);
        if (!isNaN(limit)) {
            Swal.fire({
                title: "Are you sure?",
                text: "Update PTC ads Limit?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, update it!",
                cancelButtonText: "Cancel"
            }).then((result) => {
                if (result.isConfirmed) {
                    PTCAds_database_patch(PTCAds_total_minimum_Views_state, 'limit')
                }
            });
        }
    };

    // to adjust height dynamically
    const textareaRef = useRef(null);
    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto"; // Reset height
            textarea.style.height = textarea.scrollHeight + "px"; // Set new height
        }
    };
    useEffect(() => {
        adjustTextareaHeight(); // Adjust height on mount
    }, [PTCAdsInstructions_state]);

    const [statusFilter_state, setStatusFilter_state] = useState("All");
    const [filterKeyword_state, setFilterKeyword_state] = useState("");
    const [filterType_state, setFilterType_state] = useState("All");

    const filteredCampaigns = PTCadvertiserCampaigns_data_state?.filter((campaign) => {
        const campaignStatus = campaign.status?.toLowerCase() || "";
        const title = campaign.step_2_title?.toLowerCase() || "";
        const keyword = filterKeyword_state.trim().toLowerCase();

        const statusMatch =
            statusFilter_state === "All" ||
            (statusFilter_state === "active" && campaignStatus === "active") ||
            (statusFilter_state === "paused" && campaignStatus !== "active");

        const typeMatch =
            filterType_state === "All" ||
            (campaign.campaignType &&
                campaign.campaignType.toLowerCase() === filterType_state.toLowerCase());

        const keywordMatch = keyword === "" || title.includes(keyword);

        return statusMatch && typeMatch && keywordMatch;
    }) || [];

    return (
        <div>
            <SideMenu sideMenu_show={true} />
            <div className="mt-[75px] md:ml-[256px] p-6 space-y-8">
                {/* PTC ads Limit Section */}
                <div className="p-6 border border-gray-300 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">PTC Ads Total Min Views Limit</h2>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                        <input
                            type="text"
                            className="border p-2 rounded w-full sm:w-1/3"
                            value={PTCAds_total_minimum_Views_state}
                            onChange={(e) => setPTCAds_total_minimum_Views_state(e.target.value)}
                        />
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 sm:mt-0 sm:ml-4"
                            onClick={handle_PTCAdsLimit_update}
                        >
                            Update
                        </button>
                    </div>
                </div>

                {/* Instructions Section */}
                <div className="p-6 border border-gray-300 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Instructions</h2>
                    <textarea
                        ref={textareaRef}
                        className="border p-2 rounded w-full overflow-hidden resize-none"
                        value={PTCAdsInstructions_state}
                        onChange={(e) => {
                            setPTCAdsInstructions_state(e.target.value);
                            adjustTextareaHeight();
                        }}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                        onClick={() => handle_PTCAdsInstructions_update()}
                    >
                        Update
                    </button>
                </div>

                {/* Pricing Section */}
                <div className='p-6 border border-gray-300 rounded-lg shadow-md'>
                    {["window", "iframe", "youtube"].map((section) => (
                        <div key={section} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium capitalize">{section}</h3>
                                <button
                                    type="button"
                                    className="text-green-600 font-bold text-xl"
                                    onClick={() => addNewField(section)}
                                >
                                    +
                                </button>
                            </div>

                            <div className="flex flex-col gap-2">
                                {formData_state[section].map((field, index) => (
                                    <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                                        <input
                                            type="text"
                                            name="time"
                                            value={field.time}
                                            onChange={(e) => handleDynamicChange(e, section, index)}
                                            placeholder="Seconds"
                                            className="border p-2 rounded focus:ring focus:ring-blue-300"
                                        />
                                        <input
                                            type="text"
                                            name="price"
                                            value={field.price}
                                            onChange={(e) => handleDynamicChange(e, section, index)}
                                            placeholder="Price"
                                            className="border p-2 rounded focus:ring focus:ring-blue-300"
                                        />
                                        {formData_state[section].length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeField(section, index)}
                                                className="text-red-600 font-bold text-xl px-2"
                                                title="Remove"
                                            >
                                                −
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {/* Submit Button */}
                    <div className="flex justify-end mt-6">
                        <button
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                            onClick={handle_priceSubmit_update}
                        >
                            Update Price
                        </button>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="bg-white p-4 rounded-lg shadow-md flex flex-wrap gap-4 items-center mb-6">
                    <select
                        value={statusFilter_state}
                        onChange={(e) => setStatusFilter_state(e.target.value)}
                        className="border rounded-lg px-4 py-2"
                    >
                        <option value="All">Status: All</option>
                        <option value="active">Status: Active</option>
                        <option value="paused">Status: Paused</option>
                    </select>
                    <select
                        className="border rounded-lg px-4 py-2"
                        value={filterType_state}
                        onChange={(e) => setFilterType_state(e.target.value)}
                    >
                        <option value="All">Type: All</option>
                        <option value="window">Type: Window</option>
                        <option value="iframe">Type: iFrame</option>
                        <option value="youtube">Type: Youtube</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Enter keyword"
                        value={filterKeyword_state}
                        onChange={(e) => setFilterKeyword_state(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-full md:w-auto"
                    />
                </div>
                {filteredCampaigns && filteredCampaigns.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredCampaigns.map((campaign, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg shadow-md border">
                                {/* User ID */}
                                <div className="mb-2">
                                    <span className="text-gray-600 font-medium">User ID:</span>
                                    <div className="text-black mt-1 break-all">
                                        {campaign.userDB_id || 'N/A'}
                                    </div>
                                </div>

                                {/* Title */}
                                <div className="mb-2 flex justify-between">
                                    <span className="text-gray-600 font-medium">Title:</span>
                                    <span className="text-black">
                                        {campaign.step_2_title}
                                    </span>
                                </div>

                                {/* Total Views */}
                                <div className="mb-2 flex justify-between">
                                    <span className="text-gray-600 font-medium">Total Views:</span>
                                    <span className="text-black">
                                        {campaign.completed_total_views || 0} / {campaign.step_3_total_views || 0}
                                    </span>
                                </div>

                                {/* Spend */}
                                <div className="mb-2 flex justify-between">
                                    <span className="text-gray-600 font-medium">Spend:</span>
                                    <span className="text-black">
                                        {campaign.spend || 0} / {campaign.step_4_subTotal || 0}
                                    </span>
                                </div>

                                {/* URL */}
                                <div className="mb-2">
                                    <span className="text-gray-600 font-medium">URL:</span>
                                    <div
                                        className="text-blue-600 mt-1 break-all underline truncate"
                                        title={campaign.step_2_url}
                                    >
                                        {campaign.step_2_url || 'N/A'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 rounded-lg flex flex-col items-center justify-center min-h-32 border">
                        <FaRegFrown className="w-16 h-16 text-gray-400 mb-4" />
                        <p className="text-gray-500">There is no data</p>
                    </div>
                )}
            </div>
            {data_process_state && <ProcessBgBlack />}
        </div>
    );
}

export default PTCAds;