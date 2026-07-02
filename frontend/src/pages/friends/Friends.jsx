import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/navBar/navBar.jsx";
import AlertModal from "../../components/alertModal/alertModal.jsx";
import "../../pages/friends/friends.css"

const FriendsPage = () => {
    const navigate = useNavigate();


    const token = localStorage.getItem('token');
    const currentUserId = localStorage.getItem('userId');

    const [friends, setFriends] = useState([]);
    const [discoverableUsers, setDiscoverableUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [modal, setModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: ''
    });

    const closeModal = () => {
        setModal({ ...modal, isOpen: false });
    };

    useEffect(() => {
        const fetchAllData = async () => {
            if (!currentUserId || !token) {
                setIsLoading(false);
                return;
            }

            try {

                const [friendsResponse, allUsersResponse, pendingResponse, blockedResponse] = await Promise.all([
                    axios.get(`http://localhost:3001/friendShip/user/${currentUserId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`http://localhost:3001/users`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`http://localhost:3001/friendShip/requests/pending`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }).catch((err) => {
                        console.error("Error fetching pending requests:", err.response?.data || err.message);
                        return { data: [] };
                    }),
                    axios.get(`http://localhost:3001/friendShip/blocked`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }).catch((err) => {
                        console.error("Error fetching blocked users:", err.response?.data || err.message);
                        return { data: [] };
                    })
                ]);

                const friendsData = friendsResponse.data || [];
                const allUsersData = allUsersResponse.data || [];
                const blockedData = blockedResponse.data || [];

                let pendingData = pendingResponse.data || [];
                if (!Array.isArray(pendingData) && pendingData.data) {
                    pendingData = pendingData.data;
                }

                setFriends(friendsData);

                const filteredDiscoverList = allUsersData.filter(user => {
                    const isSelf = String(user.id) === String(currentUserId);
                    const isAlreadyFriend = friendsData.some(friend => String(friend.id) === String(user.id));
                    const isBlocked = blockedData.some(blockedUser => String(blockedUser.id) === String(user.id));

                    let isPending = false;
                    if (Array.isArray(pendingData)) {
                        isPending = pendingData.some(request => {

                            const requestValues = Object.values(request).map(val => String(val));
                            return requestValues.includes(String(user.id));
                        });
                    }

                    return !isSelf && !isAlreadyFriend && !isPending && !isBlocked;
                });

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

    const handleViewProfile = (userId) => {
        navigate(`/profile/${userId}`);
    };

    const handleAddFriend = async (userIdToAdd) => {
        try {
            await axios.post(`http://localhost:3001/friendShip/request`,
                { friendId: userIdToAdd },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setDiscoverableUsers(prevUsers => prevUsers.filter(user => user.id !== userIdToAdd));

            setModal({
                isOpen: true,
                title: 'Sent',
                message: "The request was sent successfully",
                type: 'success'
            });
        } catch (error) {
            console.error("Error sending friend request:", error);
            if (error.response?.status === 400) {
                setModal({
                    isOpen: true,
                    title: 'Friend Request Failed',
                    message: "This user is already pending or is already your friend!",
                    type: 'error'
                });
                setDiscoverableUsers(prevUsers => prevUsers.filter(user => user.id !== userIdToAdd));
            }
        }
    };

    const onAddFriendClick = (e, userIdToAdd) => {
        e.stopPropagation();
        handleAddFriend(userIdToAdd).catch(err => console.error("Click error:", err));
    };

    if (isLoading) {
        return (
            <div className="text-center p-5 text-secondary min-vh-100">
                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                Loading...
            </div>
        );
    }

    const visibleDiscoverUsers = discoverableUsers.slice(0, 9);

    return (
        <div className="background pb-3">
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
                                <div className="card shadow-sm border-0 d-flex flex-row align-items-center p-3 friend-card"
                                     onClick={() => handleViewProfile(friend.id)}
                                >

                                    <div className="friend-avatar-wrapper me-3">
                                        <div className="bg-light rounded-circle d-flex justify-content-center align-items-center text-white w-100 h-100 position-absolute top-0 start-0">
                                            <i className="bi bi-person-circle text-secondary user-profile-picture-default"></i>
                                        </div>
                                        <img
                                            src={`users/${friend.id}.png`}
                                            alt={friend.fullName}
                                            className="rounded-circle object-fit-cover position-absolute top-0 start-0 w-100 h-100 z-1"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    </div>

                                    <div className="flex-grow-1 overflow-hidden">
                                        <h6 className="mb-0 fw-semibold text-truncate">
                                            {friend.fullName || 'Unknown User'}
                                        </h6>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewProfile(friend.id);
                                        }}
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
                                <div className="card shadow-sm border-0 d-flex flex-row align-items-center p-3 friend-card"
                                     onClick={() => handleViewProfile(user.id)}
                                >

                                    <div className="friend-avatar-wrapper me-3">
                                        <div className="bg-primary bg-opacity-25 rounded-circle d-flex justify-content-center align-items-center text-primary w-100 h-100 position-absolute top-0 start-0">
                                            <i className="bi bi-person-circle user-profile-picture-default"></i>
                                        </div>
                                        <img
                                            src={`users/${user.id}.png`}
                                            alt={user.fullName}
                                            className="rounded-circle object-fit-cover position-absolute top-0 start-0 w-100 h-100 z-1"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    </div>

                                    <div className="flex-grow-1 overflow-hidden">
                                        <h6 className="mb-0 fw-semibold text-truncate">
                                            {user.fullName || 'Unknown User'}
                                        </h6>
                                    </div>

                                    <button
                                        onClick={(e) => onAddFriendClick(e, user.id)}
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
            <AlertModal
                isOpen={modal.isOpen}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                onClose={closeModal}
            />
        </div>
    );
};

export default FriendsPage;