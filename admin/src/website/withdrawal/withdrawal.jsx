import React, { useState, useEffect, useRef } from 'react';
import ProcessBgBlack from '../components/processBgBlack/processBgBlack';
import SideMenu from '../components/sideMenu/sideMenu';
import showNotification from '../components/showNotification';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const Withdrawal = () => {
    // State for process/loading indicator
    const [data_process_state, setData_process_state] = useState(false);
    // State for withdrawal records
    const [withdrawals_state, setWithdrawals_state] = useState([]);
    // State for searching withdrawals by withdrawal ID
    const [searchId_state, setSearchId_state] = useState("");
    // State for filtering withdrawals by status
    const [filterStatus_state, setFilterStatus_state] = useState("All");
    // State for searching user data by User ID
    const navigation = useNavigate();

    // Fetch withdrawal records on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setData_process_state(true);
                const response = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/admin/getWithdrawalsData`,
                    { withCredentials: true }
                );
                if (response?.data?.msg) {
                    let { withdrawal_instructions, withdrawals } = response.data.msg
                    setWithdrawals_state(withdrawals);
                    setWithdrawalInstructions_state(withdrawal_instructions.join("\n"))
                }
            } catch (error) {
                console.error("Error fetching withdrawal page data:", error);
                if (error.response.data.error_msg) {
                    showNotification(true, error.response.data.error_msg);
                } else if (error.response.data.adminJWT_error_msg) {
                    showNotification(true, error.response.data.adminJWT_error_msg);
                    navigation('/');
                } else {
                    showNotification(true, "Something went wrong, please try again.");
                }
            } finally {
                setData_process_state(false);
            }
        };
        fetchData();
    }, []);

    // Handler to update a withdrawal record
    const handleUpdate = async (id, newStatus, remark) => {
        if (!id) {
            showNotification(true, "Withdrawal ID is required.");
            return;
        }

        // Prepare the payload with remark only if provided
        const payload = { id, newStatus, ...(remark ? { remark } : {}) };

        // Show confirmation dialog
        const confirmResult = await Swal.fire({
            title: "Are you sure?",
            text: "Update This Withdrawal Data?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, update it!",
            cancelButtonText: "Cancel"
        });

        if (!confirmResult.isConfirmed) return;

        try {
            setData_process_state(true);
            const response = await axios.patch(
                `${import.meta.env.VITE_SERVER_URL}/admin/updateWithdrawalsData`,
                payload,
                { withCredentials: true }
            );
            if (response?.data?.msg) {
                setWithdrawals_state((prevRecords) =>
                    prevRecords.map((record) =>
                        record._id === id ? { ...record, withdrawal_status: newStatus, remark } : record
                    )
                );
                showNotification(false, "Withdrawal updated successfully.");
            } else {
                showNotification(true, "Failed to update withdrawal record.");
            }
        } catch (error) {
            console.error("Error updating withdrawal record:", error);
            const errorMsg =
                error?.response?.data?.error_msg ||
                error?.response?.data?.adminJWT_error_msg ||
                "Something went wrong, please try again.";
            showNotification(true, errorMsg);
            if (error?.response?.data?.adminJWT_error_msg) {
                navigation('/');
            }
        } finally {
            setData_process_state(false);
        }
    };

    // Filter withdrawal records based on search ID and status filter
    const filteredWithdrawals = withdrawals_state.filter(record => {
        const matchesSearch = searchId_state ? record._id.includes(searchId_state) : true;
        const matchesFilter =
            filterStatus_state === "All" ? true : record.withdrawal_status === filterStatus_state;
        return matchesSearch && matchesFilter;
    });


    const [withdrawalInstructions_state, setWithdrawalInstructions_state] = useState('');
    const withdrawal_instructions_database_patch = async (data) => {
        try {
            setData_process_state(true);

            const response = await axios.patch(
                `${import.meta.env.VITE_SERVER_URL}/admin/update_withdrawal_instructions_data`,
                { data },
                { withCredentials: true }
            );
            if (response?.data?.msg) {
                const { withdrawal_instructions } = response.data.msg;
                setWithdrawalInstructions_state(withdrawal_instructions.join("\n"))
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
    const handle_withdrawalInstructions_update = () => {
        if (withdrawalInstructions_state.trim() !== '') {
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
                    withdrawal_instructions_database_patch(withdrawalInstructions_state.split("\n"))
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
    }, [withdrawalInstructions_state]);

    return (
        <div>
            <SideMenu sideMenu_show={true} />
            <div className="mt-[75px] md:ml-[256px] p-6 space-y-8">
                <h1 className="text-2xl font-bold mb-4">Manage Withdrawals</h1>

                {/* Instructions Section */}
                <div className="p-6 border border-gray-300 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Instructions</h2>
                    <textarea
                        ref={textareaRef}
                        className="border p-2 rounded w-full overflow-hidden resize-none"
                        value={withdrawalInstructions_state}
                        onChange={(e) => {
                            setWithdrawalInstructions_state(e.target.value);
                            adjustTextareaHeight();
                        }}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                        onClick={() => handle_withdrawalInstructions_update()}
                    >
                        Update
                    </button>
                </div>

                {/* Search and Filter Controls for Withdrawals */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-2">
                        <label htmlFor="searchId" className="font-medium">
                            Search by Withdrawal ID:
                        </label>
                        <input
                            id="searchId"
                            type="text"
                            value={searchId_state}
                            onChange={(e) => setSearchId_state(e.target.value)}
                            placeholder="Enter withdrawal ID"
                            className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-400"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <label htmlFor="filterStatus" className="font-medium">
                            Filter by Status:
                        </label>
                        <select
                            id="filterStatus"
                            value={filterStatus_state}
                            onChange={(e) => setFilterStatus_state(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-400"
                        >
                            <option value="All">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Success">Success</option>
                            <option value="Reject">Reject</option>
                        </select>
                    </div>
                </div>

                {/* Withdrawals Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2 border">Withdrawal ID</th>
                                <th className="px-4 py-2 border">User ID</th>
                                <th className="px-4 py-2 border">Balance</th>
                                <th className="px-4 py-2 border">Method</th>
                                <th className="px-4 py-2 border">Account Info</th>
                                <th className="px-4 py-2 border">Time</th>
                                <th className="px-4 py-2 border">Status</th>
                                <th className="px-4 py-2 border">Remark</th>
                                <th className="px-4 py-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredWithdrawals.length > 0 ? (
                                filteredWithdrawals.map((record) => (
                                    <WithdrawalRow
                                        key={record._id}
                                        record={record}
                                        onUpdate={handleUpdate}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center py-4">
                                        No withdrawal records found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {data_process_state && <ProcessBgBlack />}
            </div>
        </div>
    );
};

// Component to render a single withdrawal record row with update options
const WithdrawalRow = ({ record, onUpdate }) => {
    // Check if the record is in a final state
    const isFinalStatus =
        record.withdrawal_status === "Success" || record.withdrawal_status === "Reject";
    const [selectedStatus_state, setSelectedStatus_state] = useState(record.withdrawal_status);
    const [remark_state, setRemark_state] = useState(record.remark || "");

    const handleUpdateClick = () => {
        // Prevent update if the record is already in a final state
        if (isFinalStatus) return;
        onUpdate(record._id, selectedStatus_state, remark_state);
    };

    return (
        <tr className="border-b">
            <td className="px-4 py-2 border break-words">{record._id}</td>
            <td className="px-4 py-2 border break-words">{record.userDB_id}</td>
            <td className="px-4 py-2 border">{record.balance}</td>
            <td className="px-4 py-2 border">{record.withdrawal_method}</td>
            <td className="px-4 py-2 border break-words">
                {record.withdrawal_account_information}
            </td>
            <td className="px-4 py-2 border">{record.time}</td>
            <td className="px-4 py-2 border">
                <select
                    value={selectedStatus_state}
                    onChange={(e) => setSelectedStatus_state(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-400"
                    disabled={isFinalStatus}
                >
                    <option value="Pending">Pending</option>
                    <option value="Success">Success</option>
                    <option value="Reject">Reject</option>
                </select>
            </td>
            <td className="px-4 py-2 border">
                <input
                    type="text"
                    value={remark_state}
                    onChange={(e) => setRemark_state(e.target.value)}
                    placeholder="Enter remark"
                    className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-400"
                    disabled={isFinalStatus}
                />
            </td>
            <td className="px-4 py-2 border">
                <button
                    onClick={handleUpdateClick}
                    className={`bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-1 transition ${isFinalStatus ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={isFinalStatus}
                >
                    Update
                </button>
            </td>
        </tr>
    );
};

export default Withdrawal;
