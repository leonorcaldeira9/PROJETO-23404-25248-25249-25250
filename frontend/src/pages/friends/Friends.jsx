import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/navBar/navBar.jsx";
const FriendsPage = () => {
    const navigate = useNavigate();

    // Retrieve authentication data
    const token = localStorage.getItem('token');
    const currentUserId = localStorage.getItem('userId');

    const [friends, setFriends] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchFriends = useCallback(async () => {
        if (!currentUserId || !token) {
            setIsLoading(false);
            console.warn("User ID or token is missing.");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:3001/friendShip/user/${currentUserId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Friends data received:", response.data);
            setFriends(response.data);
        } catch (error) {
            console.error("Error loading friends list:", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentUserId, token]);

    useEffect(() => {
        fetchFriends();
    }, [fetchFriends]);

    // Navigate to friend's profile
    const handleViewProfile = (friendId) => {
        navigate(`/profile/${friendId}`);
    };

    if (isLoading) {
        return (
            <div className="text-center p-5 text-secondary">
                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                Loading friends...
            </div>
        );
    }

    return (
       <div className="background">

           <Navbar/>


            <div className="container mt-4">
                <h4 className="fw-bold mb-4">My Friends</h4>

                {friends.length === 0 ? (
                    <div className="text-center p-5 bg-light rounded shadow-sm border-0">
                        <i className="bi bi-people fs-1 text-muted mb-2"></i>
                        <h6 className="text-secondary mt-2">No friends found</h6>
                        <small className="text-muted">You haven't added any friends yet.</small>
                    </div>
                ) : (
                    <div className="row g-3">
                        {friends.map((friend) => (
                            <div key={friend.id} className="col-12 col-md-6 col-lg-4">
                                <div className="card shadow-sm border-0 d-flex flex-row align-items-center p-3">

                                    {/* Image container with fallback logic */}
                                    <div style={{ position: 'relative', width: '50px', height: '50px', flexShrink: 0 }} className="me-3">

                                        {/* Fallback Icon (shows if image is missing/errors out) */}
                                        <div className="bg-secondary rounded-circle d-flex justify-content-center align-items-center text-white w-100 h-100 position-absolute top-0 start-0">
                                            <i className="bi bi-person fs-4"></i>
                                        </div>

                                        {/* Actual User Profile Image (named by ID) */}
                                        <img
                                            src={`users/${friend.id}.png`}
                                            alt={friend.fullName}
                                            className="rounded-circle object-fit-cover position-absolute top-0 start-0 w-100 h-100"
                                            style={{ zIndex: 1 }}
                                            // Hide image on error to reveal the fallback icon underneath
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    </div>

                                    <div className="flex-grow-1 overflow-hidden">
                                        {/* Just the Name */}
                                        <h6 className="mb-0 fw-semibold text-truncate">
                                            {friend.fullName || 'Unknown User'}
                                        </h6>
                                    </div>

                                    <button
                                        onClick={() => handleViewProfile(friend.id)}
                                        className="btn btn-outline-primary btn-sm ms-2"
                                    >
                                        Profile
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
       </div>
    );
};

export default FriendsPage;