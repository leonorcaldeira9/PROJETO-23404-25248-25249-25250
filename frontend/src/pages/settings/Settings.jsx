import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/navBar/navBar.jsx';
import 'bootstrap-icons/font/bootstrap-icons.css';
import AlertModal from "../../components/alertModal/alertModal.jsx";

const SettingsPage = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    const [isDeleting, setIsDeleting] = useState(false);

    const [modal, setModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: ''
    });

    const closeModal = () => {
        setModal({ ...modal, isOpen: false });
        if (modal.type === 'success') {
            navigate('/login');
        }
    };

    const triggerLogout = () => {
        setConfirmAction({ isOpen: true, type: 'logout' });
    };

    const triggerDeleteAccount = () => {
        setConfirmAction({ isOpen: true, type: 'delete' });
    };

    const [confirmAction, setConfirmAction] = useState({ isOpen: false, targetUserId: null, type: null });


    const handleConfirmAction = async () => {
        const actionType = confirmAction.type;
        setConfirmAction({ isOpen: false, type: null });

        if (actionType === 'logout') {
            localStorage.clear();
            navigate('/login');

        } else if (actionType === 'delete') {
            setIsDeleting(true);

            try {
                await axios.delete(`http://localhost:3001/users/delete/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                localStorage.clear();

                setModal({
                    isOpen: true,
                    title: 'Goodbye!',
                    message: "Account successfully deleted. We are sorry to see you go!",
                    type: 'success'
                });

            } catch (error) {
                console.error("Error deleting account:", error);
                setModal({
                    isOpen: true,
                    title: 'Error',
                    message: "Error trying to delete your account. Try again later.",
                    type: 'error'
                });
                setIsDeleting(false);
            }
        }
    };

    return (
        <div className="background">
            <Navbar />

            <div className="container mt-5 mb-5" style={{ maxWidth: '600px' }}>
                <div className="card shadow-sm border-0 p-4">
                    <h3 className="fw-bold mb-4 text-dark border-bottom pb-3">
                        <i className="bi bi-gear-fill me-2 text-secondary"></i> Settings
                    </h3>

                    <div className="list-group list-group-flush gap-2">

                        <Link to="/EditProfile" className="list-group-item list-group-item-action d-flex align-items-center py-3 border rounded shadow-sm">
                            <i className="bi bi-person-lines-fill fs-3 text-primary me-3"></i>
                            <div>
                                <h6 className="mb-0 fw-bold">Edit Profile</h6>
                                <small className="text-muted">Change your personal information, password and privacy.</small>
                            </div>
                        </Link>

                        <Link to="/pendingRelationship" className="list-group-item list-group-item-action d-flex align-items-center py-3 border rounded shadow-sm">
                            <i className="bi bi-person-badge fs-3 text-primary me-3"></i>
                            <div>
                                <h6 className="mb-0 fw-bold">Pending Requests and Blocked Users</h6>
                                <small className="text-muted">View your pending friendship request and the users you blocked</small>
                            </div>
                        </Link>

                        <button onClick={triggerLogout} className="list-group-item list-group-item-action d-flex align-items-center py-3 border rounded shadow-sm text-start mt-2">
                            <i className="bi bi-box-arrow-right fs-3 text-secondary me-3"></i>
                            <div>
                                <h6 className="mb-0 fw-bold">Logout</h6>
                                <small className="text-muted">Sign out of your Feicebuque account.</small>
                            </div>
                        </button>

                        <div className="mt-5">
                            <h6 className="text-danger fw-bold mb-2 px-1">Danger Zone</h6>
                            <button
                                onClick={triggerDeleteAccount}
                                disabled={isDeleting}
                                className="list-group-item list-group-item-action d-flex align-items-center py-3 text-start list-group-item-danger border border-danger rounded shadow-sm"
                            >
                                <i className="bi bi-trash3-fill fs-3 text-danger me-3"></i>
                                <div>
                                    <h6 className="mb-0 fw-bold text-danger">Delete Account</h6>
                                    <small className="text-danger">Permanently delete your account, posts, and friends.</small>
                                </div>
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <AlertModal
                isOpen={modal.isOpen}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                onClose={closeModal}
            />

            <AlertModal
                isOpen={confirmAction.isOpen}
                title={confirmAction.type === 'logout' ? "Logout" : "Delete Account"}
                message={confirmAction.type === 'logout'
                    ? "Are you sure you want to sign out of your account?"
                    : "Are you absolutely sure? This action cannot be undone and you will lose all your data forever!"}
                type="error"
                onClose={() => setConfirmAction({ isOpen: false, type: null })}
                onConfirm={handleConfirmAction}
            />
        </div>
    );
};

export default SettingsPage;



