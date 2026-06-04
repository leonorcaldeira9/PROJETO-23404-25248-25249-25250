import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SettingsMenu = ({ onLogout }) => {
    // State to control the visibility of the settings dropdown
    const [isOpen, setIsOpen] = useState(false);

    // Reference to detect clicks outside the settings menu
    const menuRef = useRef(null);
    const navigate = useNavigate();

    // Close the dropdown if the user clicks outside of it
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

    // Toggles the settings menu open/closed
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Navigates to the edit profile page
    const handleEditProfile = () => {
        setIsOpen(false);
        navigate('/edit-profile');
    };

    // Handles the account deletion process
    const handleDeleteAccount = () => {
        setIsOpen(false);

        const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");

        if (confirmDelete) {
            // TODO: API call to delete the user from database
            console.log("Account deleted locally for testing.");
            onLogout(); // Triggers the logout function passed from Navbar
        }
    };

    return (
        <div className="position-relative" ref={menuRef}>
            <button
                onClick={toggleMenu}
                className="btn btn-light border-0 rounded-circle d-flex align-items-center justify-content-center nav-icons">
                <i className="bi bi-gear fs-3 text-secondary"></i>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="dropdown-menu show position-absolute end-0 mt-2 shadow-sm" style={{ minWidth: '200px' }}>
                    <button className="dropdown-item d-flex align-items-center" onClick={handleEditProfile}>
                        <i className="bi bi-pencil-square me-2 text-secondary"></i> Edit Profile
                    </button>

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