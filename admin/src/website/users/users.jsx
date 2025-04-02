import { useEffect, useState } from 'react';
import ProcessBgBlack from '../components/processBgBlack/processBgBlack';
import SideMenu from '../components/sideMenu/sideMenu';
import { useNavigate } from 'react-router-dom';
import showNotification from '../components/showNotification';
import axios from 'axios';
import Swal from 'sweetalert2';

const Users = () => {
    const [dataProcess, setDataProcess] = useState(false);
    const [userSearchId, setUserSearchId] = useState("");
    const [allUsersData, setAllUsersData] = useState([]);
    // filterType can be "active", "unactive", or "" (for no filter)
    const [filterType, setFilterType] = useState("");
    // timeRangeDays holds the selected time range in days (default: last 24 hours = 1 day)
    const [timeRangeDays, setTimeRangeDays] = useState(1);
    const navigation = useNavigate();

    // Fetch ALL users data on component mount
    useEffect(() => {
        const fetchAllUsersData = async () => {
            try {
                setDataProcess(true);
                const response = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/admin/getAllUsersData`,
                    { withCredentials: true }
                );
                if (response?.data?.msg) {
                    // response.data.msg is expected to be an array of user data objects
                    setAllUsersData(response.data.msg);
                }
            } catch (error) {
                console.error("Error fetching all users data:", error);
                if (error.response?.data?.error_msg) {
                    showNotification(true, error.response.data.error_msg);
                } else if (error.response?.data?.adminJWT_error_msg) {
                    showNotification(true, error.response.data.adminJWT_error_msg);
                    navigation('/');
                } else {
                    showNotification(true, "Something went wrong, please try again.");
                }
            } finally {
                setDataProcess(false);
            }
        };

        fetchAllUsersData();
    }, [navigation]);

    // Helper: Convert ISO date string to IST Date object and check if it falls within the selected time range (in days) from now (IST)
    const isActiveUser = (lastModifiedStr) => {
        // Convert the ISO string to an IST Date object.
        const lastModifiedIST = new Date(
            new Date(lastModifiedStr).toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
        );
        // Get the current time in IST.
        const nowIST = new Date(
            new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
        );
        // Calculate the threshold date: now minus the selected time range (in days)
        const threshold = new Date(nowIST.getTime() - timeRangeDays * 24 * 60 * 60 * 1000);
        return lastModifiedIST >= threshold;
    };

    // Decide which filtering to apply:
    // If filterType is set (active/unactive), then ignore search input and filter all users accordingly.
    // Otherwise, if search text is provided, filter by user ID.
    const filteredUsers = filterType
        ? allUsersData.filter((entry) =>
            filterType === "active"
                ? isActiveUser(entry.user.lastModified)
                : !isActiveUser(entry.user.lastModified)
        )
        : userSearchId
            ? allUsersData.filter((entry) =>
                entry.user._id.toLowerCase().includes(userSearchId.toLowerCase())
            )
            : allUsersData;

    // Function to handle deletion of a user
    const handleDeleteUser = async (userId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Are you sure you want to delete this user?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setDataProcess(true);
                    // Assume backend DELETE endpoint: /admin/deleteUserData/:userId
                    await axios.delete(`${import.meta.env.VITE_SERVER_URL}/admin/deleteUserData?userId=${userId}`, {
                        withCredentials: true
                    });
                    // Remove deleted user from local state
                    setAllUsersData(prev => prev.filter(entry => entry.user._id !== userId));
                    Swal.fire('Deleted!', 'User deleted successfully.', 'success');
                } catch (error) {
                    console.error("Error deleting user:", error);
                    Swal.fire(
                        'Error!',
                        error.response?.data?.error_msg || "Error deleting user, please try again.",
                        'error'
                    );
                } finally {
                    setDataProcess(false);
                }
            }
        });
    };

    return (
        <div className="relative min-h-screen bg-gray-50">
            <SideMenu sideMenu_show={true} />
            <div className="ml-0 md:ml-[256px] pt-16 p-6 mt-8">
                {/* Filter Section (Search by ID) */}
                <div className="mb-6 p-4 bg-white shadow border border-gray-200 rounded">
                    <h2 className="text-2xl font-semibold mb-4">Filter Users by ID</h2>
                    <input
                        type="text"
                        placeholder="Enter User ID to filter..."
                        value={userSearchId}
                        onChange={(e) => setUserSearchId(e.target.value)}
                        className="w-full md:w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                        disabled={filterType !== ""}
                    />
                    {filterType !== "" && (
                        <p className="mt-2 text-xs text-gray-500">
                            Search by ID is disabled while Active/Unactive filter is applied.
                        </p>
                    )}
                </div>

                {/* Buttons and Time Range Section */}
                <div className="mb-6 p-4 bg-white shadow border border-gray-200 rounded">
                    <div className="flex space-x-4 mb-4">
                        <button
                            onClick={() => setFilterType("active")}
                            className={`px-4 py-2 rounded transition ${filterType === "active"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-800"
                                }`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setFilterType("unactive")}
                            className={`px-4 py-2 rounded transition ${filterType === "unactive"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-800"
                                }`}
                        >
                            Unactive
                        </button>
                        <button
                            onClick={() => setFilterType("")}
                            className={`px-4 py-2 rounded transition ${filterType === ""
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-800"
                                }`}
                        >
                            All
                        </button>
                    </div>
                    {filterType !== "" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Time Range:
                            </label>
                            <select
                                value={timeRangeDays}
                                onChange={(e) => setTimeRangeDays(Number(e.target.value))}
                                className="w-full md:w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                            >
                                <option value={1}>Last 24 hours</option>
                                <option value={2}>Last 48 hours</option>
                                <option value={7}>Last 7 days</option>
                                <option value={30}>Last 1 month</option>
                                <option value={60}>Last 2 months</option>
                                <option value={90}>Last 3 months</option>
                                <option value={120}>Last 4 months</option>
                                <option value={150}>Last 5 months</option>
                                <option value={180}>Last 6 months</option>
                                <option value={210}>Last 7 months</option>
                                <option value={240}>Last 8 months</option>
                                <option value={270}>Last 9 months</option>
                                <option value={300}>Last 10 months</option>
                                <option value={330}>Last 11 months</option>
                                <option value={365}>Last 12 months</option>
                            </select>
                        </div>
                    )}
                </div>

                {/* All Users Data Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">All Users Data</h2>
                    {/* Display total count */}
                    <p className="mb-4 text-gray-700">
                        Total Users: {filteredUsers.length}
                    </p>
                    {filteredUsers.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {filteredUsers.map((entry, index) => (
                                <div key={index} className="bg-white shadow border border-gray-200 rounded p-4">
                                    {/* Delete Button */}
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => handleDeleteUser(entry.user._id)}
                                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>

                                    {/* User Profile Details */}
                                    <h3 className="text-xl font-bold mb-2">{entry.user.name}</h3>
                                    <div className="text-sm text-gray-600">
                                        <p><strong>ID:</strong> {entry.user._id}</p>
                                        <p><strong>Email:</strong> {entry.user.email_address}</p>
                                        <p><strong>UserName:</strong> {entry.user.userName}</p>
                                        <p><strong>Mobile Number:</strong> {entry.user.mobile_number}</p>
                                        <p><strong>Withdrawable Amount:</strong> {entry.user.withdrawable_amount}</p>
                                        <p><strong>Deposit Amount:</strong> {entry.user.deposit_amount}</p>
                                        <p><strong>Pending Withdrawal Amount:</strong> {entry.user.pending_withdrawal_amount}</p>
                                        <p><strong>Total Withdrawal Amount:</strong> {entry.user.total_withdrawal_amount}</p>
                                        <p><strong>Withdrawal Account Info:</strong> {entry.user.withdrawal_account_information}</p>
                                        <p><strong>Referred By:</strong> {entry.user.refer_by}</p>
                                        <p><strong>Withdrawal Method:</strong> {entry.user.withdrawal_method}</p>
                                        <p><strong>Zip Code:</strong> {entry.user.zip_code}</p>
                                        <p><strong>State:</strong> {entry.user.state}</p>
                                        <p><strong>City:</strong> {entry.user.city}</p>
                                        <p><strong>Address:</strong> {entry.user.address}</p>
                                        <p><strong>Google ID:</strong> {entry.user.google_id}</p>
                                        <p><strong>Is Banned:</strong> {entry.user.isBan ? "Yes" : "No"}</p>
                                        {entry.user.isBan && (
                                            <p>
                                                <strong>Ban Delete On:</strong> {new Date(entry.user.banUserDeleteOn).toLocaleString()}
                                            </p>
                                        )}
                                        <p>
                                            <strong>Last Modified:</strong> {new Date(entry.user.lastModified).toLocaleString('en-GB', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                                hour12: true
                                            })}
                                        </p>
                                    </div>

                                    {/* Record Summaries */}
                                    <div className="mt-4">
                                        <p className="text-sm">
                                            <strong>Date Records:</strong> {entry.dateRecords?.length || 0}
                                        </p>
                                        <p className="text-sm">
                                            <strong>Monthly Records:</strong> {entry.monthlyRecords?.length || 0}
                                        </p>
                                        <p className="text-sm">
                                            <strong>Withdrawals:</strong> {entry.withdrawals?.length || 0}
                                        </p>
                                    </div>

                                    {/* Detailed Records */}
                                    <details className="mt-4">
                                        <summary className="cursor-pointer text-blue-600 font-semibold">
                                            View Detailed Records
                                        </summary>
                                        <div className="mt-2 text-sm space-y-4">
                                            {/* Withdrawals Details */}
                                            <div>
                                                <h4 className="font-semibold mb-1">Withdrawals</h4>
                                                {entry.withdrawals && entry.withdrawals.length > 0 ? (
                                                    entry.withdrawals.map((withdrawal) => (
                                                        <div key={withdrawal._id} className="border p-2 mb-2 rounded">
                                                            <p><strong>Time:</strong> {withdrawal.time}</p>
                                                            <p><strong>Balance:</strong> {withdrawal.balance}</p>
                                                            <p><strong>Type:</strong> {withdrawal.type}</p>
                                                            {withdrawal.withdrawal_status && (
                                                                <p><strong>Status:</strong> {withdrawal.withdrawal_status}</p>
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p>No withdrawals found.</p>
                                                )}
                                            </div>

                                            {/* Monthly Records Details */}
                                            <div>
                                                <h4 className="font-semibold mb-1">Monthly Records</h4>
                                                {entry.monthlyRecords && entry.monthlyRecords.length > 0 ? (
                                                    entry.monthlyRecords.map((record) => (
                                                        <div key={record._id} className="border p-2 mb-2 rounded">
                                                            <p><strong>Month Name:</strong> {record.monthName}</p>
                                                            <p><strong>Created At:</strong> {new Date(record.createdAt).toLocaleString()}</p>
                                                            <div className="ml-4">
                                                                <p className="font-semibold">Earning Sources:</p>
                                                                <p><strong>View Ads Income:</strong> {record.earningSources?.view_ads?.income}</p>
                                                                <p><strong>Click Short Link Income:</strong> {record.earningSources?.click_short_link?.income}</p>
                                                                <p><strong>Referral Income:</strong> {record.earningSources?.referral_income?.income}</p>
                                                                <p><strong>Offer Wall Income:</strong> {record.earningSources?.offerWall?.income}</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p>No monthly records found.</p>
                                                )}
                                            </div>

                                            {/* Date Records Details */}
                                            <div>
                                                <h4 className="font-semibold mb-1">Date Records</h4>
                                                {entry.dateRecords && entry.dateRecords.length > 0 ? (
                                                    entry.dateRecords.map((record) => (
                                                        <div key={record._id} className="border p-2 mb-2 rounded">
                                                            <p><strong>Date:</strong> {record.date}</p>
                                                            <p><strong>Month Name:</strong> {record.monthName}</p>
                                                            <p><strong>Self Earnings:</strong> {record.self_earnings}</p>
                                                            <p><strong>Referral Earnings:</strong> {record.referral_earnings}</p>
                                                            <p><strong>Total Earnings:</strong> {record.Total_earnings}</p>
                                                            <p><strong>Created At:</strong> {new Date(record.createdAt).toLocaleString()}</p>
                                                            <div className="ml-4">
                                                                <p className="font-semibold">Earning Sources:</p>
                                                                <p><strong>View Ads Income:</strong> {record.earningSources?.view_ads?.income}</p>
                                                                <p><strong>View Ads Pending Click:</strong> {record.earningSources?.view_ads?.pendingClick}</p>
                                                                <p><strong>Click Short Link Income:</strong> {record.earningSources?.click_short_link?.income}</p>
                                                                {record.earningSources?.click_short_link?.short_linkDomails_data?.length > 0 && (
                                                                    <div className="ml-4">
                                                                        <p className="font-semibold">Short Link Domains:</p>
                                                                        <ul className="list-disc ml-5">
                                                                            {record.earningSources.click_short_link.short_linkDomails_data.map(
                                                                                (domain, idx) => (
                                                                                    <div key={idx}>
                                                                                        <li><strong>Domain Name:</strong> {domain.domainName}</li>
                                                                                        <li><strong>Click Completed:</strong> {domain.click_completed}</li>
                                                                                    </div>
                                                                                )
                                                                            )}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                                <p><strong>Referral Income:</strong> {record.earningSources?.referral_income?.income}</p>
                                                                <p><strong>Offer Wall Income:</strong> {record.earningSources?.offerWall?.income}</p>
                                                                <p><strong>Offer Wall Completed:</strong> {record.earningSources?.offerWall?.completed}</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p>No date records found.</p>
                                                )}
                                            </div>
                                        </div>
                                    </details>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">No user data available.</p>
                    )}
                </div>
            </div>
            {dataProcess && <ProcessBgBlack />}
        </div>
    );
};

export default Users;
