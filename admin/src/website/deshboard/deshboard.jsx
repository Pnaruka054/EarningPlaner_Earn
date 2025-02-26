import React, { useState } from "react";
import SideMenu from "../components/sideMenu/sideMenu";
import TextEditor from "../components/textEditor/textEditor";

const Dashboard = () => {
    const [referralRate, setReferralRate] = useState(10); // Default referral rate
    const [announcements, setAnnouncements] = useState([
        {
            id: 1,
            time: "8/10/24, 11:53 AM",
            title: "Why Choose Us?",
            details: [
                "1. Receive a $1 bonus for signing up.",
                "2. Enjoy the highest CPM rates globally.",
                "3. No intrusive pop-up ads.",
                "4. Ability to shorten links for 18+, Movies, Faucets, etc.",
                "5. Fast payments within 2 to 3 days."
            ]
        }
    ]);

    const [newAnnouncement, setNewAnnouncement] = useState({
        title: "",
        details: "",
    });

    const [editingId, setEditingId] = useState(null);
    const [editedAnnouncement, setEditedAnnouncement] = useState({
        title: "",
        details: "",
    });

    // Function to add new announcement
    const addAnnouncement = () => {
        if (newAnnouncement.title && newAnnouncement.details) {
            setAnnouncements([
                {
                    id: Date.now(),
                    time: new Date().toLocaleString(),
                    title: newAnnouncement.title,
                    details: newAnnouncement.details.split("\n"),
                },
                ...announcements,
            ]);
            setNewAnnouncement({ title: "", details: "" });
        }
    };

    // Function to delete an announcement
    const deleteAnnouncement = (id) => {
        setAnnouncements(announcements.filter((a) => a.id !== id));
    };

    // Function to start editing an announcement
    const startEditing = (announcement) => {
        setEditingId(announcement.id);
        setEditedAnnouncement({
            title: announcement.title,
            details: announcement.details.join("\n"),
        });
    };

    // Function to save edited announcement
    const saveEdit = () => {
        setAnnouncements(
            announcements.map((item) =>
                item.id === editingId
                    ? { ...item, title: editedAnnouncement.title, details: editedAnnouncement.details.split("\n") }
                    : item
            )
        );
        setEditingId(null);
    };

    return (
        <div>
            <SideMenu sideMenu_show={true} />
            <div className="mt-[150px] md:ml-[256px] p-6 space-y-8">
                {/* Referral Rate Section */}
                <div className="p-6 border border-gray-300 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Referral Rate</h2>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                        <label className="text-gray-700 mb-2 sm:mb-0">Referral Rate (%)</label>
                        <input
                            type="number"
                            className="border p-2 rounded w-full sm:w-1/3"
                            value={referralRate}
                            onChange={(e) => setReferralRate(e.target.value)}
                        />
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 sm:mt-0 sm:ml-4"
                            onClick={() => alert(`Referral Rate has been updated to: ${referralRate}%`)}
                        >
                            Update
                        </button>
                    </div>
                </div>

                {/* Announcement Section */}
                <div className="p-6 border border-gray-300 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Announcements</h2>

                    {/* Add Announcement Form */}
                    <div className="border p-4 rounded-md mb-6">
                        <h3 className="font-semibold mb-2">Post New Announcement</h3>
                        <input
                            type="text"
                            placeholder="Title"
                            className="border p-2 rounded w-full mb-2"
                            value={newAnnouncement.title}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                        />
                        <textarea
                            placeholder="Details (use new line for multiple points)"
                            className="border p-2 rounded w-full mb-2"
                            rows="4"
                            value={newAnnouncement.details}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, details: e.target.value })}
                        />
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={addAnnouncement}
                        >
                            Add Announcement
                        </button>
                    </div>

                    {/* Announcements List */}
                    <div className="space-y-4 max-h-[600px] overflow-auto hidden-scrollbar">
                        {announcements.map((item) => (
                            <div key={item.id} className="p-4 space-y-2 border-b pb-4">
                                {editingId === item.id ? (
                                    <>
                                        <input
                                            type="text"
                                            className="border p-2 rounded w-full mb-2"
                                            value={editedAnnouncement.title}
                                            onChange={(e) => setEditedAnnouncement({ ...editedAnnouncement, title: e.target.value })}
                                        />
                                        <textarea
                                            className="border p-2 rounded w-full mb-2"
                                            rows="4"
                                            value={editedAnnouncement.details}
                                            onChange={(e) => setEditedAnnouncement({ ...editedAnnouncement, details: e.target.value })}
                                        />
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <button
                                                className="bg-green-500 text-white px-4 py-2 rounded"
                                                onClick={saveEdit}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="bg-gray-500 text-white px-4 py-2 rounded"
                                                onClick={() => setEditingId(null)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm text-gray-500 float-right">{item.time}</p>
                                        <p className="font-semibold">{item.title}</p>
                                        {item.details.map((detail, index) => (
                                            <p key={index}>{detail}</p>
                                        ))}
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <button
                                                className="bg-yellow-500 text-white px-4 py-2 rounded"
                                                onClick={() => startEditing(item)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-4 py-2 rounded"
                                                onClick={() => deleteAnnouncement(item.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
