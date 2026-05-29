import { useEffect, useState, useCallback } from "react";
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';

const UserProfileWidget = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUserData = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsLoading(false);
                return;
            }
            const response = await axios.get('http://localhost:3001/users/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setUser(response.data);
            setIsLoading(false);
        } catch (err) {
            console.error("Erro no widget de perfil:", err);
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    if (isLoading) return <div>A carregar painel...</div>;
    if (!user) return <div>Faz login para ver o perfil.</div>;

    // Retorna APENAS o card, sem backgrounds gigantes ou Navbars
    return (
        <div className="card shadow-sm border-0 w-100 mx-auto">
            <div className="banner" style={{ height: '100px', background: '#ccc' }}></div>
            <div className="px-4 position-relative" style={{ marginTop: '-40px' }}>
                <img
                    src={user.gender === 'F' ? "/users/female.png" : "/users/15.jpeg"}
                    alt="perfil"
                    className="rounded-circle border border-white"
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
                <div className="mt-2 pb-3">
                    <h5 className="mb-0 fw-bold">{user.fullName}</h5>
                    <p className="mb-0 text-muted small">{user.email}</p>
                    <p className="mb-0 text-muted x-small">
                        <i className="bi bi-geo-alt-fill text-danger"></i> {user.city}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserProfileWidget;