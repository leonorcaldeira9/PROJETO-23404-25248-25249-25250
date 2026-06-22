import { useState, useEffect, useRef } from 'react';
import {Link, useNavigate} from 'react-router-dom';


const SettingsMenu = ({ onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);


    const menuRef = useRef(null);
    const navigate = useNavigate();


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };


    const handleEditProfile = () => {
        setIsOpen(false);
        navigate('/edit-profile');
    };


    const handleDeleteAccount = () => {
        setIsOpen(false);

        const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");

        if (confirmDelete) {

            console.log("Account deleted locally for testing.");
            onLogout();
        }
    };

    return (
        <div className="position-relative" ref={menuRef}>
            <button
                onClick={toggleMenu}
                className="btn btn-light border-0 rounded-circle d-flex align-items-center justify-content-center nav-icons">
                <i className="bi bi-gear fs-3 text-secondary"></i>
            </button>


            {isOpen && (
                <div className="dropdown-menu show position-absolute end-0 mt-2 shadow-sm" style={{ minWidth: '200px' }}>

                    <Link
                        to="/EditProfile"
                        className="dropdown-item d-flex align-items-center text-decoration-none"
                        onClick={() => setIsOpen(false)}
                    >
                        <i className="bi bi-pencil-square me-2 text-secondary"></i> Edit Profile
                    </Link>

                    <div className="dropdown-divider"></div>

                    <Link
                        to="/settings"
                        className="dropdown-item d-flex align-items-center text-decoration-none"
                        onClick={() => setIsOpen(false)}
                    >
                        <i className="bi bi-gear me-2 text-secondary"></i>Settings
                    </Link>

                    <div className="dropdown-divider"></div>

                    <button className="dropdown-item d-flex align-items-center text-danger" onClick={handleDeleteAccount}>
                        <i className="bi bi-trash me-2"></i> Delete Account
                    </button>
                </div>
            )}
        </div>
    );
};

export default SettingsMenu;