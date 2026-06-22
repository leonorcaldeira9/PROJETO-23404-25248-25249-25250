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
                className="rounded-circle border friend-avatar-picture"
                onError={() => setHasError(true)}
            />
        );
    }

    return (
        <div
            className="friend-avatar-error d-flex align-items-center justify-content-center rounded-circle border bg-light text-secondary"
            title={friend.fullName}
        >
            <i className="bi bi-person-circle friend-avatar-icon"></i>
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
        <div className="card shadow-sm border-0 p-3 friends-card">
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
                            <Link to={`/profile/${friend.id}`} className="d-flex align-items-center gap-2 text-decoration-none text-dark profile-friend-link">

                                <FriendAvatar friend={friend} />

                                <div>
                                    <p className="mb-0 small fw-semibold text-truncate friend-name">
                                        {friend.fullName}
                                    </p>
                                    <p className="mb-0 text-muted x-small friend-city">
                                        {friend.city || 'No location'}
                                    </p>
                                </div>

                            </Link>

                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FriendsListWidget;

