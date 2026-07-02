import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import PostCard from '../../components/postCard/postCard.jsx';
import Navbar from "../../components/navBar/navBar.jsx";
import "../../pages/likedPosts/likedPosts.css"
import AlertModal from "../../components/alertModal/alertModal.jsx";

const LikedPosts = () => {
    const token = localStorage.getItem('token');
    const targetUserId = localStorage.getItem('userId');

    const [likedPosts, setLikedPosts] = useState([]);
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

    const fetchLikedPosts = useCallback(async () => {
        if (!targetUserId || !token) {
            setIsLoading(false);
            console.warn("User ID or token is missing.");
            return;
        }

        try {

            const response = await axios.get(`http://localhost:3001/postLikes/user/${targetUserId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setLikedPosts(response.data);

        } catch (error) {
            console.error("Error loading liked posts:", error);
            setModal({
                isOpen: true,
                title: 'Connection Error',
                message: 'Unable to load your likes. Try refreshing the page.',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    }, [targetUserId, token]);

    useEffect(() => {
        fetchLikedPosts();
    }, [fetchLikedPosts]);


    return (

        <div className="background" >

            <Navbar />

            <div className="d-flex align-items-center justify-content-between mb-4 bg-white p-3 rounded shadow-sm">
                <h5 className="fw-bold text-dark mb-0 d-flex align-items-center">
                    <div className="bg-danger bg-opacity-10 p-2 rounded-circle me-3 d-flex align-items-center justify-content-center like-icon">
                        <i className="bi bi-heart-fill text-danger fs-5"></i>
                    </div>
                    Liked Posts
                </h5>


                {!isLoading && (
                    <span className="badge rounded-pill bg-light text-secondary border px-3 py-2 fs-6">
                            {likedPosts.length} {likedPosts.length === 1 ? 'post' : 'posts'}
                    </span>
                )}
            </div>

            <div className="container mt-4 pb-5 feed-container">


                {isLoading ? (
                    <div className="text-center p-5 text-secondary">
                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                        loading ...
                    </div>
                ) : likedPosts.length === 0 ? (

                    <div className="text-center p-5 bg-white rounded shadow-sm border-0 mt-3">
                        <i className="bi bi-heartbreak fs-1 text-muted mb-2"></i>
                        <h6 className="text-secondary mt-2">No liked posts</h6>
                        <small className="text-muted">You haven't like anything</small>
                    </div>
                ) : (

                    <div className="d-flex flex-column gap-3">
                        {likedPosts.map((post) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                token={token}
                                onPostUpdate={fetchLikedPosts}
                            />
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

export default LikedPosts;