import axios from 'axios';
import './profile.css';
import { useCallback, useEffect, useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Navbar from "../../components/navBar/navBar.jsx";
import { useNavigate, useParams } from "react-router-dom";
import PostCard from "../../components/postCard/postCard.jsx";
import AlertModal from "../../components/alertModal/alertModal.jsx";

const formatData = (dataString) => {
    if (!dataString) return '';

    const data = new Date(dataString);
    const day = String(data.getDate()).padStart(2, '0');
    const month = String(data.getMonth() + 1).padStart(2, '0');
    const year = data.getFullYear();

    return `${day}/${month}/${year}`;
};

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const { id } = useParams();

    const [imageError, setImageError] = useState(false);

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    const profileUserId = id || userId;
    const photoUrl = `/users/${profileUserId}.png`;

    const [posts, setPosts] = useState([]);


    const [relation, setRelation] = useState('none');

    const [modal, setModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: ''
    });

    const closeModal = () => {
        setModal({ ...modal, isOpen: false });
    };

    const [confirmAction, setConfirmAction] = useState({ isOpen: false, targetUserId: null, type: null });

    const triggerConfirmAction = (type) => {
        setConfirmAction({ isOpen: true, type: type });
    };

    const fetchUserData = useCallback(async () => {
        if (!token || !userId) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:3001/users/${profileUserId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserData(response.data);
        } catch (err) {
            console.error("Error loading user data:", err);
        } finally {
            setIsLoading(false);
        }
    }, [profileUserId, token, userId]);

    const fetchUserPosts = useCallback(async () => {
        if (!token || !userId) return;

        try {
            const response = await axios.get(`http://localhost:3001/posts/user/${profileUserId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts(response.data);
        } catch (err) {
            console.error("Error loading user posts:", err);
        }
    }, [profileUserId, token, userId]);

    const fetchRelationship = useCallback(async () => {
        if (profileUserId === userId) return;

        try {
            const response = await axios.get(`http://localhost:3001/friendShip/status/${profileUserId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRelation(response.data.friendshipStatus || 'none');
        } catch (err) {
            console.error("Error verifying relationship:", err);
        }
    }, [profileUserId, token, userId]);


    const handleSendRequest = async () => {
        try {
            await axios.post('http://localhost:3001/friendShip/request',
                { friendId: profileUserId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRelation('P');
        } catch (error) {
            console.error("Error sending friend request:", error);
            setModal({
                isOpen: true,
                title: 'Error',
                message: "Error sending request. Try again later.",
                type: 'error'
            });
        }
    };


    const handleRemoveFriend = async () => {

        setConfirmAction({ isOpen: false, type: null });
        try {

            await axios.delete(`http://localhost:3001/friendShip/delete/${profileUserId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setRelation('none');
        } catch (error) {
            console.error("Error removing friend:", error);
            setModal({
                isOpen: true,
                title: 'Error',
                message: "Error trying to cancel request. Try again later.",
                type: 'error'
            });
        }
    };

    const handleBlockUser = async () => {
        setConfirmAction({ isOpen: false, type: null });

        try {
            await axios.put('http://localhost:3001/friendShip/update',
                { friendId: profileUserId, friendshipStatus: 'B' },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setRelation('B');

        } catch (error) {
            console.error("Error blocking user:", error);
            setModal({
                isOpen: true,
                title: 'Error',
                message: "Error trying to block. Try again later.",
                type: 'error'
            });
        }
    };


    const handleUnblockUser = async () => {

        try {
            await axios.delete(`http://localhost:3001/friendShip/delete/${profileUserId}`, {
                headers: { Authorization: `Bearer ${token}` }

            });

            setRelation('none');

        } catch (error) {
            console.error("Error unblocking user:", error);
            setModal({
                isOpen: true,
                title: 'Error',
                message: "An error occurred. Please try again.",
                type: 'error'
            });
        }
    };

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchUserData();
        fetchUserPosts();
        fetchRelationship();
    }, [navigate, fetchUserData, fetchUserPosts, fetchRelationship, token]);

    useEffect(() => {
        setImageError(false);
    }, [profileUserId]);

    if (isLoading) {
        return <div className="text-center mt-5">Loading profile...</div>;
    }

    return (
        <div className="background d-flex flex-column">
            <Navbar />

            <div className="card shadow-sm border-0 mt-5 mb-5 w-100 mx-auto profile-card">
                <div className="banner"></div>
                <div className="px-4">
                    <div className="userCircle d-flex align-items-center justify-content-center overflow-hidden bg-light shadow-sm position-absolute">
                        {(!profileUserId || imageError) ? (
                            <i className="bi bi-person-circle text-secondary w-100 h-100 d-flex align-items-center justify-content-center default-icon"></i>
                        ) : (
                            <img
                                src={photoUrl}
                                alt="foto de perfil"
                                className="w-100 h-100 profile-img"
                                onError={() => setImageError(true)}
                            />
                        )}
                    </div>


                    <div className="sub-card">
                        <h3 className="mb-0 fw-bold mx-2">{userData?.fullName || 'Anonymous'}</h3>
                        <p className="mb-0 text-muted mx-2 mt-3">
                            <i className="bi bi-geo-alt-fill me-1"></i>
                            {userData?.city || 'Location unknown'}
                        </p>
                        <p className="mb-0 text-muted mx-2">
                            <i className="bi bi-cake me-1"></i>
                            {formatData(userData?.birthDate)}
                        </p>
                    </div>

                    {profileUserId !== userId && (
                        <div className="mt-2 mx-2 d-flex gap-2 mb-4">
                            {relation === 'F' && (
                                <>
                                    <button className="btn btn-success btn-sm fw-semibold d-flex align-items-center gap-1" disabled>
                                        <i className="bi bi-check-lg"></i> Friends
                                    </button>
                                    <button className="btn btn-outline-danger btn-sm fw-semibold d-flex align-items-center gap-1" onClick={() => triggerConfirmAction('unfriend')}>
                                        <i className="bi bi-person-x-fill"></i> Unfriend
                                    </button>
                                    <button className="btn btn-light border btn-sm text-danger d-flex align-items-center gap-1" onClick={() => triggerConfirmAction('block')}>
                                        <i className="bi bi-slash-circle"></i> Block
                                    </button>
                                </>
                            )}

                            {relation === 'P' && (
                                <>
                                    <button className="btn btn-warning text-dark btn-sm fw-semibold d-flex align-items-center gap-1" disabled>
                                        <i className="bi bi-clock-history"></i> Pending Request
                                    </button>
                                    <button className="btn btn-outline-danger btn-sm fw-semibold d-flex align-items-center gap-1" onClick={handleRemoveFriend}>
                                        <i className="bi bi-x-circle-fill"></i> Cancel
                                    </button>
                                </>
                            )}

                            {relation === 'none' && (
                                <>
                                    <button className="btn btn-primary btn-sm fw-semibold d-flex align-items-center gap-1" onClick={handleSendRequest}>
                                        <i className="bi bi-person-plus-fill"></i> Add Friend
                                    </button>
                                    <button className="btn btn-light border btn-sm text-danger d-flex align-items-center gap-1" onClick={() => triggerConfirmAction('block')}>
                                        <i className="bi bi-slash-circle"></i> Block
                                    </button>
                                </>
                            )}

                            {relation === 'B' && (
                                <button
                                    className="btn btn-danger btn-sm fw-semibold d-flex align-items-center gap-1"
                                    onClick={handleUnblockUser}
                                >
                                    <i className="bi bi-unlock-fill"></i> Unblock User
                                </button>
                            )}
                        </div>
                    )}

                    <hr className="text-muted opacity-25" />

                    <div className="w-100 mx-auto mt-4 timeline-container">
                        <h5 className="mb-3 fw-bold text-dark px-2">Timeline</h5>

                        {posts.length === 0 ? (
                            <div className="card shadow-sm border-0 p-5 text-center bg-light mb-4">
                                <i className="bi bi-journal-x fs-1 text-muted mb-2"></i>
                                <p className="text-muted fw-semibold mb-0">No posts available.</p>
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-3 pb-5">
                                {posts.map((post) => {
                                    const postCompleto = {
                                        ...post,
                                        fullName: post.fullName || userData?.fullName
                                    };

                                    return (
                                        <PostCard
                                            key={postCompleto.id}
                                            post={postCompleto}
                                            token={token}
                                        />
                                    );
                                })}
                            </div>
                        )}
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
                title={confirmAction.type === 'unfriend' ? "Unfriend User" : "Block User"}
                message={confirmAction.type === 'unfriend'
                    ? "Are you sure you want to remove this person from your friends list?"
                    : "Are you sure you want to block this user?"}
                type="error"
                confirmText={confirmAction.type === 'unfriend' ? "Unfriend" : "Block"}
                onClose={() => setConfirmAction({ isOpen: false, type: null })}
                onConfirm={confirmAction.type === 'unfriend' ? handleRemoveFriend : handleBlockUser}
            />

        </div>
    );
};

export default Profile;