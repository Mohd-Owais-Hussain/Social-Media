import React from "react";
import "./ConfirmAccountDeletion.scss";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import { axiosClient } from "../../utils/axiosClient";
import { KEY_ACCESS_TOKEN, removeItem } from "../../utils/localStorageManager";
import { useNavigate } from "react-router-dom";

function ConfirmAccountDeletion({ closeModal }) {
  const navigate = useNavigate();

  async function handleDeleteAccount() {
    try {
      await axiosClient.delete("/user/");
      removeItem(KEY_ACCESS_TOKEN);
      navigate("/login");
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="ConfirmAccountDeletion">
      <div className="overlay" onClick={closeModal}></div>
      <div className="confirm-container">
        <div className="header">
          <h4 className="title">Are you sure?</h4>
          <button className="close-btn" onClick={closeModal}>
            <IoClose />
          </button>
        </div>
        <div className="info">
          <p className="warning">
            Are you sure you want to delete your Account? This can't be undone.
          </p>
          <div className="buttons">
            <button className="btn cancel-btn" onClick={closeModal}>
              <div className="btn-icon">
                <IoClose />
              </div>
              <div className="btn-text">Cancel</div>
            </button>
            <button className="btn ok-btn" onClick={handleDeleteAccount}>
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

export default ConfirmAccountDeletion;
