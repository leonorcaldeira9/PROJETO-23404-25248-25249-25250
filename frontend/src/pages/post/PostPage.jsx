import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import Navbar from "../../components/navBar/navBar.jsx";
import PostCard from "../../components/postCard/postCard.jsx";
import "../../pages/post/PostPage.css";


const formatData = (dataString) => {
    if (!dataString) return '';

    const data = new Date(dataString);
    const day = String(data.getDate()).padStart(2, '0');
    const month = String(data.getMonth() + 1).padStart(2, '0');
    const year = data.getFullYear();
    const hours = String(data.getHours()).padStart(2, '0');
    const minutes = String(data.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} at ${hours}:${minutes}`;
};

const PostPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const token = localStorage.getItem('token');

    const fetchPostData = useCallback(async () => {
        if (!token) return;
        try {

            const postRes = await axios.get(`http://localhost:3001/posts/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPost(postRes.data);


            const commentsRes = await axios.get(`http://localhost:3001/comments/post/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComments(commentsRes.data);
        } catch (error) {
            console.error("Error fetching post data:", error);
            navigate('/feed');
        } finally {
            setIsLoading(false);
        }
    }, [id, token, navigate]);

    useEffect(() => {

        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchPostData();
    }, [fetchPostData]);

    const handleCreateComment = async () => {
        if (!newComment.trim()) return;
        try {
            await axios.post('http://localhost:3001/comments/create', {
                idPost: id,
                commentText: newComment,
                parentCommentId: null
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setNewComment("");
            fetchPostData();

        } catch (error) {
            alert("Error creating comment.");
        }
    };


    const topLevelComments = comments.filter(c => !c.parentCommentId);
    const getReplies = (parentId) => comments.filter(c => c.parentCommentId === parentId);

    if (isLoading) return <div className="text-center mt-5 text-muted">Loading...</div>;

    const CommentItem = ({ comment, allComments }) => {
        const replies = allComments.filter(c => c.parentCommentId === comment.id);

        return (
            <div className={`comment-thread ${replies.length === 0 ? 'no-replies' : ''} mb-4`}>


                <div className="d-flex gap-3 position-relative z-1 bg-white pb-1">
                    <img src={`/users/${comment.idUser}.png`} alt="User" className="rounded-circle border" style={{width: '40px', height: '40px', objectFit: 'cover'}} onError={(e) => e.target.src='/users/default.png'}/>
                    <div>
                        <div className="d-flex align-items-center gap-2">
                            <span className="fw-bold fs-6">{comment.fullName}</span>
                            <span className="text-muted small">{formatData(post.postDate)}</span>
                        </div>
                        <p className="mb-1 text-dark">{comment.commentText}</p>
                        <div className="d-flex gap-3 text-muted small fw-semibold">
                            <span style={{cursor: 'pointer'}}><i className="bi bi-hand-thumbs-up me-1"></i>0</span>
                            <span className="text-primary" style={{cursor: 'pointer'}}>Reply</span>
                        </div>
                    </div>
                </div>

                {replies.length > 0 && (
                    <div className="comment-replies mt-3">
                        {replies.map(reply => (
                            <CommentItem key={reply.id} comment={reply} allComments={allComments} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="feed background min-vh-100">
            <Navbar />
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-8">

                        <button className="btn btn-link text-decoration-none text-dark fw-bold mb-3 px-0" onClick={() => navigate(-1)}>
                            <i className="bi bi-arrow-left me-2"></i> Back
                        </button>


                        {post && <PostCard post={post} token={token} viewComments={true} />}

                        <div className="card shadow-sm border-0 p-4 mt-2 mb-5">
                            <h5 className="fw-bold mb-4">Comments ({comments.length})</h5>


                            <div className="d-flex gap-3 align-items-center mb-5">
                                <img src={`/users/${localStorage.getItem('userId')}.png`} alt="You" className="rounded-circle" style={{width: '40px', height: '40px', objectFit: 'cover'}} onError={(e) => e.target.src='/users/default.png'}/>
                                <input
                                    type="text"
                                    className="form-control rounded-pill bg-light border-0"
                                    placeholder="Add a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <button className="btn btn-primary rounded-pill px-4" onClick={handleCreateComment}>
                                    Send
                                </button>
                            </div>


                            <div className="d-flex flex-column gap-1">
                                {topLevelComments.length === 0 ? (
                                    <p className="text-muted text-center">No comments yet. Be the first!</p>
                                ) : (
                                    topLevelComments.map(comment => (
                                        <CommentItem key={comment.id} comment={comment} allComments={comments} />
                                    ))
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostPage;