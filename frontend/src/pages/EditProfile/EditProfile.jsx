import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/navBar/navBar.jsx';

const EditProfile = () => {
    // 1. As nossas "gavetas" de memória (States)
    const [fullName, setFullName] = useState('');
    const [bio, setBio] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    // 2. Carregar os dados atuais do utilizador mal a página abre
    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchCurrentData = async () => {
            try {
                // Vai buscar os dados ao teu endpoint do Node
                const response = await axios.get(`http://localhost:3001/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });


                setFullName(response.data.fullName || '');
                setBio(response.data.bio || '');
            } catch (error) {
                console.error("Erro ao carregar dados do perfil:", error);
                setMessage({ text: 'Erro ao carregar os teus dados.', type: 'danger' });
            } finally {
                setIsLoading(false);
            }
        };

        fetchCurrentData();
    }, [token, userId, navigate]);


    const handleSubmit = async (e) => {
        e.preventDefault(); // Impede a página de fazer refresh sozinha
        setIsSaving(true);
        setMessage({ text: '', type: '' });

        try {
            await axios.put(`http://localhost:3001/users/update/${userId}`,
                { fullName, bio },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage({ text: 'Perfil atualizado com sucesso!', type: 'success' });

            // Espera 1.5 segundos para o utilizador ler a mensagem e manda-o de volta para o perfil
            setTimeout(() => {
                navigate(`/profile`);
            }, 1500);

        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
            setMessage({ text: 'Erro ao salvar as alterações.', type: 'danger' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="text-center mt-5">A carregar dados do perfil...</div>;
    }

    return (
        <div className="background">
            <Navbar />

            <div className="container mt-5" style={{ maxWidth: '600px' }}>
                <div className="card shadow-sm border-0 p-4">
                    <h3 className="fw-bold mb-4 text-dark">Editar Perfil</h3>

                    {/* Alertas visuais de sucesso ou erro */}
                    {message.text && (
                        <div className={`alert alert-${message.type} small py-2`} role="alert">
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Campo: Nome Completo */}
                        <div className="mb-3">
                            <label className="form-label small fw-bold text-secondary">Nome Completo</label>
                            <input
                                type="text"
                                className="form-control"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)} // Atualiza o State em tempo real
                                required
                            />
                        </div>

                        {/* Campo: Biografia */}
                        <div className="mb-4">
                            <label className="form-label small fw-bold text-secondary">Biografia / Cargo</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)} // Atualiza o State em tempo real
                                placeholder="Conta um pouco sobre ti..."
                            ></textarea>
                        </div>

                        {/* Botões de Ação */}
                        <div className="d-flex gap-2 justify-content-end">
                            <button
                                type="button"
                                className="btn btn-light btn-sm text-secondary px-3"
                                onClick={() => navigate('/profile')}
                                disabled={isSaving}
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary btn-sm px-4"
                                disabled={isSaving}
                            >
                                {isSaving ? 'A guardar...' : 'Guardar Alterações'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;