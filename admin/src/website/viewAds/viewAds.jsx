import React, { useState } from 'react';
import SideMenu from '../components/sideMenu/sideMenu';
import axios from 'axios'
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import { useRef } from 'react';
import ProcessBgBlack from "../components/processBgBlack/processBgBlack";
import showNotification from "../components/showNotification";

const ViewAds = () => {

    let [data_process_state, setData_process_state] = useState(false);

    const navigation = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setData_process_state(true);

                const response = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/admin/getViewAdsData`,
                    { withCredentials: true }
                );

                if (response?.data?.msg) {
                    const { other_data_viewAds_limit: { viewAds_pendingUpdates, viewAds_instructions }, viewAds_directLinksData } = response.data.msg;
                    setViewAdsLimit_state(viewAds_pendingUpdates)
                    setViewAdsInstructions_state(viewAds_instructions.join("\n"))
                    setDirectLinkData_state(viewAds_directLinksData.reverse())
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
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

    // handle view ads update data
    const [viewAdsLimit_state, setViewAdsLimit_state] = useState('');
    const [viewAdsInstructions_state, setViewAdsInstructions_state] = useState('');

    const viewAds_database_patch = async (data, btnName) => {
        try {
            setData_process_state(true);

            const response = await axios.patch(
                `${import.meta.env.VITE_SERVER_URL}/admin/update_viewAds_data`,
                { data, btnName },
                { withCredentials: true }
            );
            if (response?.data?.msg) {
                const { viewAds_instructions, viewAds_pendingUpdates } = response.data.msg;
                setViewAdsLimit_state(viewAds_pendingUpdates)
                setViewAdsInstructions_state(viewAds_instructions.join("\n"))
                showNotification(false, "updated successfull!");
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
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

    const handle_ViewAdsLimit_update = () => {
        const limit = parseFloat(viewAdsLimit_state);
        if (!isNaN(limit)) {
            Swal.fire({
                title: "Are you sure?",
                text: "Update ViewAds Limit?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, update it!",
                cancelButtonText: "Cancel"
            }).then((result) => {
                if (result.isConfirmed) {
                    viewAds_database_patch(viewAdsLimit_state, 'limit')
                }
            });
        }
    };

    const handle_ViewAdsInstructions_update = () => {
        if (viewAdsInstructions_state.trim() !== '') {
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
                    viewAds_database_patch(viewAdsInstructions_state.split("\n"), 'text')
                }
            });
        }
    };


    // handle direct link data
    const [directLinkData_state, setDirectLinkData_state] = useState([]);

    const [newDirectLink_state, setNewDirectLink_state] = useState({
        buttonTitle: "",
        amount: "",
        url: "",
        isExtension: false,
        adNetworkName: ""
    });

    const [editingIndex_state, setEditingIndex_state] = useState(null);
    const [editData_state, setEditData_state] = useState(null);

    const viewAdsDirectLink_database_post = async (viewAdsDirectLink_data) => {
        try {
            setData_process_state(true);

            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/admin/post_viewAds_directLink_data`,
                { viewAdsDirectLink_data },
                { withCredentials: true }
            );
            if (response?.data?.msg) {
                const { buttonTitle, amount, url, _id, isExtension, adNetworkName } = response.data.msg;
                setDirectLinkData_state([
                    {
                        _id,
                        buttonTitle,
                        amount,
                        url,
                        isExtension,
                        adNetworkName
                    },
                    ...directLinkData_state,
                ]);
                showNotification(false, 'updated success!')
                setNewDirectLink_state({ buttonTitle: "", amount: "", url: "", isExtension: false, adNetworkName: "" });
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
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

    const handle_AddDirectLink = () => {
        if (newDirectLink_state.url.trim() !== '' && newDirectLink_state.buttonTitle.trim() !== '') {
            Swal.fire({
                title: "Are you sure?",
                text: "Add new direct link?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, update it!",
                cancelButtonText: "Cancel"
            }).then((result) => {
                if (result.isConfirmed) {
                    viewAdsDirectLink_database_post(newDirectLink_state)
                }
            });
        }
    };

    const viewAdsDirectLink_database_patch = async () => {
        try {
            setData_process_state(true);
            const response = await axios.patch(
                `${import.meta.env.VITE_SERVER_URL}/admin/patch_viewAds_directLink_data`,
                {
                    _id: editData_state._id,  // 🔹 Send the current edited ID
                    buttonTitle: editData_state.buttonTitle,
                    amount: editData_state.amount,
                    url: editData_state.url,
                    isExtension: editData_state.isExtension,
                    adNetworkName: editData_state.adNetworkName
                },
                { withCredentials: true }
            );

            console.log(response);

            if (response?.data?.msg) {
                const { buttonTitle, amount, url, _id, isExtension, adNetworkName } = response.data.msg;
                setDirectLinkData_state([
                    {
                        _id,
                        buttonTitle,
                        amount,
                        url,
                        isExtension,
                        adNetworkName
                    },
                    ...directLinkData_state,
                ]);
                setEditingIndex_state(null);
                setEditData_state(null);
                showNotification(false, 'Updated successfully!');
            }
        } catch (error) {
            console.error("Error updating announcement:", error);
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

    const handleEdit = (link) => {
        setEditingIndex_state(link._id);
        setEditData_state({ ...link });
    };

    const handleCancelEdit = () => {
        setEditingIndex_state(null);
        setEditData_state(null);
    };

    const handleUpdate = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Update This direct link?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, update it!",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                viewAdsDirectLink_database_patch();
            }
        });
    };

    const viewAdsDirectLink_database_delete = async (id) => {
        try {
            setData_process_state(true);

            const response = await axios.delete(
                `${import.meta.env.VITE_SERVER_URL}/admin/delete_viewAds_directLink_data?id=${id}`,
                { withCredentials: true }
            );

            if (response?.data?.msg) {
                showNotification(false, "Deleted successfully!");
                setDirectLinkData_state(directLinkData_state.filter(link => link._id !== id));
            }
        } catch (error) {
            console.error("Error deleting announcement:", error);
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

    const handle_DeleteDirectLink = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Delete This direct link?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, update it!",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                viewAdsDirectLink_database_delete(id)
            }
        });
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
    }, [viewAdsInstructions_state]);

    return (
        <div>
            <SideMenu sideMenu_show={true} />
            <div className="mt-[75px] md:ml-[256px] p-6 space-y-8">
                {/* ViewAds Limit Section */}
                <div className="p-6 border border-gray-300 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">ViewAds Limit</h2>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                        <input
                            type="number"
                            className="border p-2 rounded w-full sm:w-1/3"
                            value={viewAdsLimit_state}
                            onChange={(e) => setViewAdsLimit_state(e.target.value)}
                        />
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 sm:mt-0 sm:ml-4"
                            onClick={handle_ViewAdsLimit_update}
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
                        value={viewAdsInstructions_state}
                        onChange={(e) => {
                            setViewAdsInstructions_state(e.target.value);
                            adjustTextareaHeight();
                        }}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                        onClick={() => handle_ViewAdsInstructions_update()}
                    >
                        Update
                    </button>
                </div>

                {/* Direct Links Data Section */}
                <div className="p-6 border border-gray-300 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Direct Links</h2>
                    {/* Add New Link */}
                    <div className="space-y-2 mb-4">
                        <input type="text" className="border p-2 rounded w-full" placeholder="Button Title"
                            value={newDirectLink_state.buttonTitle} onChange={(e) => setNewDirectLink_state({ ...newDirectLink_state, buttonTitle: e.target.value })} />
                        <input type="text" className="border p-2 rounded w-full" placeholder="Amount"
                            value={newDirectLink_state.amount} onChange={(e) => setNewDirectLink_state({ ...newDirectLink_state, amount: e.target.value })} />
                        <input type="text" className="border p-2 rounded w-full" placeholder="URL"
                            value={newDirectLink_state.url} onChange={(e) => setNewDirectLink_state({ ...newDirectLink_state, url: e.target.value })} />
                        <input type="text" className="border p-2 rounded w-full" placeholder="Ad Network Name"
                            value={newDirectLink_state.adNetworkName} onChange={(e) => setNewDirectLink_state({ ...newDirectLink_state, adNetworkName: e.target.value })} />
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" checked={newDirectLink_state.isExtension}
                                onChange={(e) => setNewDirectLink_state({ ...newDirectLink_state, isExtension: e.target.checked })} />
                            <span>Is Extension</span>
                        </label>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={handle_AddDirectLink}
                        >
                            Add Link
                        </button>
                    </div>

                    {/* Display & Manage Links */}
                    <ul className="space-y-4">
                        {directLinkData_state.map((link, index) => (
                            <li key={index} className="p-4 border rounded-lg space-y-2">
                                {editingIndex_state === link._id ? (
                                    <>
                                        <input type="text" className="border p-2 rounded w-full" value={editData_state.buttonTitle} onChange={(e) => setEditData_state({ ...editData_state, buttonTitle: e.target.value })} />
                                        <input type="text" className="border p-2 rounded w-full" value={editData_state.amount} onChange={(e) => setEditData_state({ ...editData_state, amount: e.target.value })} />
                                        <input type="text" className="border p-2 rounded w-full" value={editData_state.url} onChange={(e) => setEditData_state({ ...editData_state, url: e.target.value })} />
                                        <input type="text" className="border p-2 rounded w-full" value={editData_state.adNetworkName} onChange={(e) => setEditData_state({ ...editData_state, adNetworkName: e.target.value })} />
                                        <label className="flex items-center space-x-2">
                                            <input type="checkbox" checked={editData_state.isExtension} onChange={(e) => setEditData_state({ ...editData_state, isExtension: e.target.checked })} />
                                            <span>Is Extension</span>
                                        </label>
                                        <div className="flex gap-2">
                                            <button className="bg-blue-500 text-white px-4 py-2 rounded w-full" onClick={handleUpdate}>Update</button>
                                            <button className="bg-gray-500 text-white px-4 py-2 rounded w-full" onClick={handleCancelEdit}>Cancel</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p><strong>Button Title:</strong> {link.buttonTitle}</p>
                                        <p><strong>Amount:</strong> {link.amount}</p>
                                        <p><strong>URL:</strong> {link.url}</p>
                                        <p><strong>Ad Network Name:</strong> {link.adNetworkName}</p>
                                        <p><strong>Is Extension:</strong> {link.isExtension ? 'Yes' : 'No'}</p>
                                        <div className="flex gap-4">
                                            <button
                                                className="bg-yellow-500 text-white px-4 py-2 rounded"
                                                onClick={() => handleEdit(link)} // Pass the full link object
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-4 py-2 rounded"
                                                onClick={() => handle_DeleteDirectLink(link._id)} // Delete by ID
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
                {data_process_state && <ProcessBgBlack />}
            </div>
        </div>
    );
}

export default ViewAds;
