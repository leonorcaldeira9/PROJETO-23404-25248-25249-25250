import 'bootstrap-icons/font/bootstrap-icons.css';
import './alertModal.css'
import { useEffect } from "react";

const AlertModal = ({ isOpen, title, message, type, onClose, onConfirm, confirmText }) => {

    useEffect(() => {
        if (!isOpen || onConfirm) return;

        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [isOpen, onClose, onConfirm]);

    if (!isOpen) return null;

    const isSuccess = type === 'success';
    const colorButton = isSuccess ? 'btn-success' : 'btn-danger';
    const iconClass = isSuccess ? 'bi-check-lg text-success' : 'bi-x-lg text-danger';
    const iconBgClass = isSuccess ? 'icon-bg-success' : 'icon-bg-error';
    const barColorClass = isSuccess ? 'bar-color-success' : 'bar-color-error';

    return (
        <div className="modal show d-block alert-modal-backdrop">
            <div className="modal-dialog modal-dialog-centered modal-sm">
                <div className="modal-content border-0 shadow-lg text-center p-4 alert-modal-content">

                    <div className="d-flex justify-content-center mb-3 mt-2">
                        <div className={`d-flex align-items-center justify-content-center rounded-circle alert-modal-icon-wrapper ${iconBgClass}`}>
                            <i className={`bi ${iconClass} alert-modal-icon`}></i>
                        </div>
                    </div>

                    <div className="modal-body p-0 mb-4">
                        <h4 className="fw-bold text-dark mb-2">{title}</h4>
                        <p className="text-secondary mb-0 alert-modal-text">{message}</p>
                    </div>

                    <div className="modal-footer border-0 p-0">
                        {onConfirm ? (
                            <div className="d-flex gap-2 w-100">
                                <button type="button" className="btn btn-light w-50 py-2 fw-semibold alert-modal-btn" onClick={onClose}>
                                    Cancel
                                </button>
                                <button type="button" className={`btn ${colorButton} w-50 py-2 fw-semibold alert-modal-btn`} onClick={onConfirm}>
                                    {confirmText || "Confirm"}
                                </button>
                            </div>
                        ) : (
                            <button type="button" className={`btn ${colorButton} w-100 py-2 fw-semibold alert-modal-btn`} onClick={onClose}>
                                OK
                            </button>
                        )}
                    </div>

                    {!onConfirm && (
                        <div className={`alert-progress-bar ${barColorClass}`} onClick={onClose} />
                    )}

                </div>
            </div>
        </div>
    );
};

export default AlertModal;