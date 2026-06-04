import { useNavigate } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './listOptions.css';

const OptionsListWidget = () => {

    const navigate = useNavigate();

    const menuOptions = [
        { id: 1, name: 'Profile', icon: 'bi-person-fill text-success', path: '/profile' },
        { id: 2, name: 'Friends', icon: 'bi-people-fill text-info', path: '/friends' },
        { id: 3, name: 'Posts Liked', icon: 'bi-heart-fill text-danger', path: '/saved' },
        { id: 4, name: 'Comments Liked', icon: 'bi-heart text-danger', path: '/saved' },
        { id: 5, name: 'My Comments', icon: 'bi-chat-fill text-secondary', path: '/saved' },
        { id: 6, name: 'Settings', icon: 'bi-gear-fill text-secondary', path: '/settings' }
    ];

    return (
        <div className="card shadow-sm border-0 p-3">
            <h6 className="fw-bold mb-3">
                Options
            </h6>

            <div className="d-flex flex-column rowGap">
                {menuOptions.map((option) => (

                    <button
                        key={option.id}
                        onClick={() => navigate(option.path)}
                        className="btn btn-light d-flex align-items-center gap-3 w-100 text-start border-0 option-btn">
                        <i className={`bi ${option.icon} fs-5`}></i>
                        <span className="fw-semibold">{option.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default OptionsListWidget;