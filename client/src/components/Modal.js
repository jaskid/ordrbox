import React from "react";

const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
    
      <section className="modal-main">
        <div className="modal-header section row hat floor space end">
          <div className="modal-close-btn" onClick={handleClose}><i className="fas fa-times"></i></div>
        </div>
        <div className="modal-subject">
          {children}
        </div>
      </section>
    </div>
  );
};

export default Modal;