import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import PostCard from '../../components/postCard/postCard.jsx';
import Navbar from "../../components/navBar/navBar.jsx";
import "../../pages/likedPosts/likedPosts.css"

const LikedPosts = () => {
    const token = localStorage.getItem('token');
    const targetUserId = localStorage.getItem('userId');

    const [likedPosts, setLikedPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

            const postsData = response.data;

            const postsWithUsers = await Promise.all(
                postsData.map(async (post) => {

                    if (!post.idUser) return post;

                    try {

                        const userRes = await axios.get(`http://localhost:3001/users/${post.idUser}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });

                        return {
                            ...post,
                            fullName: userRes.data.fullName
                        };
                    } catch (userError) {
                        console.error(`Erro ao carregar o user ${post.idUser}:`, userError);
                        return post;
                    }
                })
            );


            setLikedPosts(postsWithUsers);

        } catch (error) {
            console.error("Error loading liked posts:", error);
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
                            />
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default LikedPosts;