import React, { useEffect, useState } from "react";
import "./UpdateProfile.scss";
import dummyUserImg from "../../assets/user.png";
import ConfirmDeletion from "../confirm-account-deletion/ConfirmDeletion";
import { useSelector, useDispatch } from "react-redux";
import { showToast, updateMyProfile } from "../../redux/slices/appConfigSlice";
import { useNavigate } from "react-router-dom";
import { axiosClient } from "../../utils/axiosClient";
import { KEY_ACCESS_TOKEN, removeItem } from "../../utils/localStorageManager";
import { TOAST_SUCCESS } from "../../App";

function UpdateProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const myProfile = useSelector((state) => state.appConfigReducer.myProfile);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [userImg, setUserImg] = useState("");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    setName(myProfile?.name || "");
    setBio(myProfile?.bio || "");
    setUserImg(myProfile?.avatar?.url);
  }, [myProfile]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        if (fileReader.readyState === fileReader.DONE) {
          setUserImg(fileReader.result);
        }
      };
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(
      updateMyProfile({
        name,
        bio,
        userImg,
      })
    );
  }

  async function handleDeleteAccount() {
    try {
      await axiosClient.delete("/user/");
      dispatch(
        showToast({
          type: TOAST_SUCCESS,
          message: "Account deleted",
        })
      );
      removeItem(KEY_ACCESS_TOKEN);
      navigate("/");
    } catch (e) {
      console.log("Error -> ", e);
    }
  }

  return (
    <div className="UpdateProfile">
      <div className="container">
        <div className="left-part">
          <div className="input-user-img">
            <label htmlFor="inputImg" className="labelImg">
              <img src={userImg ? userImg : dummyUserImg} alt={name} />
            </label>
            <input
              className="inputImg"
              id="inputImg"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div className="right-part">
          <form onSubmit={handleSubmit}>
            <input
              value={name}
              type="text"
              placeholder="Your Name"
              onChange={(e) => setName(e.target.value)}
            />
            <input
              value={bio}
              type="text"
              placeholder="Your Bio"
              onChange={(e) => setBio(e.target.value)}
            />
            <input
              type="submit"
              className="btn-primary"
              onClick={handleSubmit}
            />
          </form>
          <button
            className="delete-account btn-primary"
            onClick={() => setIsDeleteConfirmOpen(!isDeleteConfirmOpen)}
          >
            Delete Account
          </button>
        </div>
      </div>
      {isDeleteConfirmOpen && (
        <ConfirmDeletion
          closeModal={() => setIsDeleteConfirmOpen(!isDeleteConfirmOpen)}
          warning="Are you sure you want to delete your Account? This can't be undone."
          deleteFunction={handleDeleteAccount}
        />
      )}
    </div>
  );
}

export default UpdateProfile;
