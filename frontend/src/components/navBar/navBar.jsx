import {Link, useNavigate} from 'react-router-dom';
import './navBar.css';
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import logo from "../../assets/logo.png";
import 'bootstrap-icons/font/bootstrap-icons.css';
import AlertModal from "../alertModal/alertModal.jsx";

const Navbar = () => {


    const [name, setName] = useState(() => localStorage.getItem('userName') || '');
    const [userId] = useState(() => localStorage.getItem('userId') || '');

    const [imageError, setImageError] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [isBellRinging, setIsBellRinging] = useState(false);
    const prevCount = useRef(0);

    const token = localStorage.getItem('token');

    const navigate = useNavigate();

    const [confirmLogout, setConfirmLogout] = useState(false);

    useEffect(() => {
        const updateName = () => {
            const newName = localStorage.getItem('userName');
            setName(newName || '');
        };

        window.addEventListener('perfilAtualizado', updateName);

        return () => {
            window.removeEventListener('perfilAtualizado', updateName);
        };
    }, []);

    useEffect(() => {
        if (notificationCount > prevCount.current) {

            setIsBellRinging(true);

            prevCount.current = notificationCount;
        }
    }, [notificationCount]);

    useEffect(() => {
        const fetchNotificationCount = async () => {
            if (!token) return;
            try {
                const response = await axios.get('http://localhost:3001/friendShip/requests/pending', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const allRequests = response.data;

                const incomingRequests = allRequests.filter(req =>
                    String(req.receiverId) === String(userId)
                );

                setNotificationCount(incomingRequests.length);
            } catch (error) {
                console.error("Error fetching notifications count:", error);
            }
        };

        fetchNotificationCount();

        window.addEventListener('notificationsUpdate', fetchNotificationCount);

        return () => {
            window.removeEventListener('notificationsUpdate', fetchNotificationCount);
        };
    }, [token, userId]);

    const handleLogout = () => {
        setConfirmLogout(true);
    };

    const executeLogout = () => {
        setConfirmLogout(false);
        localStorage.clear();
        navigate('/login');
    };

    const photoUrl = `/users/${userId}.png`;

    return (
        <nav className="navbar sticky-top navbar-light bg-light shadow-sm">
            <div className="container-fluid justify-content-start">

                <div className="d-flex align-items-center">

                    <Link to={"/feed"} className="navbar-brand d-flex align-items-center">
                        <img
                            src={logo}
                            className="logo img-fluid"
                            alt="Logo do Feicebuque"
                        />
                    </Link>

                    <div className="ms-3 d-flex align-items-center">
                        <h4 className="mb-0 text-secondary">Welcome, {name}!</h4>
                    </div>
                </div>


                <div className="d-flex align-items-center gap-1 position-absolute top-50 end-0 translate-middle-y pe-3">

                    <Link to={"/notifications"}>
                        <button className="btn btn-light border-0 rounded-circle d-flex align-items-center justify-content-center nav-icons position-relative">
                            <i className={`bi bi-bell fs-3 text-secondary ${isBellRinging ? 'bell-animation' : ''}`}></i>

                            {notificationCount > 0 && (
                                <span className="position-absolute badge rounded-pill bg-danger notification-count">
                                    {notificationCount > 99 ? '99+' : notificationCount}
                                </span>
                            )}

                        </button>
                    </Link>

                    <Link to={"/settings"}>
                        <button
                            className="btn btn-light border-0 rounded-circle d-flex align-items-center justify-content-center nav-icons">
                            <i className="bi bi-gear fs-3 text-secondary"></i>
                        </button>
                    </Link>

                    <button onClick={handleLogout}
                        className="btn btn-light border-0 rounded-circle  d-flex align-items-center justify-content-center nav-icons">
                        <i className="bi bi-box-arrow-left fs-3 text-secondary"></i>
                    </button>

                    <button className="btn btn-light border-0 p-0 rounded-circle ms-3 d-flex align-items-center justify-content-center shadow-sm user-profile-picture position-relative overflow-hidden">

                        {(!userId || imageError) ? (
                            <i className="bi bi-person-circle text-secondary user-profile-picture-default" onClick={() => navigate('/profile')}></i>
                        ) : (
                            <img
                                onClick={() => navigate('/profile')}
                                src={photoUrl}
                                alt={`Photo of ${name}`}
                                className="w-100 h-100 user-profile-picture"
                                onError={() => setImageError(true)}
                            />
                        )}

                    </button>
                </div>
            </div>
            <AlertModal
                isOpen={confirmLogout}
                title="Logout"
                message="Are you sure you want to sign out of your account?"
                type="error"
                confirmText="Logout"
                onClose={() => setConfirmLogout(false)}
                onConfirm={executeLogout}
            />
        </nav>
    );
};

export default Navbar;

