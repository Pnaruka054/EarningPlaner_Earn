import { useEffect, useRef, useState } from 'react';
import SideMenu from '../components/sideMenu/sideMenu';
import axios from 'axios'
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom'
import ProcessBgBlack from "../components/processBgBlack/processBgBlack";
import showNotification from "../components/showNotification";

const ShortLink = () => {
    let [data_process_state, setData_process_state] = useState(false);

    const navigation = useNavigate();

    const fetchData = async () => {
        try {
            setData_process_state(true);

            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/admin/getShortLinkData`,
                { withCredentials: true }
            );

            if (response?.data?.msg) {
                const { other_data_shortLink_Instructions, linkShortnerData
                } = response.data.msg;
                setShortLinkInstructions_state(other_data_shortLink_Instructions.join("\n"))
                setLinkShortnersData_state(linkShortnerData.reverse())
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
    useEffect(() => {
        fetchData()
    }, []);

    // handle short link update data
    const [shortLinkInstructions_state, setShortLinkInstructions_state] = useState('');

    const shortLink_database_patch = async (data) => {
        try {
            setData_process_state(true);
            const response = await axios.patch(
                `${import.meta.env.VITE_SERVER_URL}/admin/update_ShortLink_data`,
                { data },
                { withCredentials: true }
            );
            if (response?.data?.msg) {
                fetchData()
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

    const handle_shortLinkInstructions_update = () => {
        if (shortLinkInstructions_state.trim() !== '') {
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
                    shortLink_database_patch(shortLinkInstructions_state.split("\n"), 'text')
                }
            });
        }
    };

    // handle linkshortners
    const [linkShortnersData_state, setLinkShortnersData_state] = useState([]);
    const [newLinkShortner_state, setNewLinkShortner_state] = useState({
        shortnerName: "",
        amount: "",
        time: "",
        shortnerDomain: "",
        shortnerApiLink: "",
        shortnerQuickLink: "",
        how_much_click_allow: "",
        how_to_complete: ""
    });
    const [editingId_state, setEditingId_state] = useState(null);
    const [editData_state, setEditData_state] = useState(null);

    const linkShortner_database_post = async (linkShortner_data) => {
        try {
            setData_process_state(true);

            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/admin/post_ShortenLink_data`,
                { linkShortner_data },
                { withCredentials: true }
            );
            if (response?.data?.msg) {
                fetchData()
                setEditingId_state(null);
                setEditData_state(null);
                showNotification(false, 'updated success!')
                setNewLinkShortner_state({ shortnerName: '', amount: '', time: '', _id: '', shortnerDomain: '', shortnerApiLink: '', how_much_click_allow: '' });
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

    const handle_AddLinkShortner = () => {
        if (newLinkShortner_state.shortnerName.trim() !== '' &&
            newLinkShortner_state.amount.trim() !== '' &&
            newLinkShortner_state.time.trim() !== '' &&
            newLinkShortner_state.shortnerDomain.trim() !== '' &&
            newLinkShortner_state.how_much_click_allow.trim() !== '' &&
            newLinkShortner_state.shortnerApiLink.trim() !== ''
        ) {
            Swal.fire({
                title: "Are you sure?",
                text: "Add new Link Shortner?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, update it!",
                cancelButtonText: "Cancel"
            }).then((result) => {
                if (result.isConfirmed) {
                    linkShortner_database_post(newLinkShortner_state)
                }
            });
        }
    };

    const linkShortner_database_patch = async () => {
        try {
            setData_process_state(true);
            const response = await axios.patch(
                `${import.meta.env.VITE_SERVER_URL}/admin/patch_ShortenLink_data`,
                {
                    _id: editData_state._id,
                    shortnerName: editData_state.shortnerName,
                    amount: editData_state.amount,
                    time: editData_state.time,
                    shortnerDomain: editData_state.shortnerDomain,
                    shortnerApiLink: editData_state.shortnerApiLink,
                    shortnerQuickLink: editData_state.shortnerQuickLink,
                    how_much_click_allow: editData_state.how_much_click_allow,
                    how_to_complete: editData_state.how_to_complete
                },
                { withCredentials: true }
            );

            if (response?.data?.msg) {
                fetchData()
                setEditingId_state(null);
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
        setEditingId_state(link._id);
        setEditData_state({ ...link });
    };

    const handleCancelEdit = () => {
        setEditingId_state(null);
        setEditData_state(null);
    };

    const handleUpdate = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Update This Link Shortner link?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, update it!",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                linkShortner_database_patch();
            }
        });
    };

    const linkShortner_database_delete = async (id) => {
        try {
            setData_process_state(true);

            const response = await axios.delete(
                `${import.meta.env.VITE_SERVER_URL}/admin/delete_ShortenLink_data?id=${id}`,
                { withCredentials: true }
            );

            if (response?.data?.msg) {
                showNotification(false, "Deleted successfully!");
                setLinkShortnersData_state(linkShortnersData_state.filter(link => link._id !== id));
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

    const handle_DeleteLinkShortner = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Delete This Link Shortner?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, update it!",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                linkShortner_database_delete(id)
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
    }, [shortLinkInstructions_state]);

    return (
        <div>
            <SideMenu sideMenu_show={true} />
            <div className="mt-[75px] md:ml-[256px] p-6 space-y-8">
                {/* Instructions Section */}
                <div className="p-6 border border-gray-300 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Instructions</h2>
                    <textarea
                        className="border p-2 rounded w-full overflow-hidden resize-none"
                        value={shortLinkInstructions_state}
                        ref={textareaRef}
                        onChange={(e) => setShortLinkInstructions_state(e.target.value)}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                        onClick={handle_shortLinkInstructions_update}
                    >
                        Update
                    </button>
                </div>

                {/* link Shortners Data Section */}
                <div className="p-6 border border-gray-300 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Link Shortners</h2>
                    {/* Add New Link */}
                    <div className="space-y-2 mb-4">
                        <input type="text" className="border p-2 rounded w-full" placeholder="Shortner Name" value={newLinkShortner_state.shortnerName} onChange={(e) => setNewLinkShortner_state({ ...newLinkShortner_state, shortnerName: e.target.value })} />
                        <input type="text" className="border p-2 rounded w-full" placeholder="Amount" value={newLinkShortner_state.amount} onChange={(e) => setNewLinkShortner_state({ ...newLinkShortner_state, amount: e.target.value })} />
                        <input type="text" className="border p-2 rounded w-full" placeholder="Shortner Domain" value={newLinkShortner_state.shortnerDomain} onChange={(e) => setNewLinkShortner_state({ ...newLinkShortner_state, shortnerDomain: e.target.value })} />
                        <input type="text" className="border p-2 rounded w-full" placeholder="API Link" value={newLinkShortner_state.shortnerApiLink} onChange={(e) => setNewLinkShortner_state({ ...newLinkShortner_state, shortnerApiLink: e.target.value })} />
                        <input type="text" className="border p-2 rounded w-full" placeholder="Time" value={newLinkShortner_state.time} onChange={(e) => setNewLinkShortner_state({ ...newLinkShortner_state, time: e.target.value })} />
                        <input type="text" className="border p-2 rounded w-full" placeholder="Clicks Allowed" value={newLinkShortner_state.how_much_click_allow} onChange={(e) => setNewLinkShortner_state({ ...newLinkShortner_state, how_much_click_allow: e.target.value })} />
                        <input type="text" className="border p-2 rounded w-full" placeholder="How to Complete Video Link" value={newLinkShortner_state.how_to_complete} onChange={(e) => setNewLinkShortner_state({ ...newLinkShortner_state, how_to_complete: e.target.value })} />
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={handle_AddLinkShortner}
                        >
                            Add Link
                        </button>
                    </div>

                    {/* Display & Manage Links */}
                    <ul className="space-y-4">
                        {linkShortnersData_state.map((link, index) => (
                            <li key={link._id} className="p-4 border rounded-lg space-y-2">
                                {editingId_state === link._id ? (
                                    <>
                                        <input type="text" className="border p-2 rounded w-full" placeholder="Shortner Name" value={editData_state.shortnerName} onChange={(e) => setEditData_state({ ...editData_state, shortnerName: e.target.value })} />
                                        <input type="text" className="border p-2 rounded w-full" placeholder="Amount" value={editData_state.amount} onChange={(e) => setEditData_state({ ...editData_state, amount: e.target.value })} />
                                        <input type="text" className="border p-2 rounded w-full" placeholder="Shortner Domain" value={editData_state.shortnerDomain} onChange={(e) => setEditData_state({ ...editData_state, shortnerDomain: e.target.value })} />
                                        <input type="text" className="border p-2 rounded w-full" placeholder="API Link" value={editData_state.shortnerApiLink} onChange={(e) => setEditData_state({ ...editData_state, shortnerApiLink: e.target.value })} />
                                        <input type="text" className="border p-2 rounded w-full" placeholder="Quick Link" value={editData_state.shortnerQuickLink} onChange={(e) => setEditData_state({ ...editData_state, shortnerQuickLink: e.target.value })} />
                                        <input type="text" className="border p-2 rounded w-full" placeholder="Time" value={editData_state.time} onChange={(e) => setEditData_state({ ...editData_state, time: e.target.value })} />
                                        <input type="text" className="border p-2 rounded w-full" placeholder="Clicks Allowed" value={editData_state.how_much_click_allow} onChange={(e) => setEditData_state({ ...editData_state, how_much_click_allow: e.target.value })} />
                                        <input type="text" className="border p-2 rounded w-full" placeholder="How to Complete Video Link" value={editData_state.how_to_complete} onChange={(e) => setEditData_state({ ...editData_state, how_to_complete: e.target.value })} />
                                        <div className="flex gap-2">
                                            <button className="bg-blue-500 text-white px-4 py-2 rounded w-full" onClick={handleUpdate}>Update</button>
                                            <button className="bg-gray-500 text-white px-4 py-2 rounded w-full" onClick={handleCancelEdit}>Cancel</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p><strong>Shortner Name:</strong> {link.shortnerName}</p>
                                        <p><strong>Amount:</strong> {link.amount}</p>
                                        <p><strong>Shortner Domain:</strong> {link.shortnerDomain}</p>
                                        <p className='break-all whitespace-normal'><strong>Shortner API Link:</strong> {link.shortnerApiLink}</p>
                                        <p className='break-all whitespace-normal'><strong>Shortner Quick Link:</strong> {link.shortnerQuickLink}</p>
                                        <p><strong>time:</strong> {link.time}</p>
                                        <p><strong>Clicks Allowed:</strong> {link.how_much_click_allow}</p>
                                        <p><strong>Video Link:</strong> {link.how_to_complete}</p>
                                        <div className="flex gap-4">
                                            <button
                                                className="bg-yellow-500 text-white px-4 py-2 rounded"
                                                onClick={() => handleEdit(link)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-4 py-2 rounded"
                                                onClick={() => handle_DeleteLinkShortner(link._id)}
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

export default ShortLink;
