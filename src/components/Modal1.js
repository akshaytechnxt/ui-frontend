import React from 'react';
import './Modal1.css';

const Modal1 = ({ children, shown, close }) => {
  return shown ? (
    <div className="modal-backdrop" onClick={() => close()}>
      <div
        className="modal-content"
        onClick={(e) => {
          e.stopPropagation(); // Do not close modal if anything inside modal content is clicked
        }}
      >
        {children}
      </div>
    </div>
  ) : null;
};

export default Modal1; 