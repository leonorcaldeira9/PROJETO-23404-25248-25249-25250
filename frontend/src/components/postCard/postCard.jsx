import axios from 'axios';
import {useCallback, useEffect, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import "../../components/postCard/postCard.css";

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

const PostCard = ({ post, token, viewComments = false}) => {
    const [likes, setLikes] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [comments, setComments] = useState([]);

    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const currentUserId = localStorage.getItem('userId');
    const navigate = useNavigate();

    const fetchLikes = useCallback(async() => {
        if (!token) return;

        try {
            const idPost = post.id;

            const response = await axios.get(`http://localhost:3001/postLikes/count/${idPost}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const count = response.data[0].likes;
            setLikes(count);

            const responseUsers = await axios.get(`http://localhost:3001/postLikes/usersLikePost/${post.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const iLikedIt = responseUsers.data.some(user => String(user.idUser || user.id) === String(currentUserId));
            setHasLiked(iLikedIt);
        } catch (error) {
            console.error("Error loading the likes of the post:", error);
        }
    }, [post.id, token, currentUserId]);

    const fetchComments = useCallback(async () => {
        if (!token) return;
        try {
            const response = await axios.get(`http://localhost:3001/comments/post/${post.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComments(response.data);

        } catch (error) {
            console.error("Error loading comments:", error);
        }
    }, [post.id, token]);


    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchLikes();
        fetchComments();
        //fetchPostImage();
    }, [fetchLikes, fetchComments ]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleEditPost = () => {
        setIsOpen(false);
        //('/edit-profile');
    };

    const handleLike = async () => {
        const previousHasLiked = hasLiked;
        const previousLikes = likes;

        setHasLiked(!hasLiked);
        setLikes(hasLiked ? likes - 1 : likes + 1);

        try {
            if (hasLiked) {
                await axios.delete(`http://localhost:3001/postLikes/delete/${post.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`http://localhost:3001/postLikes/add`, {
                    idPost: post.id
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        } catch (error) {
            setHasLiked(previousHasLiked);
            setLikes(previousLikes);
            console.error("Erro ao alterar o like:", error);
        }
    };

    const handleDeletePost = async (postId) => {

        if(!window.confirm("Are you sure you want to delete your post?")) return;

        try {
            await axios.delete(`http://localhost:3001/posts/delete/${postId}`, {
                headers: {Authorization: `Bearer ${token}`}
            });
            window.location.reload();

        }  catch (error) {
            console.error("Error deleting comment: ", error);
        }
    };

    const authorId = post.idUser;
    const photoUrl = `/users/${authorId}.png`;

    return (

        <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">

                <div className="d-flex align-items-center justify-content-between mb-3">

                    <Link to={`/profile/${authorId}`}
                          className="d-flex align-items-center text-decoration-none text-dark cursor-pointer">

                        <div
                            className="me-2 d-flex align-items-center justify-content-center overflow-hidden rounded-circle bg-light user-profile-picture">
                            {(!authorId || imageError) ? (
                                <i className="bi bi-person-circle text-secondary user-profile-picture-default"></i>
                            ) : (
                                <img
                                    src={photoUrl}
                                    alt={`Photo of ${post.fullName}`}
                                    onError={() => setImageError(true)}
                                />
                            )}
                        </div>

                        <div>
                            <h6 className="mb-0 fw-bold">{post.fullName || "Anonymous User"}</h6>
                            <small className="text-muted">{formatData(post.postDate)}</small>
                        </div>

                    </Link>

                    {Number(authorId) === Number(currentUserId) && (


                        <div className="dropdown" ref={menuRef}>
                            <button
                                onClick={toggleMenu}
                                className="btn border-0 d-flex align-items-center justify-content-center">

                                <i className="bi bi-three-dots-vertical fs-5 text-muted dots-button-style"></i>
                            </button>

                            {isOpen && (
                                <div className="dropdown-menu show position-absolute end-0 mt-2 shadow-sm" style={{ minWidth: '200px' }}>

                                    <Link
                                        to="/EditProfile"
                                        className="dropdown-item d-flex align-items-center text-decoration-none"
                                        onClick={handleEditPost}
                                    >
                                        <i className="bi bi-pencil-square me-2 text-secondary"></i> Edit Post
                                    </Link>

                                    <div className="dropdown-divider"></div>

                                    <button
                                        className="dropdown-item d-flex align-items-center text-danger"
                                        onClick={() => {
                                            handleDeletePost(post.id);
                                            setIsOpen(false);
                                        }}
                                    >
                                        <i className="bi bi-trash me-2"></i> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                </div>

                <p className="card-text">{post.postText}</p>


                <hr/>
                <div className="d-flex justify-content-between">
                    <div className="d-flex gap-2">
                        <button
                            // className={`btn btn-sm fw-semibold ${hasLiked ? 'text-primary' : 'text-secondary btn-light'}`}
                            // style={hasLiked ? { backgroundColor: '#e7f0fd' } : {}}
                            // onClick={handleLike}
                            className={`btn btn-sm fw-semibold ${
                                hasLiked
                                    ? 'text-primary btn-liked' 
                                    : 'text-secondary btn-light' 
                            }`}
                            onClick={handleLike}
                        >
                            <i className={`me-1 ${hasLiked ? 'bi bi-hand-thumbs-up-fill' : 'bi bi-hand-thumbs-up'}`}></i>
                            {likes > 0 ? likes : 'Like'}
                        </button>
                        {!viewComments && (
                            <button
                                className="btn btn-light btn-sm text-secondary fw-semibold"
                                onClick={(e) => { e.stopPropagation(); navigate(`/post/${post.id}`); }}
                            >
                                <i className="bi bi-chat me-1"></i>
                                {comments.length > 0 ? comments.length : 'Comment'}
                                

                            </button>
                        )}
                    </div>
                    <small className="text-muted mt-1">{post.visibility === 'pr' ? 'Private' : 'Public'}</small>
                </div>

            </div>
        </div>
    );
};

export default PostCard;