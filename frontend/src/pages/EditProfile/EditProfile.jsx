import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/navBar/navBar.jsx';

const EditProfile = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    // State holding all user fields, including privacy and maritalStatus
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        loginPassword: '',
        gender: '',
        birthDate: '',
        city: '',
        country: '',
        phoneNumber: '',
        maritalStatus: '', // Ready to be updated by the user UI
        privacy: ''
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    // Fetch user data to pre-fill the form
    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });


                const userData = response.data;


                console.log("DEBUG: Fetched User Data ->", userData);

                // Pre-fill state with existing data.
                setFormData({
                    fullName: userData.fullName || '',
                    email: userData.email || '',
                    loginPassword: '',
                    gender: userData.gender || '',
                    birthDate: userData.birthDate ? userData.birthDate.split('T')[0] : '',
                    city: userData.city || '',
                    country: userData.country || '',
                    phoneNumber: userData.phoneNumber || '',
                    maritalStatus: userData.maritalStatus || '',
                    privacy: userData.privacy || ''
                });

            } catch (error) {
                console.error("Error fetching user data:", error);
                setMessage({ text: 'Erro ao carregar os teus dados.', type: 'danger' });
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [token, userId, navigate]);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ text: '', type: '' });

        const payload = { ...formData };

        if (!payload.loginPassword || payload.loginPassword.trim() === "") {
            delete payload.loginPassword;
        }

        Object.keys(payload).forEach(key => {
            if (payload[key] === "") {
                payload[key] = null;
            }
        });

        try {

            await axios.put(`http://localhost:3001/users/update/${userId}`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            localStorage.setItem('userName', formData.fullName);
            window.dispatchEvent(new Event('perfilAtualizado'));


            setMessage({ text: 'Perfil atualizado com sucesso!', type: 'success' });

            setTimeout(() => {
                navigate(`/profile`);
            }, 1500);

        } catch (error) {

            console.log("DEBUG: Full Error Object ->", error);

            if (error.response) {
                // O backend respondeu com um erro (ex: 400, 404, 500)
                console.log("Status Code:", error.response.status);
                console.log("Error Data:", error.response.data);
                setMessage({ text: 'Erro ao salvar as alterações. Verifica os dados.', type: 'danger' });
            } else if (error.request) {
                // O pedido foi feito, mas não houve qualquer resposta do servidor
                console.log("DEBUG: No response received. Check if backend is running on port 3001.");
                setMessage({ text: 'O servidor não respondeu. Verifica se o backend está ligado.', type: 'danger' });
            } else {
                // Alguma coisa correu mal a montar o próprio pedido
                console.log("DEBUG: Request Setup Error ->", error.message);
                setMessage({ text: 'Erro interno ao preparar o pedido.', type: 'danger' });
            }

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

            <div className="container mt-5 mb-5" style={{ maxWidth: '800px' }}>
                <div className="card shadow-sm border-0 p-4">
                    <h3 className="fw-bold mb-4 text-dark">Edit Profile</h3>

                    {message.text && (
                        <div className={`alert alert-${message.type} small py-2`} role="alert">
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label small fw-bold text-secondary">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                className="form-control"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label small fw-bold text-secondary">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label small fw-bold text-secondary">New Password</label>
                                <input
                                    type="password"
                                    name="loginPassword"
                                    className="form-control"
                                    value={formData.loginPassword}
                                    onChange={handleChange}
                                    placeholder="Leave blank to keep the current"
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label small fw-bold text-secondary d-block mb-2">Gender</label>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="gender"
                                        id="editGenderFemale"
                                        value="F"
                                        checked={formData.gender === 'F'}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="editGenderFemale">F</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="gender"
                                        id="editGenderMale"
                                        value="M"
                                        checked={formData.gender === 'M'}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="editGenderMale">M</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="gender"
                                        id="editGenderOther"
                                        value="O"
                                        checked={formData.gender === 'O'}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="editGenderOther">O</label>
                                </div>
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label small fw-bold text-secondary">Birth Date</label>
                                <input
                                    type="date"
                                    name="birthDate"
                                    className="form-control"
                                    value={formData.birthDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label small fw-bold text-secondary">Marital Status</label>
                                <select
                                    name="maritalStatus"
                                    className="form-select"
                                    value={formData.maritalStatus}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>Select...</option>
                                    <option value="S">Single</option>
                                    <option value="M">Married</option>
                                    <option value="D">Divorced</option>
                                    <option value="W">Widower</option>
                                </select>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label small fw-bold text-secondary">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    className="form-control"
                                    value={formData.country}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label small fw-bold text-secondary">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    className="form-control"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label small fw-bold text-secondary">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    className="form-control"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    pattern="9[0-9]{8}"
                                    required
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-4">
                                <label className="form-label small fw-bold text-secondary">Profile Privacy</label>
                                <select
                                    name="privacy"
                                    className="form-select"
                                    value={formData.privacy}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Select...</option>
                                    <option value="pu">Public (Everyone can see)</option>
                                    <option value="pr">Private (Only friends)</option>
                                </select>
                            </div>
                        </div>

                        <div className="d-flex gap-2 justify-content-end mt-4">
                            <button
                                type="button"
                                className="btn btn-light btn-sm text-secondary px-3"
                                onClick={() => navigate('/profile')}
                                disabled={isSaving}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary btn-sm px-4"
                                disabled={isSaving}
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;