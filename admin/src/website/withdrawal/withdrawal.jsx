import React, { useState, useEffect } from 'react';
import ProcessBgBlack from '../components/processBgBlack/processBgBlack';
import SideMenu from '../components/sideMenu/sideMenu';
import showNotification from '../components/showNotification';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    const [userSearchId_state, setUserSearchId_state] = useState("");
    const [userData_state, setUserData_state] = useState(null);
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
                    setWithdrawals_state(response.data.msg);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                if (error.response.data.error_msg) {
                    showNotification(true, error.response.data.error_msg);
                } else if (error.response.data.adminJWT_error_msg) {
                    showNotification(true, error.response.data.adminJWT_error_msg);
                    navigation('/admin');
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
        try {
            setData_process_state(true);
            if (!id) {
                showNotification(true, "Withdrawal ID is required.");
                return;
            }
            const payload = { id, newStatus, ...(remark ? { remark } : {}) };
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
                navigation('/admin');
            }
        } finally {
            setData_process_state(false);
        }
    };

    // Handler to search user by ID (simulate API call)
    const handleUserSearch = async () => {
        // Validate that a User ID is provided
        if (!userSearchId_state.trim()) {
            showNotification(true, "Please enter a valid User ID.");
            return;
        }

        setData_process_state(true);
        try {
            // Using axios params to pass query parameter cleanly
            const { data } = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/admin/getUserData`,
                {
                    params: { userSearchId: userSearchId_state },
                    withCredentials: true,
                }
            );

            if (data?.msg) {
                setUserData_state(data.msg);
            } else {
                showNotification(true, "No user data found.");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            const errorMsg =
                error?.response?.data?.error_msg ||
                error?.response?.data?.adminJWT_error_msg ||
                "Something went wrong, please try again.";
            showNotification(true, errorMsg);
            if (error?.response?.data?.adminJWT_error_msg) {
                navigation("/admin");
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

    return (
        <div>
            <SideMenu sideMenu_show={true} />
            <div className="mt-[75px] md:ml-[256px] p-6 space-y-8">
                <h1 className="text-2xl font-bold mb-4">Manage Withdrawals</h1>

                {/* User Search Section */}
                <div className="p-4 border border-gray-300 rounded">
                    <h2 className="text-xl font-semibold mb-2">Search User Information</h2>
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            placeholder="Enter User ID"
                            value={userSearchId_state}
                            onChange={(e) => setUserSearchId_state(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-400"
                        />
                        <button
                            onClick={handleUserSearch}
                            className="bg-green-600 hover:bg-green-700 text-white rounded px-3 py-1 transition"
                        >
                            Search User
                        </button>
                    </div>
                    {userData_state && (
                        <div className="mt-4 space-y-1">
                            <p><strong>ID:</strong> {userData_state._id}</p>
                            <p><strong>Name:</strong> {userData_state.name}</p>
                            <p><strong>Email:</strong> {userData_state.email_address}</p>
                            <p><strong>UserName:</strong> {userData_state.userName}</p>
                            <p><strong>Google ID:</strong> {userData_state.google_id}</p>
                            <p><strong>Withdrawable Amount:</strong> {userData_state.withdrawable_amount}</p>
                            <p><strong>Address:</strong> {userData_state.address}</p>
                            <p><strong>City:</strong> {userData_state.city}</p>
                            <p><strong>Mobile Number:</strong> {userData_state.mobile_number}</p>
                            <p><strong>State:</strong> {userData_state.state}</p>
                            <p><strong>Withdrawal Account Information:</strong> {userData_state.withdrawal_account_information}</p>
                            <p><strong>Withdrawal Method:</strong> {userData_state.withdrawal_method}</p>
                            <p><strong>Zip Code:</strong> {userData_state.zip_code}</p>
                            <p><strong>Pending Withdrawal Amount:</strong> {userData_state.pending_withdrawal_amount}</p>
                            <p><strong>Total Withdrawal Amount:</strong> {userData_state.total_withdrawal_amount || "Not Withdrawal"}</p>
                        </div>
                    )}
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
