import { useEffect, useState, useCallback, useRef } from "react";
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
    const [myImageError, setMyImageError] = useState(false);

    const [replyingTo, setReplyingTo] = useState(null);
    const commentInputRef = useRef(null);

    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editCommentText, setEditCommentText] = useState("");

    const token = localStorage.getItem('token');
    const currentUserId = localStorage.getItem('userId');

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

    const handleReplyClick = (comment) => {
        setReplyingTo({ id: comment.id, fullName: comment.fullName });
        if (commentInputRef.current) {
            commentInputRef.current.focus();
        }
    };

    const handleCreateComment = async () => {
        if (!newComment.trim()) return;
        try {
            await axios.post('http://localhost:3001/comments/create', {
                idPost: id,
                commentText: newComment,
                parentCommentId: replyingTo ? replyingTo.id : null
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setNewComment("");
            setReplyingTo(null);
            fetchPostData();

        } catch (error) {
            console.error("Error creating comment:", error);
        }
    };

    const handleDeleteComment = async (commentId) => {

        if(!window.confirm("Are you sure you want to delete your comment?")) return;

        try {
          await axios.delete(`http://localhost:3001/comments/delete/${commentId}`, {
             headers: {Authorization: `Bearer ${token}`}
          });

          fetchPostData();
        }  catch (error) {
            console.error("Error deleting comment: ", error);
        }
    };

    const handleUpdateComment = async (commentId) => {

        try {
            await axios.put(`http://localhost:3001/comments/update/${commentId}`, {
                commentText: editCommentText
            }, {
                headers: {Authorization: `Bearer ${token}`}
            });

            setEditingCommentId(null);
            setEditCommentText("");
            fetchPostData();
        }  catch (error) {
            console.error("Error updating comment: ", error);
        }
    }


    const topLevelComments = comments.filter(c => !c.parentCommentId);

    if (isLoading) return <div className="text-center mt-5 text-muted">Loading...</div>;

    const CommentItem = (comment, allComments, isReply = false) => {
        const replies = allComments.filter(c => c.parentCommentId === comment.id);

        return (
            <div key={comment.id} className={`comment-thread pb-3 pt-1 ${isReply ? 'comment-reply-item' : ''}`}>
                <div className="d-flex gap-3 position-relative z-1 bg-white pb-1">
                    <div className="d-flex align-items-center justify-content-center overflow-hidden rounded-circle bg-light user-profile-picture flex-shrink-0">

                        <img
                            src={`/users/${comment.idUser}.png`}
                            alt="User"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'block';
                            }}
                        />
                        <i className="bi bi-person-circle text-secondary user-profile-picture-default" style={{display: 'none'}}></i>
                    </div>

                    <div className="w-100">
                        <div className="d-flex align-items-center gap-2">
                            <span className="fw-bold fs-6">{comment.fullName}</span>
                            <span className="text-muted small">{formatData(post.postDate)}</span>
                        </div>

                        {editingCommentId === comment.id ? (
                            <div className="d-flex align-items-center gap-2 mb-2 mt-1 position-relative">
                                <input
                                    type="text"
                                    className="form-control form-control-sm rounded-pill bg-white border-secondary-subtle"
                                    value={editCommentText}
                                    onChange={(e) => setEditCommentText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleUpdateComment(comment.id);
                                        if (e.key === 'Escape') setEditingCommentId(null);
                                    }}
                                    autoFocus
                                />
                                <button
                                    className="btn btn-sm btn-primary rounded-pill px-3"
                                    onClick={() => handleUpdateComment(comment.id)}
                                >
                                    Save
                                </button>
                                <button
                                    className="btn btn-sm btn-light border rounded-pill px-3"
                                    onClick={() => setEditingCommentId(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <p className="mb-1 text-dark text-break">{comment.commentText}</p>
                        )}

                        <div className="d-flex gap-3 text-muted small fw-semibold">
                            <span style={{cursor: 'pointer'}}><i className="bi bi-hand-thumbs-up me-1"></i>0</span>

                            <span
                                className="text-primary"
                                style={{cursor: 'pointer'}}
                                onClick={() => handleReplyClick(comment)}
                            >
                            Reply
                        </span>

                        {comment.idUser === Number(currentUserId) && (

                            <>
                                <span
                                    className="text-secondary"
                                    style={{cursor: 'pointer'}}
                                    onClick={() => {
                                        setEditingCommentId(comment.id);
                                        setEditCommentText(comment.commentText);
                                        setReplyingTo(null);
                                    }}
                                    title="Edit comment"
                                >
                                    Edit
                                </span>

                                <span
                                    className="text-danger"
                                    style={{cursor: 'pointer'}}
                                    onClick={() => handleDeleteComment(comment.id)}
                                    title="Delete comment"
                                >
                                    Delete
                                </span>
                            </>
                        )}
                        </div>
                    </div>
                </div>

                {replyingTo && replyingTo.id === comment.id && (
                    <div className="d-flex gap-3 align-items-center mt-2 mb-3 ms-5 ps-2">
                        <div className="d-flex align-items-center justify-content-center overflow-hidden rounded-circle bg-light flex-shrink-0" style={{width: '32px', height: '32px'}}>
                            <img
                                src={`/users/${currentUserId}.png`}
                                alt="You"
                                style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                onError={(e) => e.target.style.display = 'none'}
                            />
                        </div>
                        <div className="w-100 position-relative">
                            <input
                                type="text"
                                className="form-control form-control-sm rounded-pill bg-white border-secondary-subtle pe-5"
                                placeholder="Add a reply..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleCreateComment();
                                }}
                                autoFocus
                            />
                            <button
                                className="btn btn-sm position-absolute top-50 end-0 translate-middle-y"
                                onClick={() => setReplyingTo(null)}
                                title="Cancel"
                            >
                                <i className="bi bi-x-circle-fill text-muted"></i>
                            </button>
                        </div>
                    </div>
                )}

                {replies.length > 0 && (
                    <div className="comment-replies mt-3">
                        {replies.map(reply => CommentItem(reply, allComments, true))}
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

                            {!replyingTo && (
                                <div className="d-flex gap-3 align-items-center mb-5">
                                    <div className="d-flex align-items-center justify-content-center overflow-hidden rounded-circle bg-light user-profile-picture flex-shrink-0">
                                        {myImageError ? (
                                            <i className="bi bi-person-circle text-secondary user-profile-picture-default"></i>
                                        ) : (
                                            <img
                                                src={`/users/${currentUserId}.png`}
                                                alt="You"
                                                onError={() => setMyImageError(true)}
                                            />
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm rounded-pill bg-light"
                                        placeholder="Add a comment..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleCreateComment();
                                        }}
                                    />
                                    <button className="btn btn-primary rounded-pill px-4" onClick={handleCreateComment}>
                                        <i className="bi bi-send-plus-fill"></i>
                                    </button>
                                </div>
                            )}

                            <div className="d-flex flex-column gap-1">
                                {topLevelComments.length === 0 ? (
                                    <p className="text-muted text-center">No comments yet. Be the first!</p>
                                ) : (
                                    topLevelComments.map(comment => CommentItem(comment, comments, false))
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