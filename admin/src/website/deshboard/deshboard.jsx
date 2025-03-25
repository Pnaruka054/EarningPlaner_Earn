import React, { useEffect, useState } from "react";
import SideMenu from "../components/sideMenu/sideMenu";
import axios from "axios";
import ProcessBgBlack from "../components/processBgBlack/processBgBlack";
import showNotification from "../components/showNotification";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    let [data_process_state, setData_process_state] = useState(false);
    const navigation = useNavigate();

    // Dashboard data states
    const [referralRate_state, setReferralRate_state] = useState(10);
    const [referralMessage_state, setReferralMessage_state] = useState("");

    const [faqs_state, setFaqs_state] = useState([
        {
            faqQuestioin: "",
            faqAnswer: ""
        }
    ]);
    const [newFaq_state, setNewFaq_state] = useState({
        faqQuestioin: "",
        faqAnswer: ""
    });
    const [editingId_faq_state, setEditingId_faq_state] = useState(null);
    const [edited_faq_state, setEdited_faq_state] = useState({
        faqQuestioin: "",
        faqAnswer: ""
    });
    const [withdrawalMethods_state, setWithdrawalMethods_state] = useState([
        {
            withdrawalMethod_name: "",
            withdrawalMethod_minimumAmount: "",
            withdrawalMethod_details: ""
        }
    ]);
    const [newWithdrawalMethod_state, setNewWithdrawalMethod_state] = useState({
        withdrawalMethod_name: "",
        withdrawalMethod_minimumAmount: "",
        withdrawalMethod_details: ""
    });
    const [editingId_withdrawalMethod_state, setEditingId_withdrawalMethod_state] = useState(null);
    const [edited_withdrawalMethod_state, setEdited_withdrawalMethod_state] = useState({
        withdrawalMethod_name: "",
        withdrawalMethod_minimumAmount: "",
        withdrawalMethod_details: ""
    });
    const [giftCode_state, setGiftCode_state] = useState({
        viewAds_required: "",
        giftCode_claim_limit: "",
        giftCode_claimed: "", // preview only
        shortlink_required: "",
        giftCode_amount: "",
        offerWall_required: "",
        giftCode_page_Message: ""
    })

    const handleChange = (field, value) => {
        setGiftCode_state((prev) => ({ ...prev, [field]: value }));
    };

    const handleUpdateSettings = async (obj, isPageMessage) => {
        Swal.fire({
            title: "Are you sure?",
            text: "update Gift code data?",
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

                    const response = await axios.post(
                        `${import.meta.env.VITE_SERVER_URL}/admin/postGift_code_data`,
                        { ...obj, isPageMessage },
                        { withCredentials: true }
                    );

                    if (response?.data?.msg) {
                        setGiftCode_state((prevState) => ({ ...prevState, ...response.data.msg }));
                        showNotification(false, "Gift Code Updated successfully!");
                    }
                } catch (error) {
                    console.error("Error updating referral data:", error);
                    if (error?.response?.data?.error_msg) {
                        showNotification(true, error.response.data.error_msg);
                    } else if (error?.response?.data.adminJWT_error_msg) {
                        showNotification(true, error.response.data.adminJWT_error_msg);
                        navigation("/");
                    } else {
                        showNotification(true, "Something went wrong, please try again.");
                    }
                } finally {
                    setData_process_state(false);
                }
            }
        });
    }

    // Global data fetch on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setData_process_state(true);

                const response = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/admin/getDashboardData`,
                    { withCredentials: true }
                );

                if (response?.data?.msg) {
                    const { referralData, announcementData, faqData, withdrawalMethodData, other_data_giftCode, other_data_homepageArray } = response.data.msg;
                    setGiftCode_state(other_data_giftCode)
                    setReferralMessage_state(referralData?.referral_page_text || "");
                    setReferralRate_state(parseFloat(referralData?.referral_rate || 0) * 100);
                    setAnnouncements_state(announcementData.reverse() || []);
                    setFaqs_state(faqData.reverse() || []);
                    setWithdrawalMethods_state(withdrawalMethodData.reverse() || []);
                    setHomepageSections_state(other_data_homepageArray.reverse() || [])
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                if (error.response.data.error_msg) {
                    showNotification(true, error.response.data.error_msg);
                } else if (error.response.data.adminJWT_error_msg) {
                    showNotification(true, error.response.data.adminJWT_error_msg);
                    navigation("/");
                } else {
                    showNotification(true, "Something went wrong, please try again.");
                }
            } finally {
                setData_process_state(false);
            }
        };
        fetchData();
    }, [navigation]);

    // Global auto-resize effect: adjust all textareas with the class "auto-resize"
    useEffect(() => {
        const textareas = document.querySelectorAll(".auto-resize");
        textareas.forEach((textarea) => {
            textarea.style.height = "auto";
            textarea.style.height = textarea.scrollHeight + "px";
        });
    });

    // Referral update handling
    const referral_database_patch = async (data, btnName) => {
        try {
            setData_process_state(true);

            const response = await axios.patch(
                `${import.meta.env.VITE_SERVER_URL}/admin/update_referral_data`,
                { data, btnName },
                { withCredentials: true }
            );

            if (response?.data?.msg) {
                const { referralRate, referralPageText } = response.data.msg;
                setReferralMessage_state(referralPageText || "");
                setReferralRate_state(parseFloat(referralRate || 0) * 100);
                showNotification(false, "updated success!");
            }
        } catch (error) {
            console.error("Error updating referral data:", error);
            if (error.response.data.error_msg) {
                showNotification(true, error.response.data.error_msg);
            } else if (error.response.data.adminJWT_error_msg) {
                showNotification(true, error.response.data.adminJWT_error_msg);
                navigation("/");
            } else {
                showNotification(true, "Something went wrong, please try again.");
            }
        } finally {
            setData_process_state(false);
        }
    };

    const handle_referral_update = (data, btnName) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Update this referral data?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, update it!",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                referral_database_patch(data, btnName);
            }
        });
    };


    const [announcements_state, setAnnouncements_state] = useState([
        {
            announcementTitle: "",
            announcementMessage: "",
            announcementTime: ""
        }
    ]);
    const [newAnnouncement_state, setNewAnnouncement_state] = useState({
        announcementTitle: "",
        announcementMessage: ""
    });
    const [editingId_announcement_state, setEditingId_announcement_state] = useState(null);
    const [edited_announcement_state, setEdited_announcement_state] = useState({
        announcementTitle: "",
        announcementMessage: ""
    });

    // Announcements handling
    const announcement_database_post = async (newAnnouncement_data) => {
        try {
            setData_process_state(true);

            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/admin/post_newAnnouncement_data`,
                { newAnnouncement_data },
                { withCredentials: true }
            );
            if (response?.data?.msg) {
                const { announcementTime, announcementMessage, announcementTitle, _id } = response.data.msg;
                setAnnouncements_state([
                    {
                        _id,
                        announcementTime,
                        announcementTitle,
                        announcementMessage,
                    },
                    ...announcements_state,
                ]);
                showNotification(false, "updated success!");
                setNewAnnouncement_state({
                    announcementTitle: "",
                    announcementMessage: "",
                });
            }
        } catch (error) {
            console.error("Error posting announcement:", error);
            if (error.response.data.error_msg) {
                showNotification(true, error.response.data.error_msg);
            } else if (error.response.data.adminJWT_error_msg) {
                showNotification(true, error.response.data.adminJWT_error_msg);
                navigation("/");
            } else {
                showNotification(true, "Something went wrong, please try again.");
            }
        } finally {
            setData_process_state(false);
        }
    };

    const addAnnouncement = () => {
        if (newAnnouncement_state.announcementTitle && newAnnouncement_state.announcementMessage) {
            Swal.fire({
                title: "Are you sure?",
                text: "Add new announcement?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, update it!",
                cancelButtonText: "Cancel"
            }).then((result) => {
                if (result.isConfirmed) {
                    announcement_database_post(newAnnouncement_state);
                }
            });
        }
    };

    const announcement_database_delete = async (id) => {
        try {
            setData_process_state(true);

            const response = await axios.delete(
                `${import.meta.env.VITE_SERVER_URL}/admin/delete_announcement_data?id=${id}`,
                { withCredentials: true }
            );

            if (response?.data?.msg) {
                showNotification(false, "Deleted successfully!");
                setAnnouncements_state(announcements_state.filter((a) => a._id !== id));
            }
        } catch (error) {
            console.error("Error deleting announcement:", error);
            if (error.response.data.error_msg) {
                showNotification(true, error.response.data.error_msg);
            } else if (error.response.data.adminJWT_error_msg) {
                showNotification(true, error.response.data.adminJWT_error_msg);
                navigation("/");
            } else {
                showNotification(true, "Something went wrong, please try again.");
            }
        } finally {
            setData_process_state(false);
        }
    };

    const deleteAnnouncement = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Delete This announcement?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, update it!",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                announcement_database_delete(id);
            }
        });
    };

    const startEditing_Announcement = (announcement) => {
        setEditingId_announcement_state(announcement._id);
        setEdited_announcement_state({
            _id: announcement._id,
            announcementTitle: announcement.announcementTitle,
            announcementMessage: announcement.announcementMessage,
        });
    };

    const announcement_database_patch = async () => {
        try {
            setData_process_state(true);
            const response = await axios.patch(
                `${import.meta.env.VITE_SERVER_URL}/admin/patch_announcement_data`,
                {
                    _id: edited_announcement_state._id,
                    announcementTitle: edited_announcement_state.announcementTitle,
                    announcementMessage: edited_announcement_state.announcementMessage,
                },
                { withCredentials: true }
            );

            if (response?.data?.msg) {
                const { announcementTime, announcementMessage, announcementTitle, _id } = response.data.msg;

                setAnnouncements_state((prevState) =>
                    prevState.map((item) =>
                        item._id === _id
                            ? { _id, announcementTime, announcementTitle, announcementMessage }
                            : item
                    )
                );
                setEditingId_announcement_state(null);
                showNotification(false, "Updated successfully!");
            }
        } catch (error) {
            console.error("Error updating announcement:", error);
            if (error.response.data.error_msg) {
                showNotification(true, error.response.data.error_msg);
            } else if (error.response.data.adminJWT_error_msg) {
                showNotification(true, error.response.data.adminJWT_error_msg);
                navigation("/");
            } else {
                showNotification(true, "Something went wrong, please try again.");
            }
        } finally {
            setData_process_state(false);
        }
    };

    const saveEdit_Announcement = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Update This announcement?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, update it!",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                announcement_database_patch();
            }
        });
    };

    // FAQ handling
    const faq_database_post = async (newFaq_data) => {
        try {
            setData_process_state(true);

            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/admin/post_newFaq_data`,
                { newFaq_data },
                { withCredentials: true }
            );

            if (response?.data?.msg) {
                const { faqQuestioin, faqAnswer, _id } = response.data.msg;

                setFaqs_state((prevFaqs) => [
                    { _id, faqQuestioin, faqAnswer },
                    ...prevFaqs,
                ]);
                showNotification(false, "FAQ added successfully!");
                setNewFaq_state({
                    faqQuestioin: "",
                    faqAnswer: ""
                });
            } else {
                showNotification(true, "Failed to add FAQ. Please try again.");
            }
        } catch (error) {
            console.error("Error adding FAQ:", error);
            if (error.response.data.error_msg) {
                showNotification(true, error.response.data.error_msg);
            } else if (error.response.data.adminJWT_error_msg) {
                showNotification(true, error.response.data.adminJWT_error_msg);
                navigation("/");
            } else {
                showNotification(true, "Something went wrong, please try again.");
            }
        } finally {
            setData_process_state(false);
        }
    };

    const addFaq = () => {
        if (newFaq_state.faqQuestioin && newFaq_state.faqAnswer) {
            Swal.fire({
                title: "Are you sure?",
                text: "Add new FAQ?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, update it!",
                cancelButtonText: "Cancel"
            }).then((result) => {
                if (result.isConfirmed) {
                    faq_database_post(newFaq_state);
                }
            });
        }
    };

    const faq_database_delete = async (id) => {
        try {
            setData_process_state(true);

            const response = await axios.delete(
                `${import.meta.env.VITE_SERVER_URL}/admin/delete_faq_data?id=${id}`,
                { withCredentials: true }
            );

            if (response?.data?.msg) {
                setFaqs_state(faqs_state.filter((faq) => faq._id !== id));
                showNotification(false, "FAQ deleted successfully!");
            }
        } catch (error) {
            console.error("Error deleting FAQ:", error);
            if (error.response.data.error_msg) {
                showNotification(true, error.response.data.error_msg);
            } else if (error.response.data.adminJWT_error_msg) {
                showNotification(true, error.response.data.adminJWT_error_msg);
                navigation("/");
            } else {
                showNotification(true, "Something went wrong, please try again.");
            }
        } finally {
            setData_process_state(false);
        }
    };

    const deleteFaq = (id) => {
        if (id) {
            Swal.fire({
                title: "Are you sure?",
                text: "Delete This FAQ?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, update it!",
                cancelButtonText: "Cancel"
            }).then((result) => {
                if (result.isConfirmed) {
                    faq_database_delete(id);
                }
            });
        }
    };

    const startEditing_Faq = (faq) => {
        setEditingId_faq_state(faq._id);
        setEdited_faq_state({ faqQuestioin: faq.faqQuestioin, faqAnswer: faq.faqAnswer });
    };

    const faq_database_patch = async () => {
        try {
            setData_process_state(true);

            const response = await axios.patch(
                `${import.meta.env.VITE_SERVER_URL}/admin/patch_faq_data`,
                {
                    _id: editingId_faq_state,
                    faqQuestioin: edited_faq_state.faqQuestioin,
                    faqAnswer: edited_faq_state.faqAnswer
                },
                { withCredentials: true }
            );

            if (response?.data?.msg) {
                setFaqs_state(
                    faqs_state.map((faq) =>
                        faq._id === editingId_faq_state
                            ? { ...faq, faqQuestioin: edited_faq_state.faqQuestioin, faqAnswer: edited_faq_state.faqAnswer }
                            : faq
                    )
                );

                showNotification(false, "FAQ updated successfully!");
                setEditingId_faq_state(null);
            }
        } catch (error) {
            console.error("Error updating FAQ:", error);
            if (error.response.data.error_msg) {
                showNotification(true, error.response.data.error_msg);
            } else if (error.response.data.adminJWT_error_msg) {
                showNotification(true, error.response.data.adminJWT_error_msg);
                navigation("/");
            } else {
                showNotification(true, "Something went wrong, please try again.");
            }
        } finally {
            setData_process_state(false);
        }
    };

    const saveEdit_Faq = () => {
        if (editingId_faq_state && edited_faq_state.faqQuestioin && edited_faq_state.faqAnswer) {
            Swal.fire({
                title: "Are you sure?",
                text: "Update This FAQ?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, update it!",
                cancelButtonText: "Cancel"
            }).then((result) => {
                if (result.isConfirmed) {
                    faq_database_patch();
                }
            });
        }
    };

    // Withdrawal Methods handling
    const withdrawalMethod_faq_database_post = async () => {
        try {
            setData_process_state(true);

            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/admin/post_withdrawalMethod_data`,
                { ...newWithdrawalMethod_state },
                { withCredentials: true }
            );

            if (response?.data?.msg) {
                setWithdrawalMethods_state([
                    { ...response.data.msg },
                    ...withdrawalMethods_state,
                ]);
                setNewWithdrawalMethod_state({
                    withdrawalMethod_name: "",
                    withdrawalMethod_minimumAmount: "",
                    withdrawalMethod_details: ""
                });
                showNotification(false, "Withdrawal method added successfully!");
            }
        } catch (error) {
            console.error("Error adding withdrawal method:", error);
            if (error.response.data.error_msg) {
                showNotification(true, error.response.data.error_msg);
            } else if (error.response.data.adminJWT_error_msg) {
                showNotification(true, error.response.data.adminJWT_error_msg);
                navigation("/");
            } else {
                showNotification(true, "Something went wrong, please try again.");
            }
        } finally {
            setData_process_state(false);
        }
    };

    const addWithdrawalMethod = () => {
        if (
            newWithdrawalMethod_state.withdrawalMethod_name &&
            newWithdrawalMethod_state.withdrawalMethod_minimumAmount &&
            newWithdrawalMethod_state.withdrawalMethod_details
        ) {
            Swal.fire({
                title: "Are you sure?",
                text: "Add new withdrawal Method?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, update it!",
                cancelButtonText: "Cancel"
            }).then((result) => {
                if (result.isConfirmed) {
                    withdrawalMethod_faq_database_post();
                }
            });
        }
    };

    const withdrawalMethod_database_delete = async (id) => {
        try {
            setData_process_state(true);

            const response = await axios.delete(
                `${import.meta.env.VITE_SERVER_URL}/admin/delete_withdrawalMethod_data?id=${id}`,
                { withCredentials: true }
            );

            if (response?.data?.msg) {
                setWithdrawalMethods_state(withdrawalMethods_state.filter((w) => w._id !== id));
                showNotification(false, "Withdrawal method deleted successfully!");
            }
        } catch (error) {
            console.error("Error deleting withdrawal method:", error);
            if (error.response.data.error_msg) {
                showNotification(true, error.response.data.error_msg);
            } else if (error.response.data.adminJWT_error_msg) {
                showNotification(true, error.response.data.adminJWT_error_msg);
                navigation("/");
            } else {
                showNotification(true, "Something went wrong, please try again.");
            }
        } finally {
            setData_process_state(false);
        }
    };

    const deleteWithdrawalMethod = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Delete This withdrawal Method?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, update it!",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                withdrawalMethod_database_delete(id);
            }
        });
    };

    const startEditing_widthdrawal = (method) => {
        setEditingId_withdrawalMethod_state(method._id);
        setEdited_withdrawalMethod_state({ ...method });
    };

    const withdrawalMethod_faq_database_patch = async () => {
        try {
            setData_process_state(true);

            const response = await axios.patch(
                `${import.meta.env.VITE_SERVER_URL}/admin/patch_withdrawalMethod_data`,
                {
                    _id: editingId_withdrawalMethod_state,
                    ...edited_withdrawalMethod_state
                },
                { withCredentials: true }
            );

            if (response?.data?.msg) {
                setWithdrawalMethods_state(
                    withdrawalMethods_state.map((item) =>
                        item._id === editingId_withdrawalMethod_state
                            ? { ...item, ...edited_withdrawalMethod_state }
                            : item
                    )
                );

                showNotification(false, "Withdrawal method updated successfully!");
            }
        } catch (error) {
            console.error("Error updating withdrawal method:", error);
            if (error.response.data.error_msg) {
                showNotification(true, error.response.data.error_msg);
            } else if (error.response.data.adminJWT_error_msg) {
                showNotification(true, error.response.data.adminJWT_error_msg);
                navigation("/");
            } else {
                showNotification(true, "Something went wrong, please try again.");
            }
        } finally {
            setEditingId_withdrawalMethod_state(null);
            setData_process_state(false);
        }
    };

    const saveEdit_widthdrawal = () => {
        if (
            editingId_withdrawalMethod_state &&
            edited_withdrawalMethod_state.withdrawalMethod_name &&
            edited_withdrawalMethod_state.withdrawalMethod_minimumAmount &&
            edited_withdrawalMethod_state.withdrawalMethod_details
        ) {
            Swal.fire({
                title: "Are you sure?",
                text: "Update This withdrawal Method?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, update it!",
                cancelButtonText: "Cancel"
            }).then((result) => {
                if (result.isConfirmed) {
                    withdrawalMethod_faq_database_patch();
                }
            });
        }
    };


    // Homepage handling
    const [homepageSections_state, setHomepageSections_state] = useState([
        {
            homepageSection_title: "",
            homepageSection_message: ""
        }
    ]);
    const [newHomepageSection_state, setNewHomepageSection_state] = useState({
        homepageSection_title: "",
        homepageSection_message: ""
    });
    const [editingId_homepageSection_state, setEditingId_homepageSection_state] = useState(null);
    const [edited_homepageSection_state, setEdited_homepageSection_state] = useState({
        homepageSection_title: "",
        homepageSection_message: ""
    });

    const homepage_database_post = async (newHomepage_section_data) => {
        try {
            setData_process_state(true);

            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/admin/post_newHomepage_data`,
                { newHomepage_section_data },
                { withCredentials: true }
            );
            if (response?.data?.msg) {
                const { homepageSection_title, homepageSection_message, _id } = response.data.msg;
                setHomepageSections_state([
                    {
                        _id,
                        homepageSection_title,
                        homepageSection_message,
                    },
                    ...homepageSections_state,
                ]);
                showNotification(false, "updated success!");
                setNewHomepageSection_state({
                    homepageSection_title: "",
                    homepageSection_message: "",
                });
            }
        } catch (error) {
            console.error("Error posting new homepage section:", error);
            if (error.response.data.error_msg) {
                showNotification(true, error.response.data.error_msg);
            } else if (error.response.data.adminJWT_error_msg) {
                showNotification(true, error.response.data.adminJWT_error_msg);
                navigation("/");
            } else {
                showNotification(true, "Something went wrong, please try again.");
            }
        } finally {
            setData_process_state(false);
        }
    };

    const addHomepageSection = () => {
        if (newHomepageSection_state.homepageSection_title || newHomepageSection_state.homepageSection_message) {
            Swal.fire({
                title: "Are you sure?",
                text: "Add new homepage section?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, update it!",
                cancelButtonText: "Cancel"
            }).then((result) => {
                if (result.isConfirmed) {
                    homepage_database_post(newHomepageSection_state);
                }
            });
        }
    };

    const homepage_database_delete = async (id) => {
        try {
            setData_process_state(true);

            const response = await axios.delete(
                `${import.meta.env.VITE_SERVER_URL}/admin/delete_homepage_data?id=${id}`,
                { withCredentials: true }
            );

            if (response?.data?.msg) {
                showNotification(false, "Deleted successfully!");
                setHomepageSections_state(homepageSections_state.filter((a) => a._id !== id));
            }
        } catch (error) {
            console.error("Error deleting homepage section:", error);
            if (error.response.data.error_msg) {
                showNotification(true, error.response.data.error_msg);
            } else if (error.response.data.adminJWT_error_msg) {
                showNotification(true, error.response.data.adminJWT_error_msg);
                navigation("/");
            } else {
                showNotification(true, "Something went wrong, please try again.");
            }
        } finally {
            setData_process_state(false);
        }
    };

    const deleteHomepageSection = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Delete This homepage section?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, update it!",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                homepage_database_delete(id);
            }
        });
    };

    const startEditing_homepageSection = (homepageSection) => {
        setEditingId_homepageSection_state(homepageSection._id);
        setEdited_homepageSection_state({
            _id: homepageSection._id,
            homepageSection_title: homepageSection.homepageSection_title,
            homepageSection_message: homepageSection.homepageSection_message,
        });
    };

    const homepage_database_patch = async () => {
        try {
            setData_process_state(true);
            const response = await axios.patch(
                `${import.meta.env.VITE_SERVER_URL}/admin/patch_homepage_data`,
                {
                    _id: edited_homepageSection_state._id,
                    homepageSection_title: edited_homepageSection_state.homepageSection_title,
                    homepageSection_message: edited_homepageSection_state.homepageSection_message,
                },
                { withCredentials: true }
            );

            if (response?.data?.msg) {
                const { homepageSection_title, homepageSection_message, _id } = response.data.msg;
                setHomepageSections_state((prevState) =>
                    prevState.map((item) =>
                        item._id === _id
                            ? { _id, homepageSection_title, homepageSection_message }
                            : item
                    )
                );
                setEditingId_homepageSection_state(null);
                showNotification(false, "Updated successfully!");
            }
        } catch (error) {
            console.error("Error updating homepage section:", error);
            if (error.response.data.error_msg) {
                showNotification(true, error.response.data.error_msg);
            } else if (error.response.data.adminJWT_error_msg) {
                showNotification(true, error.response.data.adminJWT_error_msg);
                navigation("/");
            } else {
                showNotification(true, "Something went wrong, please try again.");
            }
        } finally {
            setData_process_state(false);
        }
    };

    const saveEdit_homepageSection = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Update This homepage section?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, update it!",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                homepage_database_patch();
            }
        });
    };

    return (
        <div>
            <SideMenu sideMenu_show={true} />
            <div className="mt-[75px] md:ml-[256px] p-6 space-y-8">
                {/* Home data Section */}
                <div className="p-6 border border-gray-300 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Home page Data</h2>
                    <input
                        type="text"
                        placeholder="Title"
                        className="border p-2 rounded w-full mb-2"
                        value={newHomepageSection_state.homepageSection_title}
                        onChange={(e) =>
                            setNewHomepageSection_state({
                                ...newHomepageSection_state,
                                homepageSection_title: e.target.value,
                            })
                        }
                    />
                    <textarea
                        placeholder="Details (use HTML for better design)"
                        className="border overflow-hidden p-2 rounded w-full mb-2 auto-resize"
                        rows="4"
                        value={newHomepageSection_state.homepageSection_message}
                        onChange={(e) =>
                            setNewHomepageSection_state({
                                ...newHomepageSection_state,
                                homepageSection_message: e.target.value,
                            })
                        }
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={addHomepageSection}
                    >
                        Add Section
                    </button>
                    {/* homepage Section List */}
                    {homepageSections_state.map((item, index) => (
                        <div key={index} className="p-4 space-y-2 border-b pb-4">
                            {editingId_homepageSection_state === item._id ? (
                                <>
                                    <input
                                        type="text"
                                        className="border p-2 rounded w-full mb-2"
                                        value={edited_homepageSection_state.homepageSection_title}
                                        onChange={(e) =>
                                            setEdited_homepageSection_state((prevState) => ({
                                                ...prevState,
                                                homepageSection_title: e.target.value,
                                            }))
                                        }
                                    />
                                    <textarea
                                        className="border p-2 overflow-hidden rounded w-full mb-2 auto-resize"
                                        rows="4"
                                        value={edited_homepageSection_state.homepageSection_message}
                                        onChange={(e) =>
                                            setEdited_homepageSection_state((prevState) => ({
                                                ...prevState,
                                                homepageSection_message: e.target.value,
                                            }))
                                        }
                                    />
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button
                                            className="bg-green-500 text-white px-4 py-2 rounded"
                                            onClick={saveEdit_homepageSection}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className="bg-gray-500 text-white px-4 py-2 rounded"
                                            onClick={() => setEditingId_homepageSection_state(null)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                homepageSections_state[0].homepageSection_title !== '' && homepageSections_state[0].homepageSection_message !== '' && <>
                                    <p dangerouslySetInnerHTML={{ __html: item.homepageSection_title }} />
                                    <p
                                        dangerouslySetInnerHTML={{
                                            __html: item.homepageSection_message,
                                        }}
                                    ></p>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button
                                            className="bg-yellow-500 text-white px-4 py-2 rounded"
                                            onClick={() => startEditing_homepageSection(item)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded"
                                            onClick={() => deleteHomepageSection(item._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>


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
                            onClick={() =>
                                handle_referral_update(parseFloat(referralRate_state) / 100, "rate")
                            }
                        >
                            Update
                        </button>
                    </div>
                    <div className="mt-4">
                        <label className="text-gray-700">Referral Page Message</label>
                        <textarea
                            className="border p-2 overflow-hidden rounded w-full mt-2 auto-resize"
                            rows="4"
                            value={referralMessage_state}
                            onChange={(e) => setReferralMessage_state(e.target.value)}
                        />
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                            onClick={() => handle_referral_update(referralMessage_state, "text")}
                        >
                            Submit
                        </button>
                    </div>
                </div>

                {/* gift code Section */}
                <div className="p-6 border border-gray-300 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Gift Code</h2>
                    <div className="space-y-4">
                        <label className="text-gray-700">Gift Code Page Message</label>
                        <textarea
                            className="border p-2 overflow-hidden rounded w-full mt-2 auto-resize"
                            rows="4"
                            value={giftCode_state.giftCode_page_Message}
                            onChange={(e) => handleChange("giftCode_page_Message", e.target.value)}
                        />
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 sm:mt-0 sm:ml-4"
                            onClick={() => handleUpdateSettings(giftCode_state, true)}
                        >
                            Update
                        </button>
                        {/* View Ads Required Input */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                            <label className="text-gray-700 sm:w-1/2">View Ads Required:</label>
                            <input
                                type="text"
                                className="border p-2 rounded w-full sm:w-1/2"
                                value={giftCode_state.viewAds_required}
                                onChange={(e) => handleChange("viewAds_required", e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                            <label className="text-gray-700 sm:w-1/2">giftCode Amount:</label>
                            <input
                                type="text"
                                className="border p-2 rounded w-full sm:w-1/2"
                                value={giftCode_state.giftCode_amount}
                                onChange={(e) => handleChange("giftCode_amount", e.target.value)}
                            />
                        </div>

                        {/* Gift Code Claim Limit Input */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                            <label className="text-gray-700 sm:w-1/2">Gift Code Claim Limit:</label>
                            <input
                                type="text"
                                className="border p-2 rounded w-full sm:w-1/2"
                                value={giftCode_state.giftCode_claim_limit}
                                onChange={(e) => handleChange("giftCode_claim_limit", e.target.value)}
                            />
                        </div>

                        {/* Gift Code Claimed Preview */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                            <label className="text-gray-700 sm:w-1/2">Gift Code Claimed (Preview):</label>
                            <input
                                type="text"
                                readOnly
                                className="border p-2 rounded w-full sm:w-1/2 bg-gray-100 cursor-not-allowed"
                                value={giftCode_state.giftCode_claimed}
                            />
                        </div>

                        {/* Shortlink Required Input */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                            <label className="text-gray-700 sm:w-1/2">Shortlink Required:</label>
                            <input
                                type="text"
                                className="border p-2 rounded w-full sm:w-1/2"
                                value={giftCode_state.shortlink_required}
                                onChange={(e) => handleChange("shortlink_required", e.target.value)}
                            />
                        </div>

                        {/* OfferWall Required Input */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                            <label className="text-gray-700 sm:w-1/2">OfferWall Required:</label>
                            <input
                                type="text"
                                className="border p-2 rounded w-full sm:w-1/2"
                                value={giftCode_state.offerWall_required}
                                onChange={(e) => handleChange("offerWall_required", e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-6 w-full"
                        onClick={() => handleUpdateSettings(giftCode_state, false)}
                    >
                        Get Gift Code
                    </button>

                    <div className="flex flex-col sm:flex-row sm:items-center mt-4 sm:gap-4">
                        <label className="text-gray-700 sm:w-1/2">Gift Code (Preview):</label>
                        <input
                            type="text"
                            readOnly
                            className="border p-2 rounded w-full sm:w-1/2 bg-gray-100"
                            value={giftCode_state.giftCode}
                        />
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
                            value={newAnnouncement_state.announcementTitle}
                            onChange={(e) =>
                                setNewAnnouncement_state({
                                    ...newAnnouncement_state,
                                    announcementTitle: e.target.value,
                                })
                            }
                        />
                        <textarea
                            placeholder="Details (use HTML for better design)"
                            className="border overflow-hidden p-2 rounded w-full mb-2 auto-resize"
                            rows="4"
                            value={newAnnouncement_state.announcementMessage}
                            onChange={(e) =>
                                setNewAnnouncement_state({
                                    ...newAnnouncement_state,
                                    announcementMessage: e.target.value,
                                })
                            }
                        />
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={addAnnouncement}
                        >
                            Add Announcement
                        </button>
                    </div>
                    {/* Announcements List */}
                    <div className="space-y-4">
                        {announcements_state.map((item, index) => (
                            <div key={index} className="p-4 space-y-2 border-b pb-4">
                                {editingId_announcement_state === item._id ? (
                                    <>
                                        <input
                                            type="text"
                                            className="border p-2 rounded w-full mb-2"
                                            value={edited_announcement_state.announcementTitle}
                                            onChange={(e) =>
                                                setEdited_announcement_state((prevState) => ({
                                                    ...prevState,
                                                    announcementTitle: e.target.value,
                                                }))
                                            }
                                        />
                                        <textarea
                                            className="border p-2 overflow-hidden rounded w-full mb-2 auto-resize"
                                            rows="4"
                                            value={edited_announcement_state.announcementMessage}
                                            onChange={(e) =>
                                                setEdited_announcement_state((prevState) => ({
                                                    ...prevState,
                                                    announcementMessage: e.target.value,
                                                }))
                                            }
                                        />
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <button
                                                className="bg-green-500 text-white px-4 py-2 rounded"
                                                onClick={saveEdit_Announcement}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="bg-gray-500 text-white px-4 py-2 rounded"
                                                onClick={() => setEditingId_announcement_state(null)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm text-gray-500 float-right">
                                            {item.announcementTime}
                                        </p>
                                        <p className="font-semibold">{item.announcementTitle}</p>
                                        <p
                                            dangerouslySetInnerHTML={{
                                                __html: item.announcementMessage,
                                            }}
                                        ></p>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <button
                                                className="bg-yellow-500 text-white px-4 py-2 rounded"
                                                onClick={() => startEditing_Announcement(item)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-4 py-2 rounded"
                                                onClick={() => deleteAnnouncement(item._id)}
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
                            value={newFaq_state.faqQuestioin}
                            onChange={(e) =>
                                setNewFaq_state({ ...newFaq_state, faqQuestioin: e.target.value })
                            }
                        />
                        <textarea
                            placeholder="Answer"
                            className="border overflow-hidden p-2 rounded w-full mb-2 auto-resize"
                            rows="4"
                            value={newFaq_state.faqAnswer}
                            onChange={(e) =>
                                setNewFaq_state({ ...newFaq_state, faqAnswer: e.target.value })
                            }
                        />
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={addFaq}
                        >
                            Add FAQ
                        </button>
                    </div>

                    {/* FAQs List */}
                    <div className="space-y-4">
                        {faqs_state.map((faq, index) => (
                            <div key={index} className="p-4 space-y-2 border-b pb-4">
                                {editingId_faq_state === faq._id ? (
                                    <>
                                        <input
                                            type="text"
                                            className="border p-2 rounded w-full mb-2"
                                            value={edited_faq_state.faqQuestioin}
                                            onChange={(e) =>
                                                setEdited_faq_state({
                                                    ...edited_faq_state,
                                                    faqQuestioin: e.target.value,
                                                })
                                            }
                                        />
                                        <textarea
                                            className="border overflow-hidden p-2 rounded w-full mb-2 auto-resize"
                                            rows="4"
                                            value={edited_faq_state.faqAnswer}
                                            onChange={(e) =>
                                                setEdited_faq_state({
                                                    ...edited_faq_state,
                                                    faqAnswer: e.target.value,
                                                })
                                            }
                                        />
                                        <div className="flex gap-4">
                                            <button
                                                className="bg-green-500 text-white px-4 py-2 rounded"
                                                onClick={saveEdit_Faq}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="bg-gray-500 text-white px-4 py-2 rounded"
                                                onClick={() => setEditingId_faq_state(null)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-semibold">{faq.faqQuestioin}</p>
                                        <p>{faq.faqAnswer}</p>
                                        <div className="flex gap-4">
                                            <button
                                                className="bg-yellow-500 text-white px-4 py-2 rounded"
                                                onClick={() => startEditing_Faq(faq)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-4 py-2 rounded"
                                                onClick={() => deleteFaq(faq._id)}
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
                            value={newWithdrawalMethod_state.withdrawalMethod_name}
                            onChange={(e) =>
                                setNewWithdrawalMethod_state({
                                    ...newWithdrawalMethod_state,
                                    withdrawalMethod_name: e.target.value,
                                })
                            }
                        />
                        <input
                            type="text"
                            placeholder="Minimum Amount"
                            className="border p-2 rounded w-full mb-2"
                            value={newWithdrawalMethod_state.withdrawalMethod_minimumAmount}
                            onChange={(e) =>
                                setNewWithdrawalMethod_state({
                                    ...newWithdrawalMethod_state,
                                    withdrawalMethod_minimumAmount: e.target.value,
                                })
                            }
                        />
                        <textarea
                            placeholder="Description"
                            className="border overflow-hidden p-2 rounded w-full mb-2 auto-resize"
                            rows="3"
                            value={newWithdrawalMethod_state.withdrawalMethod_details}
                            onChange={(e) =>
                                setNewWithdrawalMethod_state({
                                    ...newWithdrawalMethod_state,
                                    withdrawalMethod_details: e.target.value,
                                })
                            }
                        />
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={addWithdrawalMethod}
                        >
                            Add Method
                        </button>
                    </div>

                    {/* Withdrawal Methods List */}
                    <div className="space-y-4">
                        {withdrawalMethods_state.map((item, index) => (
                            <div key={index} className="p-4 space-y-2 border-b pb-4">
                                {editingId_withdrawalMethod_state === item._id ? (
                                    <>
                                        <input
                                            type="text"
                                            className="border p-2 rounded w-full mb-2"
                                            value={edited_withdrawalMethod_state.withdrawalMethod_name}
                                            onChange={(e) =>
                                                setEdited_withdrawalMethod_state({
                                                    ...edited_withdrawalMethod_state,
                                                    withdrawalMethod_name: e.target.value,
                                                })
                                            }
                                        />
                                        <input
                                            type="text"
                                            className="border p-2 rounded w-full mb-2"
                                            value={edited_withdrawalMethod_state.withdrawalMethod_minimumAmount}
                                            onChange={(e) =>
                                                setEdited_withdrawalMethod_state({
                                                    ...edited_withdrawalMethod_state,
                                                    withdrawalMethod_minimumAmount: e.target.value,
                                                })
                                            }
                                        />
                                        <textarea
                                            className="border overflow-hidden p-2 rounded w-full mb-2 auto-resize"
                                            rows="3"
                                            value={edited_withdrawalMethod_state.withdrawalMethod_details}
                                            onChange={(e) =>
                                                setEdited_withdrawalMethod_state({
                                                    ...edited_withdrawalMethod_state,
                                                    withdrawalMethod_details: e.target.value,
                                                })
                                            }
                                        />
                                        <div className="flex gap-4">
                                            <button
                                                className="bg-green-500 text-white px-4 py-2 rounded"
                                                onClick={saveEdit_widthdrawal}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="bg-gray-500 text-white px-4 py-2 rounded"
                                                onClick={() => setEditingId_withdrawalMethod_state(null)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-semibold">{item.withdrawalMethod_name}</p>
                                        <p>Minimum Amount: {item.withdrawalMethod_minimumAmount}</p>
                                        <p>{item.withdrawalMethod_details}</p>
                                        <div className="flex gap-4">
                                            <button
                                                className="bg-yellow-500 text-white px-4 py-2 rounded"
                                                onClick={() => startEditing_widthdrawal(item)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-4 py-2 rounded"
                                                onClick={() => deleteWithdrawalMethod(item._id)}
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
            {data_process_state && <ProcessBgBlack />}
        </div>
    );
};

export default Dashboard;
