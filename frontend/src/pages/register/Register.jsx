import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import './register.css';
import {useState} from "react";
import logo from "../../assets/logo.png";
import AlertModal from "../../components/alertModal/alertModal.jsx";

const Register = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        loginPassword: '',
        gender: '',
        birthDate: '',
        //maritalStatus: '',
        city: '',
        country: '',
        phoneNumber: ''
    });

    const [modal, setModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3001/users/create', formData);

            setModal({
                isOpen: true,
                title: 'Success!',
                message: response.data.message || 'Account successfully created! You can now log in..',
                type: 'success'
            });

        } catch (error) {
            if (error.response && error.response.status === 400) {

                setModal({
                    isOpen: true,
                    title: 'Fill up all fields!',
                    message: error.response.data.message || 'Please fill in all fields correctly.',
                    type: 'error'
                });

            } else {


                setModal({
                    isOpen: true,
                    title: 'Error!',
                    message: 'Unable to connect to the server. Try again later..',
                    type: 'error'
                });
            }
        }
    };

    const handleCloseModal = () => {
        setModal({ ...modal, isOpen: false });

        if (modal.type === 'success') {
            navigate('/login');
        }
    };

    return (
        <div className="register d-flex justify-content-center align-items-center p-5 position-relative min-vh-100">

            <div className="position-absolute top-0 start-0 m-4">
                <Link to={"/login"}>
                    <img
                        src={logo}
                        className="logo img-fluid"
                        alt="Logo do Feicebuque"
                    />
                </Link>
            </div>

            <div className="card shadow-lg p-sm-5 border-0 card-style h-auto" >

                <h2 className="text-center">Create an Account</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <label htmlFor="fullNameInput" className="form-label fw-bold text-dark">Full Name</label>
                        <input
                            id="fullNameInput"
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="form-control form-control-lg bg-light border-0 fs-6"
                            placeholder="John Doe"
                            required
                            autoComplete="name"
                        />
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-2">
                            <label htmlFor="emailInput" className="form-label fw-bold text-dark">Email</label>
                            <input
                                id="emailInput"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-control form-control-lg bg-light border-0 fs-6"
                                placeholder="username@gmail.com"
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className="col-md-6 mb-2">
                            <label htmlFor="passwordInput" className="form-label fw-bold text-dark">Password</label>
                            <input
                                id="passwordInput"
                                type="password"
                                name="loginPassword"
                                value={formData.loginPassword}
                                onChange={handleChange}
                                className="form-control form-control-lg bg-light border-0 fs-6"
                                placeholder="***********"
                                required
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    <div className="row">

                        <div className="col-md-6 mb-2">
                            <span className="form-label fw-bold text-dark d-block mb-2">Gender</span>

                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="gender"
                                    id="genderFemale"
                                    value="F"
                                    checked={formData.gender === 'F'}
                                    onChange={handleChange}
                                />
                                <label className="form-check-label" htmlFor="genderFemale">
                                    Female
                                </label>
                            </div>

                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="gender"
                                    id="genderMale"
                                    value="M"
                                    checked={formData.gender === 'M'}
                                    onChange={handleChange}
                                />
                                <label className="form-check-label" htmlFor="genderMale">
                                    Male
                                </label>
                            </div>

                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="gender"
                                    id="genderOther"
                                    value="O"
                                    checked={formData.gender === 'O'}
                                    onChange={handleChange}
                                />
                                <label className="form-check-label" htmlFor="genderOther">
                                    Other
                                </label>
                            </div>
                        </div>

                        <div className="col-md-6 mb-2">
                            <label htmlFor="birthdateInput" className="form-label fw-bold text-dark">Birthdate</label>
                            <input
                                id="birthdateInput"
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                                className="form-control form-control-lg bg-light border-0 fs-6"
                                required
                                autoComplete="birthdate"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm mb-2">
                            <label htmlFor="countryInput" className="form-label fw-bold text-dark">Country</label>
                            <input
                                id="countryInput"
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="form-control form-control-lg bg-light border-0 fs-6"
                                placeholder="Portugal"
                                required
                                autoComplete="country-name"
                            />
                        </div>

                        <div className="col-sm mb-2">
                            <label htmlFor="cityInput" className="form-label fw-bold text-dark">City</label>
                            <input
                                id="cityInput"
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="form-control form-control-lg bg-light border-0 fs-6"
                                placeholder="Lisboa"
                                required
                                autoComplete="address-level2"
                            />
                        </div>

                        <div className="col-sm mb-5">
                            <label htmlFor="phoneInput" className="form-label fw-bold text-dark">Phone Number</label>
                            <input
                                id="phoneInput"
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="form-control form-control-lg bg-light border-0 fs-6"
                                placeholder="9xxxxxxxx"
                                pattern="9[0-9]{8}"
                                required
                                autoComplete="tel"
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-50 mb-2 d-block mx-auto">
                        Create Account
                    </button>

                    <p className="text-center fs-6">Do you have an account?
                        <Link to="/login">
                            <button type="button" className="btn btn-link fs-6">Login</button>
                        </Link>
                    </p>
                </form>
            </div>

            <AlertModal
                isOpen={modal.isOpen}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                onClose={handleCloseModal}
            />

        </div>
    );
};

export default Register;