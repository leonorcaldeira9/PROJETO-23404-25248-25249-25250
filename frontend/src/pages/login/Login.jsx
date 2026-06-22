import {Link, useNavigate} from 'react-router-dom';
import './login.css';
import loginImage from '../../assets/loginImage.png';
import logo from '../../assets/logo.png'
import AlertModal from "../../components/alertModal/alertModal.jsx";
import {useState} from "react";
import axios from "axios";

const Login = () => {

    const navigate = useNavigate();

    const [formLoginData, setformLoginData] = useState({
        email: '',
        loginPassword: ''
    });

    const [modal, setModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: ''
    });

    const closeModal = () => {
        setModal({ ...modal, isOpen: false });
    };

    const handleChange = (e) => {
        setformLoginData({
            ...formLoginData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3001/users/login', formLoginData);

            const token = response.data.token;
            const userName = response.data.name;

            localStorage.setItem('token', token);
            localStorage.setItem('userName', userName);
            localStorage.setItem('userId', response.data.id);

            navigate('/feed');
        } catch (error) {
            setModal({
                isOpen: true,
                title: 'Login Failed',
                message: error.response?.data?.error || "Incorrect email or password. Please try again.",
                type: 'error'
            });
        }
    };

    return (
        <div className="login d-flex justify-content-center align-items-center p-5 position-relative min-vh-100">

            <div className="position-absolute top-0 start-0 m-4">
                <Link to={"/login"}>
                    <img
                        src={logo}
                        className="logo img-fluid"
                        alt="Logo do Feicebuque"
                    />
                </Link>
            </div>

            <div className="card shadow-lg p-sm-5 border-0 card-style h-auto">

                <div className="row g-0">
                    <div className="col-md-6 d-none d-md-block">
                        <img
                            src={loginImage}
                            className="img-fluid h-100 w-100 login-image object-fit-cover"
                            alt="Capa do Feicebuque"
                        />
                    </div>

                    <div className="col-md-6">
                        <div className="card-body p-sm-5 d-flex flex-column justify-content-center h-100">

                            <h2 className="text-center loginText mb-2">Login in Feicebuque</h2>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4 mt-5">
                                    <label htmlFor="emailInput" className="form-label fw-bold text-dark">Email</label>
                                    <input
                                        id="emailInput"
                                        type="email"
                                        name="email"
                                        value={formLoginData.email}
                                        onChange={handleChange}
                                        className="form-control form-control-lg bg-light border-0 fs-6"
                                        placeholder="username@gmail.com"
                                        required
                                        autoComplete="email"
                                    />
                                </div>

                                <div className="mb-5">
                                    <label htmlFor="passwordInput" className="form-label fw-bold text-dark">Password</label>
                                    <input
                                        id="passwordInput"
                                        type="password"
                                        name="loginPassword"
                                        value={formLoginData.loginPassword}
                                        onChange={handleChange}
                                        className="form-control form-control-lg bg-light border-0 fs-6"
                                        placeholder="***********"
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary w-50 mb-4 d-block mx-auto">
                                    Sign in
                                </button>

                                <p className="text-center fs-6">Do you not have an account?
                                    <Link to="/register">
                                        <button type="button" className="btn btn-link fs-6">Register here</button>
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <AlertModal
                isOpen={modal.isOpen}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                onClose={closeModal}
            />

        </div>
    );
};

export default Login;