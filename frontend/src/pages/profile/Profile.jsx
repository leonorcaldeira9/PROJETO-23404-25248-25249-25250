// //import {Link, useNavigate} from 'react-router-dom';
// import axios from 'axios';
// import './profile.css';
// import {useCallback, useEffect, useState} from "react";
// //import {useEffect, useState} from "react";
// //import logo from "../../assets/logo.png";
// //import AlertModal from "../../components/alertModal.jsx";
// import 'bootstrap-icons/font/bootstrap-icons.css';
// //import Feed from "../feed/Feed.jsx";
// import Navbar from "../../components/navBar/navBar.jsx";
// import {Link, useNavigate, useParams} from "react-router-dom";
// import PostCard from "../../components/postCard/postCard.jsx";
//
// const Profile= ()=>{
//     /*const [userData, setUserData] = useState(null);
//
//     // State to handle the loading screen while waiting for the database
//     const [isLoading, setIsLoading] = useState(true);
//
//
//     const fetchuserData =async ()=>{
//         try{
//             const token=localStorage.getItem('token')
//             if(!token){
//                 console.error("Token not found");
//                 setIsLoading(false)
//                 return;
//             }
//
//             const response=await axios.get('http://localhost:3001/users/15', {
//                 headers: {
//                     Authorization:`Bearer ${token}`
//                 }
//             });
//
//
//             setUserData(response.data);
//         }catch (err){
//             console.error("No user data");
//             console.error("server error", err.response?.status, err.response?.data);
//             console.error("error message:", err.message);
//         }finally {
//             setIsLoading(false);
//         }
//     };
//     useEffect(()=>{
//         fetchuserData();
//     },[]);
//
//     if (isLoading){
//         return <div>Loading...</div>
//     }
//
//     return(<div className = "background">
//         <Navbar/>
//
//         <div className = "card shadow-sm border-0 mt-5 w-100 mx-auto" style={{ maxWidth: '800px' }}>
//
//
//             <div className = "banner"></div>
//
//             <div className="px-4">
//
//                 <img src="../../../public/users/15.jpeg" alt="foto de perfil" className="userCircle"/>
//
//                 <div className="mt-3 pb-4">
//                     <h3 className="mb-0 fw-bold mx-2">{userData?.fullName || 'undefined'}</h3>
//                     <p className="mb-0 text-muted">Full stack programmer</p>
//                 </div>
//
//             </div>
//         </div>
//     </div>);
//     */
//
//     const [userData, setUserData] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const navigate = useNavigate();
//
//     const { id } = useParams();
//
//     const [imageError, setImageError] = useState(false);
//
//     const userId = localStorage.getItem('userId');
//     //const photoUrl = `/users/${userId}.jpeg`;
//     const token = localStorage.getItem('token');
//
//     const profileUserId = id || userId;
//     const photoUrl = `/users/${profileUserId}.png`;
//
//     const [posts, setPosts] = useState([]);
//     const [relation, setRelation] = useState('none');
//
//     const fetchUserData = useCallback(async () => {
//         //const token = localStorage.getItem('token');
//         //const userId = localStorage.getItem('userId');
//         if (!token || !userId) {
//             setIsLoading(false);
//             return;
//         }
//
//         try {
//             const response = await axios.get(`http://localhost:3001/users/${profileUserId}`, {
//                 headers: {Authorization: `Bearer ${token}`}
//             });
//             setUserData(response.data);
//         } catch (err) {
//             console.error("Error loading user data:", err);
//         } finally {
//             setIsLoading(false);
//         }
//     }, [profileUserId, token, userId]);
//
//     const fetchUserPosts = useCallback(async () => {
//         //const token = localStorage.getItem('token');
//         //const userId = localStorage.getItem('userId');
//
//         if (!token || !userId) return;
//
//         try {
//             const response = await axios.get(`http://localhost:3001/posts/user/${profileUserId}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setPosts(response.data);
//         } catch (err) {
//             console.error("Error loading user posts:", err);
//         }
//     }, [profileUserId, token, userId]);
//
//     const fetchRelationship = useCallback(async () => {
//
//         console.log("A executar fetchRelationship. Visitando:", profileUserId, "Meu ID:", userId);
//
//         if (profileUserId === userId) return;
//
//         try {
//
//             const response = await axios.get(`http://localhost:3001/friendShip/status/${profileUserId}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//
//
//             console.log("O que o teu Backend respondeu na amizade:", response.data);
//
//             setRelation(response.data.friendshipStatus || 'none');
//         } catch (err) {
//             console.error("Erro ao verificar relação de amizade:", err);
//         }
//     }, [profileUserId, token, userId]);
//
//     const handleSendRequest = async () => {
//         try {
//             await axios.post('http://localhost:3001/friendShip/request',
//                 { friendId: profileUserId },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
//
//             setRelation('P');
//
//         } catch (error) {
//             console.error("Erro ao enviar pedido:", error);
//             alert("Erro ao enviar pedido de amizade. Tenta novamente.");
//         }
//     };
//
//     useEffect(() => {
//         //const token = localStorage.getItem('token');
//         if (!token) {
//             navigate('/login');
//             return;
//         }
//         // eslint-disable-next-line react-hooks/set-state-in-effect
//         fetchUserData();
//         fetchUserPosts();
//         fetchRelationship();
//     }, [navigate, fetchUserData, fetchUserPosts, fetchRelationship, token]);
//
//     useEffect(() => {
//
//         // eslint-disable-next-line react-hooks/set-state-in-effect
//         setImageError(false);
//     }, [profileUserId]);
//
//     if (isLoading) {
//         return <div>Loading...</div>;
//     }
//
//
//
//     return (
//         <div className="background">
//             <Navbar/>
//
//
//             <div className="card shadow-sm border-0 mt-5 w-100 mx-auto profile-card">
//                 <div className="banner"></div>
//                 <div className="px-4 ">
//                     <div className="userCircle d-flex align-items-center justify-content-center overflow-hidden bg-light shadow-sm position-absolute">
//                         {(!profileUserId || imageError) ? (
//                             <i className="bi bi-person-circle text-secondary w-100 h-100 d-flex align-items-center justify-content-center default-icon"></i>
//                         ) : (
//                             <img
//                                 src={photoUrl}
//                                 alt="foto de perfil"
//                                 className="w-100 h-100"
//                                 style={{ objectFit: 'cover' }}
//                                 onError={() => setImageError(true)}
//                             />
//                         )}
//                     </div>
//
//                     <div className="pb-4 sub-card">
//                         <h3 className="mb-0 fw-bold mx-2">{userData?.fullName || 'Anonymous'}</h3>
//                         <p className="mb-0 text-muted mx-2">{}</p>
//                     </div>
//
//                     {/* --- BOTÕES DE RELAÇÃO / AMIZADE --- */}
//
//                     <div className="mt-2 mx-2">
//                         {String(profileUserId) === String(userId) ? (
//
//                                 <Link to="/EditProfile">
//                                     <button className="btn btn-outline-secondary btn-sm">
//                                         <i className="bi bi-gear-fill me-1"></i> Edit Profile
//                                     </button>
//                                 </Link>
//                         ) : (
//                             // Cenário B: Estou a visitar o perfil de outra pessoa (Verifica o State 'relation')
//                             <>
//                                 {relation === 'F' && (
//                                     <button className="btn btn-success btn-sm d-flex align-items-center gap-1" disabled>
//                                         <i className="bi bi-check-lg"></i> Amigos
//                                     </button>
//                                 )}
//
//                                 {relation === 'P' && (
//                                     <button className="btn btn-warning btn-sm d-flex align-items-center gap-1" disabled>
//                                         <i className="bi bi-clock-history"></i> Pedido Pendente
//                                     </button>
//                                 )}
//
//                                 {relation === 'none' && (
//                                     <button
//                                         className="btn btn-primary btn-sm d-flex align-items-center gap-1"
//                                         onClick={handleSendRequest}
//                                     >
//                                         <i className="bi bi-person-plus-fill"></i> Adicionar Amigo
//                                     </button>
//                                 )}
//
//                                 {/* Opcional: Se 'B' for bloqueado ou outro estado, podes gerir aqui */}
//                                 {relation === 'B' && (
//                                     <button className="btn btn-danger btn-sm d-flex align-items-center gap-1" disabled>
//                                         <i className="bi bi-slash-circle"></i> Indisponível
//                                     </button>
//                                 )}
//                             </>
//                         )}
//                     </div>
//                     {/* --------------------------------- */}
//
//                     <div className="w-100 mx-auto mt-4" style={{ maxWidth: '800px' }}>
//                         <h5 className="mb-3 text-secondary px-2">Timeline</h5>
//
//                         {posts.length === 0 ? (
//                             <div className="card shadow-sm border-0 p-4 text-center">
//                                 <p className="text-muted mb-0">You haven't posted anything yet.</p>
//                             </div>
//                         ) : (
//                             posts.map((post) => {
//                                 const postCompleto = {
//                                     ...post,
//                                     fullName: post.fullName || userData?.fullName
//                                 };
//
//                                 return (
//                                     <PostCard
//                                         key={postCompleto.id}
//                                         post={postCompleto}
//                                         token={token}
//                                     />
//                                 );
//                             })
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
//
//
//
// };
//
//
//
//
//
// export default Profile;


