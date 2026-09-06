import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
// import './Modal.css';

const Modal = ({ isOpen, onClose, title, coords, children }) => {
  // Escuchar la tecla Escape para cerrar automáticamente
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Si el estado es falso, no renderiza absolutamente nada
  if (!isOpen) return null;

  // Usamos createPortal para inyectar el popup en el body y que sobresalga de cualquier contenedor
  return createPortal(
    <div className="modal-popup-overlay" onClick={onClose}>
      <div 
        className="modal-popup-container"
        style={{
          top: `${coords.top}px`,
          left: `${coords.left}px`
        }}
        onClick={(e) => e.stopPropagation()} // Evita que se cierre al hacer clic dentro
      >
        <header className="modal-popup-header">
          <h2>{title || "Asignar Roles"}</h2>
          <button className="modal-popup-close-btn" onClick={onClose}>&times;</button>
        </header>
        
        <div className="modal-popup-content">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
