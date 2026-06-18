import { useEffect, useState, useCallback } from "react";
import {Link} from "react-router-dom";
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './listFriends.css';

const FriendAvatar = ({ friend }) => {
    const [hasError, setHasError] = useState(false);


    if (friend.id && !hasError) {
        return (
            <img
                src={`/users/${friend.id}.png`}
                alt={friend.fullName}
                className="rounded-circle border"
                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                onError={() => setHasError(true)}
            />
        );
    }

    return (
        <div
            className="d-flex align-items-center justify-content-center rounded-circle border bg-light text-secondary"
            style={{ width: '40px', height: '40px' }}
            title={friend.fullName}
        >
            <i className="bi bi-person-circle" style={{ fontSize: '24px' }}></i>
        </div>
    );
};


const FriendsListWidget = () => {
    const [friends, setFriends] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchFriends = useCallback(async () => {
        const token = localStorage.getItem('token');
        const currentUserId = localStorage.getItem('userId');

        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:3001/friendShip/user/${currentUserId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const filteredFriends = response.data.filter(
                (user) => String(user.id) !== String(currentUserId)
            );

            setFriends(filteredFriends);
        } catch (err) {
            console.error("Error fetching friends list:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFriends();
    }, [fetchFriends]);

    if (isLoading) {
        return <div className="text-muted p-3 text-center small">Loading friends...</div>;
    }

    return (
        <div className="card shadow-sm border-0 p-3 friendsCard">
            <h6 className="fw-bold mb-3">
                <i className="bi bi-people-fill me-2 text-primary"></i>
                Friends ({friends.length})
            </h6>

            <div className="d-flex flex-column gap-3 overflow-y-auto">
                {friends.length === 0 ? (
                    <p className="text-muted small text-center my-2">No friends found.</p>
                ) : (
                    friends.map((friend) => (
                        <div key={friend.id} className="d-flex align-items-center justify-content-between">
                            <Link to={`/profile/${friend.id}`} className="d-flex align-items-center gap-2 text-decoration-none text-dark" style={{ cursor: 'pointer' }}>

                                <FriendAvatar friend={friend} />

                                <div>
                                    <p className="mb-0 small fw-semibold text-truncate friendName">
                                        {friend.fullName}
                                    </p>
                                    <p className="mb-0 text-muted x-small friendCity">
                                        {friend.city || 'No location'}
                                    </p>
                                </div>

                            </Link>
                            <span className="badge bg-success rounded-circle p-1 friendOnline" >
                                <span className="visually-hidden">Online</span>
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};


/*import { useEffect, useState, useCallback } from "react";
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';

const FriendItem = ({ friend }) => {
    const [imageError, setImageError] = useState(false);

    const defaultAvatar = friend.gender === 'F' ? "/users/female.png" : "/users/male.png";
    const photoUrl = `/users/${friend.id}.jpeg`;

    return (
        <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">

                {imageError ? (
                    <img
                        src={defaultAvatar}
                        alt="Default Avatar"
                        className="rounded-circle border"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                    />
                ) : (
                    <img
                        src={photoUrl}
                        alt={friend.fullName}
                        className="rounded-circle border"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        onError={() => setImageError(true)}
                    />
                )}

                <div>
                    <p className="mb-0 small fw-semibold text-truncate" style={{ maxWidth: '140px' }}>
                        {friend.fullName}
                    </p>
                    <p className="mb-0 text-muted x-small" style={{ fontSize: '11px' }}>
                        {friend.city || 'No location'}
                    </p>
                </div>
            </div>

            <span className="badge bg-success rounded-circle p-1" style={{ width: '8px', height: '8px' }}>
                <span className="visually-hidden">Online</span>
            </span>
        </div>
    );
};


const FriendsListWidget = () => {
    const [friends, setFriends] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchFriends = useCallback(async () => {
        const token = localStorage.getItem('token');
        const currentUserId = localStorage.getItem('userId');

        if (!token || !currentUserId) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:3001/friendShip/user/${currentUserId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const filteredFriends = response.data.filter(
                (user) => String(user.id) !== String(currentUserId)
            );

            setFriends(filteredFriends);
        } catch (err) {
            console.error("Error fetching friends list:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFriends();
    }, [fetchFriends]);

    if (isLoading) {
        return <div className="text-muted p-3 text-center small">Loading friends...</div>;
    }

    return (
        <div className="card shadow-sm border-0 p-3" style={{ minHeight: 'calc(100vh - 90px)' }}>
            <h6 className="fw-bold mb-3">
                <i className="bi bi-people-fill me-2 text-primary"></i>
                Friends ({friends.length})
            </h6>

            <div className="d-flex flex-column gap-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {friends.length === 0 ? (
                    <p className="text-muted small text-center my-2">No friends found.</p>
                ) : (
                    friends.map((friend) => (
                        <FriendItem key={friend.id} friend={friend} />
                    ))
                )}
            </div>
        </div>
    );
};
*/


export default FriendsListWidget;

