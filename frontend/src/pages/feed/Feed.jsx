import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import './feed.css';
import {useCallback, useEffect, useState} from "react";
//import AlertModal from "../../components/alertModal.jsx";
import Navbar from "../../components/navBar/navBar.jsx";
import ListFriends from "../../components/listFriends/listFriends.jsx";
import ListOptions from "../../components/listOptions/listOptions.jsx";
import PostCard from "../../components/postCard/postCard.jsx";

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
            <Navbar/>

            <div className="container mt-4">

                <div className="row gx-5">

                    <div className="col-md-3">
                        <ListOptions></ListOptions>
                    </div>

                    <div className="col-md-6 justify-content-center">

                        <div className="card shadow-sm border-0 mb-4 p-3">
                            <textarea
                                className="form-control border-0 bg-light mb-2"
                                rows="2"
                                placeholder="What's on your mind?"
                                value={newPostText}
                                onChange={(e) => setNewPostText(e.target.value)}
                            ></textarea>
                            <div className="text-end">
                                <button className="btn btn-primary px-4" onClick={handleCreatePost}>
                                    <i className="bi bi-send-plus-fill me-2"></i>
                                    Post
                                </button>
                            </div>
                        </div>

                        {posts.length === 0 ? (
                            <p className="text-center text-muted">There are no posts in your feed yet.</p>
                        ) : (
                            posts.map((post) => (
                                <PostCard key={post.id} post={post} token={token} />
                            ))
                        )}
                    </div>

                    <div className="col-md-3">
                        <ListFriends></ListFriends>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Feed;