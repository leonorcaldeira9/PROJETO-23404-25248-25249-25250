import Navbar from "../../components/navBar/navBar.jsx";
import {useCallback, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";


const Notifications = () => {

    const [potentialFriends, setPotentialFriends] = useState([]);
    const [notifications, setNotifications] = useState([]);

    const token = localStorage.getItem('token');
    const currentUserId = localStorage.getItem('userId');
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        if (!token) return;
        try {
            const requestsRes = await axios.get('http://localhost:3001/friendShip/requests/pending', {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Get all requests from database
            const allRequests = requestsRes.data;

            // Filter: keep only requests where the current user is the receiver
            const incomingRequests = allRequests.filter(req =>
                String(req.receiverId) === String(currentUserId)
            );

            // Set only the incoming requests to be shown as notifications
            setNotifications(incomingRequests);

            const usersRes = await axios.get('http://localhost:3001/users', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const friendsRes = await axios.get(`http://localhost:3001/friendShip/user/${currentUserId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const allUsers = usersRes.data;
            const myFriends = friendsRes.data;
            const pendingRequests = requestsRes.data;

            let filteredUsers = allUsers.filter(user => {
                const isSelf = String(user.id) === String(currentUserId);
                const isAlreadyFriend = myFriends.some(friend => String(friend.id) === String(user.id));
                const isPendingRequest = pendingRequests.some(req => String(req.id) === String(user.id));

                return !isSelf && !isAlreadyFriend && !isPendingRequest;
            });

            setPotentialFriends(filteredUsers);

        } catch (error) {
            console.error("Error loading data:", error);
        }
    }, [token, currentUserId]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
    }, [fetchData]);

    const handleSendRequest = async (targetUserId) => {
        try {
            await axios.post('http://localhost:3001/friendShip/request',
                { friendId: targetUserId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Friend request sent!");
            setPotentialFriends(potentialFriends.filter(user => user.id !== targetUserId));
        } catch (error) {
            console.error("Error sending the friend request:", error);
            alert("Error sending request or request already exists.");
        }
    };

    const handleAccept = async (senderId) => {
        try {
            await axios.put('http://localhost:3001/friendShip/update',
                { friendId: senderId, friendshipStatus: 'F' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchData();
        } catch (error) {
            console.error("Error acepting friend request:", error);
        }
    };

    const handleDecline = async (senderId) => {
        try {
            await axios.delete(`http://localhost:3001/friendShip/delete/${senderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (error) {
            console.error("Error declining friend request:", error);
        }
    };

    const onAcceptClick = (e, senderId) => {
        e.stopPropagation();
        handleAccept(senderId).catch(err => console.error("Click error:", err));
    };

    const onDeclineClick = (e, senderId) => {
        e.stopPropagation();
        handleDecline(senderId).catch(err => console.error("Click error:", err));
    };

    const onSendRequestClick = (e, targetUserId) => {
        e.stopPropagation();
        handleSendRequest(targetUserId).catch(err => console.error("Click error:", err));
    };

    return (
        <div className="feed background min-vh-100">
            <Navbar />
            <div className="container mt-4">
                <div className="row">

                    <div className="col-md-7 mb-4">
                        <h4 className="fw-bold mb-3">Notifications</h4>
                        <div className="card shadow-sm border-0 p-3">
                            {notifications.length === 0 ? (
                                <div className="text-center p-4">
                                    <i className="bi bi-bell-slash text-muted mb-2 d-block" style={{fontSize: '2rem'}}></i>
                                    <p className="text-muted mb-0">You have no new notifications.</p>
                                </div>
                            ) : (
                                <div className="list-group list-group-flush">
                                    {notifications.map(notif => (
                                        <div key={notif.id}
                                             className="list-group-item d-flex justify-content-between align-items-center px-2 py-3 bg-light mb-2 rounded border-0"
                                             style={{ cursor: 'pointer' }}
                                             onClick={() => navigate(`/profile/${notif.id}`)}
                                        >

                                            <div className="d-flex align-items-center gap-3 w-100">

                                                <div className="bg-white rounded-circle overflow-hidden d-flex justify-content-center align-items-center flex-shrink-0 shadow-sm" style={{width: '55px', height: '55px'}}>
                                                    <img
                                                        src={`/users/${notif.id}.png`}
                                                        alt="User"
                                                        style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                                        onError={(e) => {
                                                            e.target.classList.add('d-none');
                                                            e.target.nextElementSibling.classList.remove('d-none');
                                                        }}
                                                    />
                                                    <i className="bi bi-person-circle text-secondary d-none" style={{fontSize: '45px'}}></i>
                                                </div>

                                                <div className="w-100">
                                                    <p className="mb-2 text-dark">
                                                        <span className="fw-bold">{notif.fullName}</span> sent you a friend request.
                                                    </p>

                                                    <div className="d-flex gap-2">
                                                        <button className="btn btn-sm btn-primary fw-semibold px-4" onClick={(e) => onAcceptClick(e, notif.id)}>
                                                            Accept
                                                        </button>
                                                        <button className="btn btn-sm btn-secondary fw-semibold px-4" onClick={(e) => onDeclineClick(e, notif.id)}>
                                                            Decline
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-primary rounded-circle ms-2 flex-shrink-0" style={{ width: '10px', height: '10px' }}></div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-md-5 mb-4">
                        <h5 className="fw-bold mb-3 text-secondary">Discover People</h5>
                        <div className="card shadow-sm border-0 p-3">
                            {potentialFriends.length === 0 ? (
                                <p className="text-muted mb-0">No users found.</p>
                            ) : (
                                <ul className="list-group list-group-flush">
                                    {potentialFriends.map(user => (
                                        <li key={user.id}
                                            className="list-group-item d-flex justify-content-between align-items-center px-0 py-2"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => navigate(`/profile/${user.id}`)}
                                        >
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="bg-light rounded-circle overflow-hidden d-flex justify-content-center align-items-center flex-shrink-0" style={{width: '40px', height: '40px'}}>
                                                    <img
                                                        src={`/users/${user.id}.png`}
                                                        alt="User"
                                                        style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                                        onError={(e) => {
                                                            e.target.classList.add('d-none');
                                                            e.target.nextElementSibling.classList.remove('d-none');
                                                        }}
                                                    />
                                                    <i className="bi bi-person-circle text-secondary d-none" style={{fontSize: '30px'}}></i>
                                                </div>
                                                <span className="fw-semibold text-dark">{user.fullName}</span>
                                            </div>
                                            <button
                                                className="btn btn-sm btn-light border fw-semibold text-primary"
                                                onClick={(e) => onSendRequestClick(e, user.id)}
                                                title="Send Friend Request"
                                            >
                                                <i className="bi bi-person-plus-fill"></i> Add
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );

};
export default Notifications;
