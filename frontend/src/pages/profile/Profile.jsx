//import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import './profile.css';
import {useCallback, useEffect, useState} from "react";
//import {useEffect, useState} from "react";
//import logo from "../../assets/logo.png";
//import AlertModal from "../../components/alertModal.jsx";
import 'bootstrap-icons/font/bootstrap-icons.css';
//import Feed from "../feed/Feed.jsx";
import Navbar from "../../components/navBar/navBar.jsx";
import {useNavigate, useParams} from "react-router-dom";
import PostCard from "../../components/postCard/postCard.jsx";

const Profile= ()=>{
    /*const [userData, setUserData] = useState(null);

    // State to handle the loading screen while waiting for the database
    const [isLoading, setIsLoading] = useState(true);


    const fetchuserData =async ()=>{
        try{
            const token=localStorage.getItem('token')
            if(!token){
                console.error("Token not found");
                setIsLoading(false)
                return;
            }

            const response=await axios.get('http://localhost:3001/users/15', {
                headers: {
                    Authorization:`Bearer ${token}`
                }
            });


            setUserData(response.data);
        }catch (err){
            console.error("No user data");
            console.error("server error", err.response?.status, err.response?.data);
            console.error("error message:", err.message);
        }finally {
            setIsLoading(false);
        }
    };
    useEffect(()=>{
        fetchuserData();
    },[]);

    if (isLoading){
        return <div>Loading...</div>
    }

    return(<div className = "background">
        <Navbar/>

        <div className = "card shadow-sm border-0 mt-5 w-100 mx-auto" style={{ maxWidth: '800px' }}>


            <div className = "banner"></div>

            <div className="px-4">

                <img src="../../../public/users/15.jpeg" alt="foto de perfil" className="userCircle"/>

                <div className="mt-3 pb-4">
                    <h3 className="mb-0 fw-bold mx-2">{userData?.fullName || 'undefined'}</h3>
                    <p className="mb-0 text-muted">Full stack programmer</p>
                </div>

            </div>
        </div>
    </div>);
    */

    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const { id } = useParams();

    const [imageError, setImageError] = useState(false);

    const userId = localStorage.getItem('userId');
    //const photoUrl = `/users/${userId}.jpeg`;
    const token = localStorage.getItem('token');

    const profileUserId = id || userId;
    const photoUrl = `/users/${profileUserId}.png`;

    const [posts, setPosts] = useState([]);
    const [relation, setRelation] = useState('none');

    const fetchUserData = useCallback(async () => {
        //const token = localStorage.getItem('token');
        //const userId = localStorage.getItem('userId');
        if (!token || !userId) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:3001/users/${profileUserId}`, {
                headers: {Authorization: `Bearer ${token}`}
            });
            setUserData(response.data);
        } catch (err) {
            console.error("Error loading user data:", err);
        } finally {
            setIsLoading(false);
        }
    }, [profileUserId, token, userId]);

    const fetchUserPosts = useCallback(async () => {
        //const token = localStorage.getItem('token');
        //const userId = localStorage.getItem('userId');

        if (!token || !userId) return;

        try {
            const response = await axios.get(`http://localhost:3001/posts/user/${profileUserId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts(response.data);
        } catch (err) {
            console.error("Error loading user posts:", err);
        }
    }, [profileUserId, token, userId]);

    const fetchRelationship = useCallback(async () => {

        console.log("A executar fetchRelationship. Visitando:", profileUserId, "Meu ID:", userId);

        if (profileUserId === userId) return;

        try {

            const response = await axios.get(`http://localhost:3001/friendShip/status/${profileUserId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });


            console.log("O que o teu Backend respondeu na amizade:", response.data);

            setRelation(response.data.friendshipStatus || 'none');
        } catch (err) {
            console.error("Erro ao verificar relação de amizade:", err);
        }
    }, [profileUserId, token, userId]);

    useEffect(() => {
        //const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchUserData();
        fetchUserPosts();
        fetchRelationship();
    }, [navigate, fetchUserData, fetchUserPosts, fetchRelationship, token]);

    useEffect(() => {
        setImageError(false);
    }, [profileUserId]);

    if (isLoading) {
        return <div>Loading...</div>;
    }



    return (
        <div className="background">
            <Navbar/>


            <div className="card shadow-sm border-0 mt-5 w-100 mx-auto profile-card">
                <div className="banner"></div>
                <div className="px-4 ">
                    <div className="userCircle d-flex align-items-center justify-content-center overflow-hidden bg-light shadow-sm position-absolute">
                        {(!profileUserId || imageError) ? (
                            <i className="bi bi-person-circle text-secondary w-100 h-100 d-flex align-items-center justify-content-center default-icon"></i>
                        ) : (
                            <img
                                src={photoUrl}
                                alt="foto de perfil"
                                className="w-100 h-100"
                                style={{ objectFit: 'cover' }}
                                onError={() => setImageError(true)}
                            />
                        )}
                    </div>

                    <div className="pb-4 sub-card">
                        <h3 className="mb-0 fw-bold mx-2">{userData?.fullName || 'Anonymous'}</h3>
                        <p className="mb-0 text-muted mx-2">{}</p>
                    </div>

                    {/* --- BOTÕES DE RELAÇÃO / AMIZADE --- */}

                    <div className="mt-2 mx-2">
                        {String(profileUserId) === String(userId) ? (
                            // Cenário A: É o meu próprio perfil (Dono)
                            <button className="btn btn-outline-secondary btn-sm">
                                <i className="bi bi-gear-fill me-1"></i> Editar Perfil
                            </button>
                        ) : (
                            // Cenário B: Estou a visitar o perfil de outra pessoa (Verifica o State 'relation')
                            <>
                                {relation === 'F' && (
                                    <button className="btn btn-success btn-sm align-items-center gap-1" disabled>
                                        <i className="bi bi-check-lg"></i> Amigos
                                    </button>
                                )}

                                {relation === 'B' && (
                                    <button className="btn btn-warning btn-sm align-items-center gap-1" disabled>
                                        <i className="bi bi-clock-history"></i> Pedido Pendente
                                    </button>
                                )}

                                {relation === 'P' || relation === 'none' && (
                                    <button className="btn btn-primary btn-sm align-items-center gap-1">
                                        <i className="bi bi-person-plus-fill"></i> Adicionar Amigo
                                    </button>
                                )}


                            </>
                        )}
                    </div>
                    {/* --------------------------------- */}

                    <div className="w-100 mx-auto mt-4" style={{ maxWidth: '800px' }}>
                        <h5 className="mb-3 text-secondary px-2">Timeline</h5>

                        {posts.length === 0 ? (
                            <div className="card shadow-sm border-0 p-4 text-center">
                                <p className="text-muted mb-0">You haven't posted anything yet.</p>
                            </div>
                        ) : (
                            posts.map((post) => {
                                const postCompleto = {
                                    ...post,
                                    fullName: post.fullName || userData?.fullName
                                };

                                return (
                                    <PostCard
                                        key={postCompleto.id}
                                        post={postCompleto}
                                        token={token}
                                    />
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );



};





export default Profile;
