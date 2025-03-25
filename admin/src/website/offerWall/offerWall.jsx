import React, { useEffect, useState, useRef } from 'react';
import ProcessBgBlack from '../components/processBgBlack/processBgBlack';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SideMenu from '../components/sideMenu/sideMenu';
import showNotification from '../components/showNotification';
import Swal from 'sweetalert2';

const OfferWall = () => {
    // State variables
    const [data_process_state, setData_process_state] = useState(false);
    const [offerWallInstructions_state, setOfferWallInstructions_state] = useState('');
    const [offerWallsData_state, setOfferWallsData_state] = useState([]);
    const [newOfferWall_state, setNewOfferWall_state] = useState({
        offerWallName: '',
        offerWallApiLink: '',
    });
    const [editingId_state, setEditingId_state] = useState(null);
    const [editData_state, setEditData_state] = useState({
        offerWallName: '',
        offerWallApiLink: '',
    });

    // Ref for textarea
    const textareaRef = useRef(null);
    const navigation = useNavigate();

    // Fetch data from the server
    const fetchData = async () => {
        try {
            setData_process_state(true);
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/admin/getOfferWallData`,
                { withCredentials: true }
            );
            if (response?.data?.msg) {
                const { offerWallData, other_data_offerWall } = response.data.msg;
                setOfferWallInstructions_state(other_data_offerWall?.offerWall_instructions?.join("\n"));
                setOfferWallsData_state(offerWallData?.reverse());
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            if (error.response?.data?.error_msg) {
                showNotification(true, error.response.data.error_msg);
            } else if (error.response?.data?.adminJWT_error_msg) {
                showNotification(true, error.response.data.adminJWT_error_msg);
                navigation('/');
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

    // Handler for updating offer wall instructions
    const handle_offerWallInstructions_update = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Update offer wall instructions?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, update it!",
            cancelButtonText: "Cancel"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setData_process_state(true);
                    // Split the textarea content into an array (assuming each line is an instruction)
                    const instructionsArray = offerWallInstructions_state.split('\n');
                    const response = await axios.patch(
                        `${import.meta.env.VITE_SERVER_URL}/admin/patchOfferWallInstructions`,
                        { offerWall_instructions: instructionsArray },
                        { withCredentials: true }
                    );
                    if (response.data && response.data.success) {
                        showNotification(false, "Instructions updated successfully.");
                    } else {
                        showNotification(true, "Failed to update instructions.");
                    }
                } catch (error) {
                    console.error("Error updating instructions:", error);
                    showNotification(true, "Error updating instructions.");
                } finally {
                    setData_process_state(false);
                }
            }
        });
    };

    // Handler for adding a new offer wall
    const handle_AddOfferWall = async () => {
        if (!newOfferWall_state.offerWallName || !newOfferWall_state.offerWallApiLink) {
            showNotification(true, "Please fill in all fields.");
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: "Add new OfferWall link?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, add it!",
            cancelButtonText: "Cancel"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setData_process_state(true);
                    const response = await axios.post(
                        `${import.meta.env.VITE_SERVER_URL}/admin/postOfferWall`,
                        newOfferWall_state,
                        { withCredentials: true }
                    );
                    if (response.data && response.data.success) {
                        showNotification(false, "OfferWall added successfully.");
                        // Prepend the newly added offer wall to the list
                        fetchData()
                        setNewOfferWall_state({ offerWallName: '', offerWallApiLink: '' });
                    } else {
                        showNotification(true, "Failed to add OfferWall.");
                    }
                } catch (error) {
                    console.error("Error adding OfferWall:", error);
                    showNotification(true, "Error adding OfferWall.");
                } finally {
                    setData_process_state(false);
                }
            }
        });
    };

    // Handler to initiate editing of an offer wall
    const handleEdit = (link) => {
        setEditingId_state(link._id);
        setEditData_state({ offerWallName: link.offerWallName, offerWallApiLink: link.offerWallApiLink });
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingId_state(null);
        setEditData_state({ offerWallName: '', offerWallApiLink: '' });
    };

    // Update the edited offer wall
    const handleUpdate = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Update OfferWall details?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, update it!",
            cancelButtonText: "Cancel"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setData_process_state(true);
                    const response = await axios.patch(
                        `${import.meta.env.VITE_SERVER_URL}/admin/patchOfferWall`,
                        { editData_state, editingId_state },
                        { withCredentials: true }
                    );
                    if (response.data && response.data.success) {
                        showNotification(false, "OfferWall updated successfully.");
                        // Update the offer wall in the state
                        fetchData()
                        setEditingId_state(null);
                        setEditData_state({ offerWallName: '', offerWallApiLink: '' });
                    } else {
                        showNotification(true, "Failed to update OfferWall.");
                    }
                } catch (error) {
                    console.error("Error updating OfferWall:", error);
                    showNotification(true, "Error updating OfferWall.");
                } finally {
                    setData_process_state(false);
                }
            }
        });
    };

    // Delete an offer wall
    const handle_DeleteOfferWall = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Delete this OfferWall?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setData_process_state(true);
                    const response = await axios.delete(
                        `${import.meta.env.VITE_SERVER_URL}/admin/deleteOfferWall?id=${id}`,
                        { withCredentials: true }
                    );
                    if (response.data && response.data.success) {
                        showNotification(false, "OfferWall deleted successfully.");
                        setOfferWallsData_state(prev => prev.filter(link => link._id !== id));
                    } else {
                        showNotification(true, "Failed to delete OfferWall.");
                    }
                } catch (error) {
                    console.error("Error deleting OfferWall:", error);
                    showNotification(true, "Error deleting OfferWall.");
                } finally {
                    setData_process_state(false);
                }
            }
        });
    };

    // to adjust height dynamically
    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto"; // Reset height
            textarea.style.height = textarea.scrollHeight + "px"; // Set new height
        }
    };
    useEffect(() => {
        adjustTextareaHeight(); // Adjust height on mount
    }, [offerWallInstructions_state]);

    return (
        <div>
            <SideMenu sideMenu_show={true} />
            <div className="mt-[75px] md:ml-[256px] p-6 space-y-8">
                {/* Instructions Section */}
                <div className="p-6 border border-gray-300 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Instructions</h2>
                    <textarea
                        className="border p-2 rounded w-full overflow-hidden resize-none"
                        value={offerWallInstructions_state}
                        ref={textareaRef}
                        onChange={(e) => setOfferWallInstructions_state(e.target.value)}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                        onClick={handle_offerWallInstructions_update}
                    >
                        Update
                    </button>
                </div>

                {/* Link OfferWalls Data Section */}
                <div className="p-6 border border-gray-300 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">OfferWalls</h2>
                    {/* Add New OfferWall */}
                    <div className="space-y-2 mb-4">
                        <input
                            type="text"
                            className="border p-2 rounded w-full"
                            placeholder="OfferWall Name"
                            value={newOfferWall_state.offerWallName}
                            onChange={(e) =>
                                setNewOfferWall_state({ ...newOfferWall_state, offerWallName: e.target.value })
                            }
                        />
                        <input
                            type="text"
                            className="border p-2 rounded w-full"
                            placeholder="API Link"
                            value={newOfferWall_state.offerWallApiLink}
                            onChange={(e) =>
                                setNewOfferWall_state({ ...newOfferWall_state, offerWallApiLink: e.target.value })
                            }
                        />
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={handle_AddOfferWall}
                        >
                            Add Link
                        </button>
                    </div>

                    {/* Display & Manage OfferWalls */}
                    <ul className="space-y-4">
                        {offerWallsData_state.map((link) => (
                            <li key={link._id} className="p-4 border rounded-lg space-y-2">
                                {editingId_state === link._id ? (
                                    <>
                                        <input
                                            type="text"
                                            className="border p-2 rounded w-full"
                                            value={editData_state.offerWallName}
                                            onChange={(e) =>
                                                setEditData_state({ ...editData_state, offerWallName: e.target.value })
                                            }
                                        />
                                        <input
                                            type="text"
                                            className="border p-2 rounded w-full"
                                            value={editData_state.offerWallApiLink}
                                            onChange={(e) =>
                                                setEditData_state({ ...editData_state, offerWallApiLink: e.target.value })
                                            }
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                                                onClick={handleUpdate}
                                            >
                                                Update
                                            </button>
                                            <button
                                                className="bg-gray-500 text-white px-4 py-2 rounded w-full"
                                                onClick={handleCancelEdit}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p>
                                            <strong>OfferWall Name:</strong> {link.offerWallName}
                                        </p>
                                        <p>
                                            <strong>API Link:</strong> {link.offerWallApiLink}
                                        </p>
                                        <div className="flex gap-4">
                                            <button
                                                className="bg-yellow-500 text-white px-4 py-2 rounded"
                                                onClick={() => handleEdit(link)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-4 py-2 rounded"
                                                onClick={() => handle_DeleteOfferWall(link._id)}
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
};

export default OfferWall;
