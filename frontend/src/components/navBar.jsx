import {Link, useNavigate} from 'react-router-dom';
import './navBar.css';
import {useState} from "react";
import logo from "../assets/logo.png";
import 'bootstrap-icons/font/bootstrap-icons.css';

const Navbar = () => {

    const [name] = useState(() => localStorage.getItem('userName') || '');
    const [userId] = useState(() => localStorage.getItem('userId') || '');

    const [imageError, setImageError] = useState(false);

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');

        navigate('/login');
    };

    const photoUrl = `/users/${userId}.jpeg`;

    return (
        <nav className="navbar sticky-top navbar-light bg-light shadow-sm">
            <div className="container-fluid justify-content-start">

                <div className="d-flex align-items-center">

                    <Link to={"/feed"} className="navbar-brand d-flex align-items-center">
                        <img
                            src={logo}
                            className="logo img-fluid"
                            alt="Logo do Feicebuque"
                        />
                    </Link>

                    <div className="ms-3 d-flex align-items-center">
                        <h4 className="mb-0 text-secondary">Welcome, {name}!</h4>
                    </div>
                </div>


                <div className="d-flex align-items-center gap-1 position-absolute top-50 end-0 translate-middle-y pe-3">
                    <button className="btn btn-light border-0 rounded-circle d-flex align-items-center justify-content-center nav-icons">
                        <i className="bi bi-bell fs-3 text-secondary"></i>
                    </button>

                    <button
                        className="btn btn-light border-0 rounded-circle  d-flex align-items-center justify-content-center nav-icons">
                        <i className="bi bi-gear fs-3 text-secondary"></i>
                    </button>

                    <button onClick={handleLogout}
                        className="btn btn-light border-0 rounded-circle  d-flex align-items-center justify-content-center nav-icons">
                        <i className="bi bi-box-arrow-left fs-3 text-secondary"></i>
                    </button>

                    <button className="btn btn-light border-0 p-0 rounded-circle ms-3 d-flex align-items-center justify-content-center shadow-sm user-profile-picture">

                        {(!userId || imageError) ? (
                            <i className="bi bi-person-circle text-secondary user-profile-picture-default" onClick={() => navigate('/profile')}></i>
                        ) : (
                            <img
                                onClick={() => navigate('/profile')}
                                src={photoUrl}
                                alt={`Photo of ${name}`}
                                className="w-100 h-100"
                                style={{ objectFit: 'cover' }}
                                onError={() => setImageError(true)}
                            />
                        )}

                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

