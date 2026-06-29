import { useState, useEffect } from 'react';
import AlertModal from "../alertModal/alertModal.jsx";
import {useNavigate} from "react-router-dom";

const SessionExpiredHandler = ({ children }) => {
    const navigate = useNavigate();
    const [showExpired, setShowExpired] = useState(false);

    useEffect(() => {
        const handleSessionExpired = () => {
            setShowExpired(true);
        };

        window.addEventListener('expiredSession', handleSessionExpired);

        return () => {
            window.removeEventListener('expiredSession', handleSessionExpired);
        };
    }, []);

    const handleClose = () => {
        setShowExpired(false);
        navigate('/login');
    };

    return (
        <>
            {children}

            <AlertModal
                isOpen={showExpired}
                title="Session Expired"
                message="Your session has expired. Please log in again to continue."
                type="error"
                onClose={handleClose}
            />
        </>
    );
};

export default SessionExpiredHandler;