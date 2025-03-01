import React, { useState, useEffect, useRef } from 'react';
import ProcessBgBlack from '../components/processBgBlack/processBgBlack';
import SideMenu from '../components/sideMenu/sideMenu';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import showNotification from "../components/showNotification";

const PrivacyPolicy = () => {
    const [data_process_state, setData_process_state] = useState(false);
    const [privacyText, setPrivacyText] = useState('');
    const textareaRef = useRef(null);
    const navigation = useNavigate();

    // Function to adjust the textarea height based on its content
    const autoResize = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto'; // Reset height
            textarea.style.height = textarea.scrollHeight + 'px'; // Set height to match content
        }
    };

    // Call autoResize whenever privacyText changes (including after initial load)
    useEffect(() => {
        autoResize();
    }, [privacyText]);

    // Fetch Privacy Policy data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setData_process_state(true);
                const response = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/admin/getPrivacy_policyData`,
                    { withCredentials: true }
                );
                if (response?.data?.msg) {
                    setPrivacyText(response.data.msg.privacy_policy || '');
                }
            } catch (error) {
                console.error("Error fetching privacy policy data:", error);
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
    }, [navigation]);

    const handleChange = (e) => {
        setPrivacyText(e.target.value);
    };

    const handleUpdate = async () => {
        // Show confirmation modal
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Update privacy policy data?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, update it!",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            setData_process_state(true);
            try {
                const response = await axios.patch(
                    `${import.meta.env.VITE_SERVER_URL}/admin/patch_privacy_policy_data`,
                    { privacy_policy: privacyText },
                    { withCredentials: true }
                );

                if (response?.data?.msg) {
                    setPrivacyText(response.data.msg.privacy_policy || '');
                    showNotification(false, "Your privacy policy has been updated.");
                }
            } catch (error) {
                console.error("Error updating privacy policy data:", error);
                const errorMsg =
                    error.response?.data?.error_msg ||
                    error.response?.data?.adminJWT_error_msg ||
                    "Something went wrong, please try again.";
                showNotification(true, errorMsg);
                if (error.response?.data?.adminJWT_error_msg) {
                    navigation("/");
                }
            } finally {
                setData_process_state(false);
            }
        }
    };

    return (
        <div>
            <SideMenu sideMenu_show={true} />
            <div className="mt-[75px] md:ml-[256px] p-6 space-y-8">
                {data_process_state && <ProcessBgBlack />}
                <textarea
                    ref={textareaRef}
                    className="w-full border border-gray-300 rounded p-2 resize-none overflow-hidden"
                    value={privacyText}
                    onChange={handleChange}
                    placeholder="Privacy policy content..."
                />
                <button
                    onClick={handleUpdate}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Update
                </button>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
