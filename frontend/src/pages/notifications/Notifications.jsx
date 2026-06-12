import Navbar from "../../components/navBar/navBar.jsx";
import {useCallback, useEffect, useState} from "react";
import axios from "axios";


const Notifications = () => {

    const [potentialFriends, setPotentialFriends] = useState([]);
    const [notifications, setNotifications] = useState([]);

    const token = localStorage.getItem('token');
    const currentUserId = localStorage.getItem('userId');

    const fetchData = useCallback(async () => {
        if (!token) return;
        try {
            const requestsRes = await axios.get('http://localhost:3001/friendShip/requests/pending', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(requestsRes.data);

            const usersRes = await axios.get('http://localhost:3001/users', {
                headers: { Authorization: `Bearer ${token}` }
            });

            let filteredUsers = usersRes.data.filter(u => String(u.id) !== String(currentUserId));
            setPotentialFriends(filteredUsers);

        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        }
    }, [token, currentUserId]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
    }, [fetchData]);

    const handleSendRequest = async (targetUserId) => {
        try {
            await axios.post('http://localhost:3001/friendShip/request',
                { friendId: targetUserId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Friend request sent!");
            setPotentialFriends(potentialFriends.filter(user => user.id !== targetUserId));
        } catch (error) {
            console.error("Erro ao enviar pedido:", error);
            alert("Error sending request or request already exists.");
        }
    };

    const handleAccept = async (senderId) => {
        try {
            await axios.put('http://localhost:3001/friendShip/update',
                { friendId: senderId, friendshipStatus: 'F' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchData();
        } catch (error) {
            console.error("Erro ao aceitar pedido:", error);
        }
    };

    const handleDecline = async (senderId) => {
        try {
            await axios.delete(`http://localhost:3001/friendShip/delete/${senderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (error) {
            console.error("Erro ao recusar pedido:", error);
        }
    };

    return (
        <div className="feed background min-vh-100">
            <Navbar />
            <div className="container mt-4">
                <div className="row">

                    {/* COLUNA ESQUERDA: NOTIFICAÇÕES (Pedidos Recebidos) */}
                    <div className="col-md-7 mb-4">
                        <h4 className="fw-bold mb-3">Notifications</h4>
                        <div className="card shadow-sm border-0 p-3">
                            {notifications.length === 0 ? (
                                <div className="text-center p-4">
                                    <i className="bi bi-bell-slash text-muted mb-2 d-block" style={{fontSize: '2rem'}}></i>
                                    <p className="text-muted mb-0">You have no new notifications.</p>
                                </div>
                            ) : (
                                <div className="list-group list-group-flush">
                                    {notifications.map(notif => (
                                        <div key={notif.id} className="list-group-item d-flex justify-content-between align-items-center px-2 py-3 bg-light mb-2 rounded border-0">

                                            <div className="d-flex align-items-center gap-3 w-100">
                                                {/* Foto de quem enviou o pedido */}
                                                <div className="bg-white rounded-circle overflow-hidden d-flex justify-content-center align-items-center flex-shrink-0 shadow-sm" style={{width: '55px', height: '55px'}}>
                                                    <img
                                                        src={`/users/${notif.id}.png`}
                                                        alt="User"
                                                        style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                                        onError={(e) => {
                                                            e.target.classList.add('d-none');
                                                            e.target.nextElementSibling.classList.remove('d-none');
                                                        }}
                                                    />
                                                    <i className="bi bi-person-circle text-secondary d-none" style={{fontSize: '45px'}}></i>
                                                </div>

                                                {/* Texto estilo notificação */}
                                                <div className="w-100">
                                                    <p className="mb-2 text-dark">
                                                        <span className="fw-bold">{notif.fullName}</span> sent you a friend request.
                                                    </p>

                                                    {/* Botões Aceitar/Recusar */}
                                                    <div className="d-flex gap-2">
                                                        <button className="btn btn-sm btn-primary fw-semibold px-4" onClick={() => handleAccept(notif.id)}>
                                                            Accept
                                                        </button>
                                                        <button className="btn btn-sm btn-secondary fw-semibold px-4" onClick={() => handleDecline(notif.id)}>
                                                            Decline
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bolinha Azul a indicar "Novo" */}
                                            <div className="bg-primary rounded-circle ms-2 flex-shrink-0" style={{ width: '10px', height: '10px' }}></div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* COLUNA DIREITA: DESCOBRIR PESSOAS (RFG2) */}
                    <div className="col-md-5 mb-4">
                        <h5 className="fw-bold mb-3 text-secondary">Discover People</h5>
                        <div className="card shadow-sm border-0 p-3">
                            {potentialFriends.length === 0 ? (
                                <p className="text-muted mb-0">No users found.</p>
                            ) : (
                                <ul className="list-group list-group-flush">
                                    {potentialFriends.map(user => (
                                        <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="bg-light rounded-circle overflow-hidden d-flex justify-content-center align-items-center flex-shrink-0" style={{width: '40px', height: '40px'}}>
                                                    <img
                                                        src={`/users/${user.id}.png`}
                                                        alt="User"
                                                        style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                                        onError={(e) => {
                                                            e.target.classList.add('d-none');
                                                            e.target.nextElementSibling.classList.remove('d-none');
                                                        }}
                                                    />
                                                    <i className="bi bi-person-circle text-secondary d-none" style={{fontSize: '30px'}}></i>
                                                </div>
                                                <span className="fw-semibold text-dark">{user.fullName}</span>
                                            </div>
                                            <button
                                                className="btn btn-sm btn-light border fw-semibold text-primary"
                                                onClick={() => handleSendRequest(user.id)}
                                                title="Send Friend Request"
                                            >
                                                <i className="bi bi-person-plus-fill"></i> Add
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );

};
export default Notifications;