import axios from 'axios';
import './profile.css';
import { useCallback, useEffect, useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Navbar from "../../components/navBar/navBar.jsx";
import { Link, useNavigate, useParams } from "react-router-dom";
import PostCard from "../../components/postCard/postCard.jsx";

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const { id } = useParams();

    const [imageError, setImageError] = useState(false);

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    const profileUserId = id || userId;
    const photoUrl = `/users/${profileUserId}.png`;

    const [posts, setPosts] = useState([]);

    // O state da relação (none, P, F, B)
    const [relation, setRelation] = useState('none');

    const fetchUserData = useCallback(async () => {
        if (!token || !userId) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:3001/users/${profileUserId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserData(response.data);
        } catch (err) {
            console.error("Error loading user data:", err);
        } finally {
            setIsLoading(false);
        }
    }, [profileUserId, token, userId]);

    const fetchUserPosts = useCallback(async () => {
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
        if (profileUserId === userId) return;

        try {
            const response = await axios.get(`http://localhost:3001/friendShip/status/${profileUserId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRelation(response.data.friendshipStatus || 'none');
        } catch (err) {
            console.error("Error verifying relationship:", err);
        }
    }, [profileUserId, token, userId]);

    // 1. FUNÇÃO: ENVIAR PEDIDO DE AMIZADE
    const handleSendRequest = async () => {
        try {
            await axios.post('http://localhost:3001/friendShip/request',
                { friendId: profileUserId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRelation('P'); // Muda para "Pendente"
        } catch (error) {
            console.error("Error sending friend request:", error);
            alert("Error sending request.");
        }
    };

    // 2. FUNÇÃO: REMOVER AMIGO ou CANCELAR PEDIDO
    const handleRemoveFriend = async () => {
        try {
            // ⚠️ Troquei as aspas simples (') por backticks (`) e mudei para axios.delete
            await axios.delete(`http://localhost:3001/friendShip/delete/${profileUserId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setRelation('none'); // Atualiza o ecrã instantaneamente
        } catch (error) {
            console.error("Error removing friend:", error);
            alert("Error trying to unfriend.");
        }
    };

    const handleBlockUser = async () => {
        const confirmBlock = window.confirm("Are you sure you want to block this user?");
        if (!confirmBlock) return;

        try {
            await axios.put('http://localhost:3001/friendShip/update',
                { friendId: profileUserId, friendshipStatus: 'B' },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("Bloqueio enviado ao backend!");
            setRelation('B');

        } catch (error) {
            console.error("Error blocking user:", error);
            alert("Error trying to block user.");
        }
    };

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchUserData();
        fetchUserPosts();
        fetchRelationship();
    }, [navigate, fetchUserData, fetchUserPosts, fetchRelationship, token]);

    useEffect(() => {
        setImageError(false);
    }, [profileUserId]);

    if (isLoading) {
        return <div className="text-center mt-5">Loading profile...</div>;
    }

    return (
        <div className="background">
            <Navbar />

            <div className="card shadow-sm border-0 mt-5 w-100 mx-auto profile-card" style={{ maxWidth: '800px' }}>
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

                    <div className="pb-4 sub-card" style={{ paddingTop: '60px' }}>
                        <h3 className="mb-0 fw-bold mx-2">{userData?.fullName || 'Anonymous'}</h3>
                        <p className="mb-0 text-muted mx-2">
                            <i className="bi bi-geo-alt-fill me-1"></i>
                            {userData?.city || 'Location unknown'}
                        </p>
                    </div>

                    {/* --- BOTÕES DE RELAÇÃO / AMIZADE --- */}
                    <div className="mt-2 mx-2 d-flex gap-2 mb-4">
                        {String(profileUserId) === String(userId) ? (
                            <Link to="/edit-profile">
                                <button className="btn btn-outline-secondary btn-sm fw-semibold">
                                    <i className="bi bi-gear-fill me-1"></i> Edit Profile
                                </button>
                            </Link>
                        ) : (
                            <>
                                {/* SE SÃO AMIGOS */}
                                {relation === 'F' && (
                                    <>
                                        <button className="btn btn-success btn-sm fw-semibold d-flex align-items-center gap-1" disabled>
                                            <i className="bi bi-check-lg"></i> Friends
                                        </button>
                                        <button className="btn btn-outline-danger btn-sm fw-semibold d-flex align-items-center gap-1" onClick={handleRemoveFriend}>
                                            <i className="bi bi-person-x-fill"></i> Unfriend
                                        </button>
                                        <button className="btn btn-light border btn-sm text-danger d-flex align-items-center gap-1" onClick={handleBlockUser}>
                                            <i className="bi bi-slash-circle"></i> Block
                                        </button>
                                    </>
                                )}

                                {/* SE HÁ PEDIDO PENDENTE */}
                                {relation === 'P' && (
                                    <>
                                        <button className="btn btn-warning text-dark btn-sm fw-semibold d-flex align-items-center gap-1" disabled>
                                            <i className="bi bi-clock-history"></i> Pending Request
                                        </button>
                                        <button className="btn btn-outline-danger btn-sm fw-semibold d-flex align-items-center gap-1" onClick={handleRemoveFriend}>
                                            <i className="bi bi-x-circle-fill"></i> Cancel
                                        </button>
                                    </>
                                )}

                                {/* SE NÃO HÁ RELAÇÃO NENHUMA */}
                                {relation === 'none' && (
                                    <>
                                        <button className="btn btn-primary btn-sm fw-semibold d-flex align-items-center gap-1" onClick={handleSendRequest}>
                                            <i className="bi bi-person-plus-fill"></i> Add Friend
                                        </button>
                                        <button className="btn btn-light border btn-sm text-danger d-flex align-items-center gap-1" onClick={handleBlockUser}>
                                            <i className="bi bi-slash-circle"></i> Block
                                        </button>
                                    </>
                                )}

                                {/* SE ESTÁ BLOQUEADO */}
                                {relation === 'B' && (
                                    <button className="btn btn-danger btn-sm fw-semibold d-flex align-items-center gap-1" disabled>
                                        <i className="bi bi-slash-circle"></i> Blocked User
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                    {/* --------------------------------- */}

                    <hr className="text-muted opacity-25" />

                    <div className="w-100 mx-auto mt-4" style={{ maxWidth: '800px' }}>
                        <h5 className="mb-3 fw-bold text-dark px-2">Timeline</h5>

                        {posts.length === 0 ? (
                            <div className="card shadow-sm border-0 p-5 text-center bg-light">
                                <i className="bi bi-journal-x fs-1 text-muted mb-2"></i>
                                <p className="text-muted fw-semibold mb-0">No posts available.</p>
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-3 pb-5">
                                {posts.map((post) => {
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
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;