

const alertModel = ({ isOpen, title, message, type, closeModal }) => {
    if (!isOpen) return null;

    const colorButton = type === 'success' ? 'btn-primary' : 'btn-danger';
    const colorText = type === 'success' ? 'text-primary' : 'text-danger';

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px' }}>

                    <div className="modal-header border-0">
                        <h5 className={`modal-title fw-bold ${colorText}`}>{title}</h5>
                        <button type="button" className="btn-close" onClick={closeModal}></button>
                    </div>

                    <div className="modal-body">
                        <p>{message}</p>
                    </div>

                    <div className="modal-footer border-0">
                        <button type="button" className={`btn ${colorButton}`} onClick={closeModal}>
                            OK
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default alertModel;