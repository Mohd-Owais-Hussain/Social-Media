import React from "react";
import "./ConfirmDeletion.scss";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";

function ConfirmDeletion({ closeModal, warning, deleteFunction }) {
  return (
    <div className="ConfirmDeletion">
      <div className="overlay" onClick={closeModal}></div>
      <div className="confirm-container">
        <div className="header">
          <h4 className="title">Are you sure?</h4>
          <button className="close-btn" onClick={closeModal}>
            <IoClose />
          </button>
        </div>
        <div className="info">
          <p className="warning">{warning}</p>
          <div className="buttons">
            <button className="btn cancel-btn" onClick={closeModal}>
              <div className="btn-icon">
                <IoClose />
              </div>
              <div className="btn-text">Cancel</div>
            </button>
            <button
              className="btn ok-btn"
              onClick={() => {
                closeModal();
                deleteFunction();
              }}
            >
              <div className="btn-icon">
                <FaCheck />
              </div>
              <div className="btn-text">Ok</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeletion;
