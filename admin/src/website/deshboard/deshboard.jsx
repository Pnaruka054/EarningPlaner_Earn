import React, { useEffect, useState } from "react";
import SideMenu from "../components/sideMenu/sideMenu";
import axios from 'axios'

const Dashboard = () => {
    const [referralRate_state, setReferralRate_state] = useState(10); // Default referral rate
    const [announcements_state, setAnnouncements_state] = useState([
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

    useEffect(() => {
        let fatch = async () => {
            await axios.get(`${import.meta.env.VITE_SERVER_URL}/admin/adminReferralGet`)
        }
        // fatch()
    }, []);

    const [newAnnouncement_state, setNewAnnouncement_state] = useState({
        title: "",
        details: "",
    });

    const [editingId_state, setEditingId_state] = useState(null);
    const [editedAnnouncement_state, setEditedAnnouncement_state] = useState({
        title: "",
        details: "",
    });

    // Function to add new announcement
    const addAnnouncement = () => {
        if (newAnnouncement_state.title && newAnnouncement_state.details) {
            setAnnouncements_state([
                {
                    id: Date.now(),
                    time: new Date().toLocaleString(),
                    title: newAnnouncement_state.title,
                    details: newAnnouncement_state.details.split("\n"),
                },
                ...announcements_state,
            ]);
            setNewAnnouncement_state({ title: "", details: "" });
        }
    };

    // Function to delete an announcement
    const deleteAnnouncement = (id) => {
        setAnnouncements_state(announcements_state.filter((a) => a.id !== id));
    };

    // Function to start editing an announcement
    const startEditing = (announcement) => {
        setEditingId_state(announcement.id);
        setEditedAnnouncement_state({
            title: announcement.title,
            details: announcement.details.join("\n"),
        });
    };

    // Function to save edited announcement
    const saveEdit = () => {
        setAnnouncements_state(
            announcements_state.map((item) =>
                item.id === editingId_state
                    ? { ...item, title: editedAnnouncement_state.title, details: editedAnnouncement_state.details.split("\n") }
                    : item
            )
        );
        setEditingId_state(null);
    };



    const [faqs_state, setFaqs_state] = useState([
        {
            id: 1,
            question: "How to earn money?",
            answer: "You can earn by sharing short links and getting views."
        }
    ]);

    const [newFaq_state, setNewFaq_state] = useState({ question: "", answer: "" });
    const [editingFaqId_state, setEditingFaqId_state] = useState(null);
    const [editedFaq_state, setEditedFaq_state] = useState({ question: "", answer: "" });

    // Add FAQ
    const addFaq = () => {
        if (newFaq_state.question && newFaq_state.answer) {
            setFaqs_state([
                { id: Date.now(), question: newFaq_state.question, answer: newFaq_state.answer },
                ...faqs_state,
            ]);
            setNewFaq_state({ question: "", answer: "" });
        }
    };

    // Delete FAQ
    const deleteFaq = (id) => {
        setFaqs_state(faqs_state.filter((faq) => faq.id !== id));
    };

    // Start Editing FAQ
    const startEditingFaq = (faq) => {
        setEditingFaqId_state(faq.id);
        setEditedFaq_state({ question: faq.question, answer: faq.answer });
    };

    // Save Edited FAQ
    const saveFaqEdit = () => {
        setFaqs_state(
            faqs_state.map((faq) =>
                faq.id === editingFaqId_state
                    ? { ...faq, question: editedFaq_state.question, answer: editedFaq_state.answer }
                    : faq
            )
        );
        setEditingFaqId_state(null);
    };






    const [withdrawalMethods, setWithdrawalMethods] = useState([
        {
            _id: { $oid: "67a88cbad1fcda6a9f801426" },
            withdrawal_method: "PayPal",
            minimum_amount: "500",
            description: "For PayPal, add your email."
        }
    ]);

    const [newWithdrawalMethod, setNewWithdrawalMethod] = useState({
        withdrawal_method: "",
        minimum_amount: "",
        description: "",
    });

    const [editingId, setEditingId] = useState(null);
    const [editedWithdrawalMethod, setEditedWithdrawalMethod] = useState({
        withdrawal_method: "",
        minimum_amount: "",
        description: "",
    });

    const addWithdrawalMethod = () => {
        if (newWithdrawalMethod.withdrawal_method && newWithdrawalMethod.minimum_amount && newWithdrawalMethod.description) {
            setWithdrawalMethods([
                { _id: { $oid: Date.now().toString() }, ...newWithdrawalMethod },
                ...withdrawalMethods,
            ]);
            setNewWithdrawalMethod({ withdrawal_method: "", minimum_amount: "", description: "" });
        }
    };

    const deleteWithdrawalMethod = (id) => {
        setWithdrawalMethods(withdrawalMethods.filter((w) => w._id.$oid !== id));
    };

    const startEditing_widthdrawal = (method) => {
        setEditingId(method._id.$oid);
        setEditedWithdrawalMethod({ ...method });
    };

    const saveEdit_widthdrawal = () => {
        setWithdrawalMethods(
            withdrawalMethods.map((item) =>
                item._id.$oid === editingId
                    ? { ...item, ...editedWithdrawalMethod }
                    : item
            )
        );
        setEditingId(null);
    };



    return (
        <div>
            <SideMenu sideMenu_show={true} />
            <div className="mt-[75px] md:ml-[256px] p-6 space-y-8">
                {/* Referral Rate Section */}
                <div className="p-6 border border-gray-300 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Referral Rate</h2>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                        <label className="text-gray-700 mb-2 sm:mb-0">Referral Rate (%)</label>
                        <input
                            type="number"
                            className="border p-2 rounded w-full sm:w-1/3"
                            value={referralRate_state}
                            onChange={(e) => setReferralRate_state(e.target.value)}
                        />
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 sm:mt-0 sm:ml-4"
                            onClick={() => alert(`Referral Rate has been updated to: ${referralRate_state}%`)}
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
                            value={newAnnouncement_state.title}
                            onChange={(e) => setNewAnnouncement_state({ ...newAnnouncement_state, title: e.target.value })}
                        />

                        <textarea
                            placeholder="Details (use new line for multiple points)"
                            className="border p-2 rounded w-full mb-2"
                            rows="4"
                            value={newAnnouncement_state.details}
                            onChange={(e) => setNewAnnouncement_state({ ...newAnnouncement_state, details: e.target.value })}
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
                        {announcements_state.map((item) => (
                            <div key={item.id} className="p-4 space-y-2 border-b pb-4">
                                {editingId_state === item.id ? (
                                    <>
                                        <input
                                            type="text"
                                            className="border p-2 rounded w-full mb-2"
                                            value={editedAnnouncement_state.title}
                                            onChange={(e) => setEditedAnnouncement_state({ ...editedAnnouncement_state, title: e.target.value })}
                                        />
                                        <textarea
                                            className="border p-2 rounded w-full mb-2"
                                            rows="4"
                                            value={editedAnnouncement_state.details}
                                            onChange={(e) => setEditedAnnouncement_state({ ...editedAnnouncement_state, details: e.target.value })}
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
                                                onClick={() => setEditingId_state(null)}
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

                {/* FAQ Section */}
                <div className="p-6 border border-gray-300 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">FAQs</h2>

                    {/* Add FAQ Form */}
                    <div className="border p-4 rounded-md mb-6">
                        <h3 className="font-semibold mb-2">Add New FAQ</h3>
                        <input
                            type="text"
                            placeholder="Question"
                            className="border p-2 rounded w-full mb-2"
                            value={newFaq_state.question}
                            onChange={(e) => setNewFaq_state({ ...newFaq_state, question: e.target.value })}
                        />
                        <textarea
                            placeholder="Answer"
                            className="border p-2 rounded w-full mb-2"
                            rows="4"
                            value={newFaq_state.answer}
                            onChange={(e) => setNewFaq_state({ ...newFaq_state, answer: e.target.value })}
                        />
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={addFaq}
                        >
                            Add FAQ
                        </button>
                    </div>

                    {/* FAQs List */}
                    <div className="space-y-4 max-h-[400px] overflow-auto hidden-scrollbar">
                        {faqs_state.map((faq) => (
                            <div key={faq.id} className="p-4 space-y-2 border-b pb-4">
                                {editingFaqId_state === faq.id ? (
                                    <>
                                        <input
                                            type="text"
                                            className="border p-2 rounded w-full mb-2"
                                            value={editedFaq_state.question}
                                            onChange={(e) => setEditedFaq_state({ ...editedFaq_state, question: e.target.value })}
                                        />
                                        <textarea
                                            className="border p-2 rounded w-full mb-2"
                                            rows="4"
                                            value={editedFaq_state.answer}
                                            onChange={(e) => setEditedFaq_state({ ...editedFaq_state, answer: e.target.value })}
                                        />
                                        <div className="flex gap-4">
                                            <button
                                                className="bg-green-500 text-white px-4 py-2 rounded"
                                                onClick={saveFaqEdit}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="bg-gray-500 text-white px-4 py-2 rounded"
                                                onClick={() => setEditingFaqId_state(null)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-semibold">{faq.question}</p>
                                        <p>{faq.answer}</p>
                                        <div className="flex gap-4">
                                            <button
                                                className="bg-yellow-500 text-white px-4 py-2 rounded"
                                                onClick={() => startEditingFaq(faq)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-4 py-2 rounded"
                                                onClick={() => deleteFaq(faq.id)}
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

                {/* Withdrawal Methods Section */}
                <div className="p-6 border border-gray-300 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Withdrawal Methods</h2>

                    {/* Add Withdrawal Method Form */}
                    <div className="border p-4 rounded-md mb-6">
                        <h3 className="font-semibold mb-2">Add New Withdrawal Method</h3>
                        <input
                            type="text"
                            placeholder="Method Name"
                            className="border p-2 rounded w-full mb-2"
                            value={newWithdrawalMethod.withdrawal_method}
                            onChange={(e) => setNewWithdrawalMethod({ ...newWithdrawalMethod, withdrawal_method: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Minimum Amount"
                            className="border p-2 rounded w-full mb-2"
                            value={newWithdrawalMethod.minimum_amount}
                            onChange={(e) => setNewWithdrawalMethod({ ...newWithdrawalMethod, minimum_amount: e.target.value })}
                        />
                        <textarea
                            placeholder="Description"
                            className="border p-2 rounded w-full mb-2"
                            rows="3"
                            value={newWithdrawalMethod.description}
                            onChange={(e) => setNewWithdrawalMethod({ ...newWithdrawalMethod, description: e.target.value })}
                        />
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={addWithdrawalMethod}
                        >
                            Add Method
                        </button>
                    </div>

                    {/* Withdrawal Methods List */}
                    <div className="space-y-4 max-h-[600px] overflow-auto hidden-scrollbar">
                        {withdrawalMethods.map((item) => (
                            <div key={item._id.$oid} className="p-4 space-y-2 border-b pb-4">
                                {editingId === item._id.$oid ? (
                                    <>
                                        <input
                                            type="text"
                                            className="border p-2 rounded w-full mb-2"
                                            value={editedWithdrawalMethod.withdrawal_method}
                                            onChange={(e) => setEditedWithdrawalMethod({ ...editedWithdrawalMethod, withdrawal_method: e.target.value })}
                                        />
                                        <input
                                            type="number"
                                            className="border p-2 rounded w-full mb-2"
                                            value={editedWithdrawalMethod.minimum_amount}
                                            onChange={(e) => setEditedWithdrawalMethod({ ...editedWithdrawalMethod, minimum_amount: e.target.value })}
                                        />
                                        <textarea
                                            className="border p-2 rounded w-full mb-2"
                                            rows="3"
                                            value={editedWithdrawalMethod.description}
                                            onChange={(e) => setEditedWithdrawalMethod({ ...editedWithdrawalMethod, description: e.target.value })}
                                        />
                                        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={saveEdit_widthdrawal}>Save</button>
                                        <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setEditingId(null)}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-semibold">{item.withdrawal_method}</p>
                                        <p>Minimum Amount: {item.minimum_amount}</p>
                                        <p>{item.description}</p>
                                        <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={() => startEditing_widthdrawal(item)}>Edit</button>
                                        <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => deleteWithdrawalMethod(item._id.$oid)}>Delete</button>
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
