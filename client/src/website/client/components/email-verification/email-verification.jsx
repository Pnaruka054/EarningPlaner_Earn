import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import showNotificationWith_timer from '../../components/showNotificationWith_timer'
import showNotification from '../../components/showNotification'
import ProcessBgBlack from "../processBgBlack/processBgBlack";

const EmailVerification = () => {
    let { token, email } = useParams();
    const navigation = useNavigate();
    const [data_process_state, setData_process_state] = useState(false);

    // Token verification on page load
    useEffect(() => {
        const verifyToken = async () => {
            try {
                setData_process_state(true)
                const response = await fetch(
                    `${import.meta.env.VITE_SERVER_URL}/userRoute/verify_reset_email_token?token=${token}&email=${email}`,
                    {
                        method: "GET",
                    }
                );
                const data = await response.json();   
                if (data.success) {
                    showNotificationWith_timer(false, data.msg);
                } else {
                    showNotificationWith_timer(true, data.error_msg, '/login', navigation);
                }
            } catch (error) {
                console.error("Token Verification Error:", error.message);
                showNotification(true, 'Token Verification Failed!')
            } finally {
                setData_process_state(false)
                navigation("/");
            }
        };

        verifyToken();
    }, [token, navigation]);

    return (
        <div>
            {data_process_state && <ProcessBgBlack />}
        </div>
    );
}

export default EmailVerification;
