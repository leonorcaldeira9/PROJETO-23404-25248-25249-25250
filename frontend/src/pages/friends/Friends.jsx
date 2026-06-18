import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/navBar/navBar.jsx";

const FriendsPage = () => {
    const navigate = useNavigate();

    // Retrieve authentication data
    const token = localStorage.getItem('token');
    const currentUserId = localStorage.getItem('userId');

    const [friends, setFriends] = useState([]);
    const [discoverableUsers, setDiscoverableUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            if (!currentUserId || !token) {
                setIsLoading(false);
                return;
            }

            try {
                // Fetch friends, all users, and pending requests simultaneously
                const [friendsResponse, allUsersResponse, pendingResponse] = await Promise.all([
                    axios.get(`http://localhost:3001/friendShip/user/${currentUserId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`http://localhost:3001/users`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    // Back to the correct route! The backend handles the 'P' logic now.
                    axios.get(`http://localhost:3001/friendShip/requests/pending`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }).catch((err) => {
                        console.error("Error fetching pending requests:", err.response?.data || err.message);
                        return { data: [] };
                    })
                ]);

                const friendsData = friendsResponse.data || [];
                const allUsersData = allUsersResponse.data || [];

                // Extract pending data safely
                let pendingData = pendingResponse.data || [];
                if (!Array.isArray(pendingData) && pendingData.data) {
                    pendingData = pendingData.data;
                }

                setFriends(friendsData);
                console.log("🚨 VERDADE DOS PENDENTES 🚨 ->", JSON.stringify(pendingData, null, 2));   
                // Filter logic for the Discover section
                const filteredDiscoverList = allUsersData.filter(user => {
                    // 1. Remove the current logged-in user
                    const isSelf = String(user.id) === String(currentUserId);

                    // 2. Remove users that are already in the friends list
                    const isAlreadyFriend = friendsData.some(friend => String(friend.id) === String(user.id));

                    // 3. Remove users that are in the pending list
                    let isPending = false;
                    if (Array.isArray(pendingData)) {
                        isPending = pendingData.some(request => {
                            // Extract all values from the request object and check if the user ID is among them
                            const requestValues = Object.values(request).map(val => String(val));
                            return requestValues.includes(String(user.id));
                        });
                    }

                    // Only return true if they are NOT self, NOT a friend, and NOT pending
                    return !isSelf && !isAlreadyFriend && !isPending;
                });

                // Shuffle the filtered list
                const shuffledDiscoverUsers = filteredDiscoverList.sort(() => 0.5 - Math.random());
                setDiscoverableUsers(shuffledDiscoverUsers);

            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, [currentUserId, token]);

    // Navigate to user's profile
    const handleViewProfile = (userId) => {
        navigate(`/profile/${userId}`);
    };

    // Handle sending a friend request
    const handleAddFriend = async (userIdToAdd) => {
        try {
            await axios.post(`http://localhost:3001/friendShip/request`,
                { fromUserId: currentUserId, toUserId: userIdToAdd },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Remove the user from the full discoverable list immediately
            setDiscoverableUsers(prevUsers => prevUsers.filter(user => user.id !== userIdToAdd));
        } catch (error) {
            console.error("Error sending friend request:", error);
            if (error.response?.status === 400) {
                alert("This user is already pending or is already your friend!");
                // Clean them from the list anyway to fix the UI
                setDiscoverableUsers(prevUsers => prevUsers.filter(user => user.id !== userIdToAdd));
            }
        }
    };

    if (isLoading) {
        return (
            <div className="text-center p-5 text-secondary">
                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                Loading...
            </div>
        );
    }

    // Get only the top 9 users from the pool to display
    const visibleDiscoverUsers = discoverableUsers.slice(0, 9);

    return (
        <div className="background">
            <Navbar/>
            <div className="container mt-4">

                {/* Friends Section */}
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

                                    <div style={{ position: 'relative', width: '50px', height: '50px', flexShrink: 0 }} className="me-3">
                                        <div className="bg-secondary rounded-circle d-flex justify-content-center align-items-center text-white w-100 h-100 position-absolute top-0 start-0">
                                            <i className="bi bi-person fs-4"></i>
                                        </div>
                                        <img
                                            src={`users/${friend.id}.png`}
                                            alt={friend.fullName}
                                            className="rounded-circle object-fit-cover position-absolute top-0 start-0 w-100 h-100"
                                            style={{ zIndex: 1 }}
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    </div>

                                    <div className="flex-grow-1 overflow-hidden">
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

                <hr className="my-5 text-secondary" />

                {/* Discover Section */}
                <h4 className="fw-bold mb-4">Discover</h4>

                {visibleDiscoverUsers.length === 0 ? (
                    <div className="text-center p-4 text-muted bg-light rounded shadow-sm">
                        <i className="bi bi-search fs-2 mb-2 d-block"></i>
                        No new people to discover right now.
                    </div>
                ) : (
                    <div className="row g-3 mb-5">
                        {visibleDiscoverUsers.map((user) => (
                            <div key={user.id} className="col-12 col-md-6 col-lg-4">
                                <div className="card shadow-sm border-0 d-flex flex-row align-items-center p-3">

                                    <div style={{ position: 'relative', width: '50px', height: '50px', flexShrink: 0 }} className="me-3">
                                        <div className="bg-primary bg-opacity-25 rounded-circle d-flex justify-content-center align-items-center text-primary w-100 h-100 position-absolute top-0 start-0">
                                            <i className="bi bi-person fs-4"></i>
                                        </div>
                                        <img
                                            src={`users/${user.id}.png`}
                                            alt={user.fullName}
                                            className="rounded-circle object-fit-cover position-absolute top-0 start-0 w-100 h-100"
                                            style={{ zIndex: 1 }}
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    </div>

                                    <div className="flex-grow-1 overflow-hidden">
                                        <h6 className="mb-0 fw-semibold text-truncate">
                                            {user.fullName || 'Unknown User'}
                                        </h6>
                                    </div>

                                    <button
                                        onClick={() => handleAddFriend(user.id)}
                                        className="btn btn-primary btn-sm ms-2 d-flex align-items-center gap-1"
                                    >
                                        <i className="bi bi-person-plus-fill"></i> Add
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