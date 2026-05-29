import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import './feed.css';
import {useCallback, useEffect, useState} from "react";
//import AlertModal from "../../components/alertModal.jsx";
import Navbar from "../../components/navBar.jsx";

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

const PostCard = ({ post, token, formatData}) => {
    const [likes, setLikes] = useState(0);

    const [imageError, setImageError] = useState(false);

    useEffect(() => {

        if (!token) return;

        const fetchLikes = async() => {
            try {
                const idPost = post.id;

                const response = await axios.get(`http://localhost:3001/postLikes/count/${idPost}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const count = response.data[0].likes;
                setLikes(count);
            } catch (error) {
                console.error("Error loading the likes of the post:", error);
            }
        };
        fetchLikes();
    }, [post.id, token]);

    const authorId = post.idUser;
    const photoUrl = `/users/${authorId}.jpeg`;

    return (

        <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">

                <div className="d-flex align-items-center mb-3">

                    <div className="me-2 d-flex align-items-center justify-content-center overflow-hidden rounded-circle bg-light user-profile-picture">
                        {(!authorId || imageError) ? (
                            <i className="bi bi-person-circle text-secondary user-profile-picture-default"></i>
                        ) : (
                            <img
                                src={photoUrl}
                                alt={`Photo of ${post.fullName}`}
                                className="w-100 h-100"
                                style={{ objectFit: 'cover' }}
                                onError={() => setImageError(true)}
                            />
                        )}
                    </div>

                    <div>
                        <h6 className="mb-0 fw-bold">{post.fullName || "Anonymous User"}</h6>
                        <small className="text-muted">{formatData(post.postDate)}</small>
                    </div>
                </div>

                <p className="card-text">{post.postText}</p>

                <hr />

                <div className="d-flex justify-content-between">
                    <div className="d-flex gap-2">
                        <button className="btn btn-light btn-sm">
                            <i className="bi bi-hand-thumbs-up me-1"></i>
                            {likes > 0 ? likes : 'Like'}
                        </button>
                        <button className="btn btn-light btn-sm">
                            <i className="bi bi-chat me-1"></i>
                            Comment
                        </button>
                    </div>
                    <small className="text-muted mt-1">{post.visibility === 'pr' ? 'Private' : 'Public'}</small>
                </div>

                <div className="mt-3">
                    <input type="text" className="form-control form-control-sm rounded-pill bg-light" placeholder="Write a comment..." />
                </div>

            </div>
        </div>

    );
};

const Feed = () => {

    const [posts, setPosts] = useState([]);
    const [newPostText, setNewPostText] = useState("");
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const fetchFeed = useCallback(async () => {

        if (!token) return;

        try {
            const response = await axios.get('http://localhost:3001/posts/feed', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setPosts(response.data);
        } catch (error) {
            console.error("Error loading feed:", error);
        }
    }, [token]);


    const handleCreatePost = async () => {
        if (!newPostText.trim()) return;

        try {
            await axios.post('http://localhost:3001/posts/create', {
                postText: newPostText,
                visibility: 'pr'
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setNewPostText("");
            fetchFeed();

        } catch (error) {
            console.error("Error creating post:", error);
            alert("Não foi possível criar o post. Tenta novamente!");
        }
    };

    useEffect(() => {

        if (!token) {
            navigate('/login');
            return;
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchFeed();

    }, [navigate, token, fetchFeed]);

    return (


        <div className="feed">
            <Navbar />

            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-6">

                        <div className="card shadow-sm border-0 mb-4 p-3">
                            <textarea
                                className="form-control border-0 bg-light mb-2"
                                rows="2"
                                placeholder="What's on your mind?"
                                value={newPostText}
                                onChange={(e) => setNewPostText(e.target.value)}
                            ></textarea>
                            <div className="text-end">
                                <button className="btn btn-primary px-4 rounded-pill" onClick={handleCreatePost}>Post</button>
                            </div>
                        </div>

                        {posts.length === 0 ? (
                            <p className="text-center text-muted">There are no posts in your feed yet.</p>
                        ) : (
                            posts.map((post) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    token={token}
                                    formatData={formatData}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>

        </div>
    );


};


/*import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './feed.css';
import { useCallback, useEffect, useState } from "react";
import Navbar from "../../components/navBar.jsx";

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

const PostCard = ({ post, token }) => {
    const [likes, setLikes] = useState(0);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchLikes = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/postLikes/count/${post.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (isMounted) {
                    const count = response.data[0]['count(*)'];
                    setLikes(count);
                }
            } catch (error) {
                console.error("Error loading the likes of the post:", error);
            }
        };

        fetchLikes();

        return () => {
            isMounted = false;
        };
    }, [post.id, token]);

    const authorId = post.idUser;
    const photoUrl = `/users/${authorId}.jpeg`;

    return (
        <div className="card shadow-sm border-0 mb-4" key={post.id}>
            <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                    <div className="me-2 d-flex align-items-center justify-content-center overflow-hidden rounded-circle bg-light user-profile-picture">
                        {(!authorId || imageError) ? (
                            <i className="bi bi-person-circle text-secondary user-profile-picture-default"></i>
                        ) : (
                            <img
                                src={photoUrl}
                                alt={`Photo of ${post.fullName}`}
                                className="w-100 h-100"
                                style={{ objectFit: 'cover' }}
                                onError={() => setImageError(true)}
                            />
                        )}
                    </div>

                    <div>
                        <h6 className="mb-0 fw-bold">{post.fullName || "Anonymous User"}</h6>
                        <small className="text-muted">{formatData(post.postDate)}</small>
                    </div>
                </div>

                <p className="card-text">{post.postText}</p>
                <hr />

                <div className="d-flex justify-content-between">
                    <div className="d-flex gap-2">
                        <button className="btn btn-light btn-sm">
                            <i className="bi bi-hand-thumbs-up me-1"></i>
                            {likes > 0 ? likes : 'Like'}
                        </button>
                        <button className="btn btn-light btn-sm">
                            <i className="bi bi-chat me-1"></i>
                            Comment
                        </button>
                    </div>
                    <small className="text-muted mt-1">{post.visibility === 'pr' ? 'Private' : 'Public'}</small>
                </div>

                <div className="mt-3">
                    <input type="text" className="form-control form-control-sm rounded-pill bg-light" placeholder="Write a comment..." />
                </div>
            </div>
        </div>
    );
};

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [newPostText, setNewPostText] = useState("");
    const navigate = useNavigate();

    const fetchFeed = useCallback(async () => {
        const savedToken = localStorage.getItem('token');
        if (!savedToken) return;

        try {
            const response = await axios.get('http://localhost:3001/posts/feed', {
                headers: {
                    Authorization: `Bearer ${savedToken}`
                }
            });
            setPosts(response.data);
        } catch (error) {
            console.error("Error loading feed:", error);
        }
    }, []);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');

        if (!savedToken) {
            navigate('/login');
        } else {
            fetchFeed();
        }
    }, [navigate, fetchFeed]);

    const handleCreatePost = async () => {
        if (!newPostText.trim()) return;

        const savedToken = localStorage.getItem('token');

        try {
            await axios.post('http://localhost:3001/posts/create', {
                postText: newPostText,
                visibility: 'pr'
            }, {
                headers: {
                    Authorization: `Bearer ${savedToken}`
                }
            });

            setNewPostText("");
            fetchFeed();

        } catch (error) {
            console.error("Error creating post:", error);
            alert("Não foi possível criar o post. Tenta novamente!");
        }
    };

    return (
        <div className="feed">
            <Navbar />


            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-6">

                        <div className="card shadow-sm border-0 mb-4 p-3">
                            <textarea
                                className="form-control border-0 bg-light mb-2"
                                rows="2"
                                placeholder="What's on your mind?"
                                value={newPostText}
                                onChange={(e) => setNewPostText(e.target.value)}
                            ></textarea>
                            <div className="text-end">
                                <button className="btn btn-primary px-4 rounded-pill" onClick={handleCreatePost}>Post</button>
                            </div>
                        </div>

                        {posts.length === 0 ? (
                            <p className="text-center text-muted">There are no posts in your feed yet.</p>
                        ) : (
                            posts.map((post) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    token={localStorage.getItem('token')}
                                />
                            ))
                        )}
                    </div>


                </div>
            </div>
        </div>
    );
};*/


/*import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './feed.css';
import { useCallback, useEffect, useState } from "react";
import Navbar from "../../components/navBar.jsx";

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

const PostCard = ({ post, token }) => {
    const [likes, setLikes] = useState(0);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        let isMounted = true;

        axios.get(`http://localhost:3001/postLikes/count/${post.id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                if (isMounted) {
                    const count = response.data[0]['count(*)'];
                    setLikes(count);
                }
            })
            .catch((error) => {
                console.error("Error loading the likes of the post:", error);
            });

        return () => {
            isMounted = false;
        };
    }, [post.id, token]);

    const authorId = post.idUser;
    const photoUrl = `/users/${authorId}.jpeg`;

    return (
        <div className="card shadow-sm border-0 mb-4" key={post.id}>
            <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                    <div className="me-2 d-flex align-items-center justify-content-center overflow-hidden rounded-circle bg-light user-profile-picture">
                        {(!authorId || imageError) ? (
                            <i className="bi bi-person-circle text-secondary user-profile-picture-default"></i>
                        ) : (
                            <img
                                src={photoUrl}
                                alt={`Photo of ${post.fullName}`}
                                className="w-100 h-100"
                                style={{ objectFit: 'cover' }}
                                onError={() => setImageError(true)}
                            />
                        )}
                    </div>

                    <div>
                        <h6 className="mb-0 fw-bold">{post.fullName || "Anonymous User"}</h6>
                        <small className="text-muted">{formatData(post.postDate)}</small>
                    </div>
                </div>

                <p className="card-text">{post.postText}</p>
                <hr />

                <div className="d-flex justify-content-between">
                    <div className="d-flex gap-2">
                        <button className="btn btn-light btn-sm">
                            <i className="bi bi-hand-thumbs-up me-1"></i>
                            {likes > 0 ? likes : 'Like'}
                        </button>
                        <button className="btn btn-light btn-sm">
                            <i className="bi bi-chat me-1"></i>
                            Comment
                        </button>
                    </div>
                    <small className="text-muted mt-1">{post.visibility === 'pr' ? 'Private' : 'Public'}</small>
                </div>

                <div className="mt-3">
                    <input type="text" className="form-control form-control-sm rounded-pill bg-light" placeholder="Write a comment..." />
                </div>
            </div>
        </div>
    );
};

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [newPostText, setNewPostText] = useState("");
    const navigate = useNavigate();

    const fetchFeed = useCallback(() => {
        const savedToken = localStorage.getItem('token');
        if (!savedToken) return;

        axios.get('http://localhost:3001/posts/feed', {
            headers: {
                Authorization: `Bearer ${savedToken}`
            }
        })
            .then((response) => {
                setPosts(response.data);
            })
            .catch((error) => {
                console.error("Error loading feed:", error);
            });
    }, []);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');

        if (!savedToken) {
            navigate('/login');
        } else {
            fetchFeed();
        }
    }, [navigate, fetchFeed]);

    const handleCreatePost = async () => {
        if (!newPostText.trim()) return;

        const savedToken = localStorage.getItem('token');

        try {
            await axios.post('http://localhost:3001/posts/create', {
                postText: newPostText,
                visibility: 'pr'
            }, {
                headers: {
                    Authorization: `Bearer ${savedToken}`
                }
            });

            setNewPostText("");
            fetchFeed();
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Não foi possível criar o post. Tenta novamente!");
        }
    };

    return (
        <div className="feed">
            <Navbar />

            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-6">
                        <div className="card shadow-sm border-0 mb-4 p-3">
                            <textarea
                                className="form-control border-0 bg-light mb-2"
                                rows="2"
                                placeholder="What's on your mind?"
                                value={newPostText}
                                onChange={(e) => setNewPostText(e.target.value)}
                            ></textarea>
                            <div className="text-end">
                                <button className="btn btn-primary px-4 rounded-pill" onClick={handleCreatePost}>Post</button>
                            </div>
                        </div>

                        {posts.length === 0 ? (
                            <p className="text-center text-muted">There are no posts in your feed yet.</p>
                        ) : (
                            posts.map((post) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    token={localStorage.getItem('token')}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};*/

export default Feed;