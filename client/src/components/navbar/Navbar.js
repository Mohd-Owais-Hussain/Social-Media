import React from "react";
import "./Navbar.scss";
import Avatar from "../avatar/Avatar";
import { useLocation, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { useSelector } from "react-redux";
import { axiosClient } from "../../utils/axiosClient";
import { KEY_ACCESS_TOKEN, removeItem } from "../../utils/localStorageManager";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const myProfile = useSelector((state) => state.appConfigReducer.myProfile);

  async function handleLogoutClicked() {
    try {
      await axiosClient.post("/auth/logout");
      removeItem(KEY_ACCESS_TOKEN);
      navigate("/login");
    } catch (e) {}
  }

  console.log(location.pathname);

  return (
    <div className="Navbar">
      <div className="container">
        <h2
          className="banner hover-link"
          onClick={() => {
            if (location.pathname !== "/") {
              navigate("/");
            }
          }}
        >
          Social Media
        </h2>
        <div className="right-side">
          <div
            className="profile hover-link"
            onClick={() => {
              if (location.pathname !== `/profile/${myProfile?._id}`) {
                navigate(`/profile/${myProfile?._id}`);
              }
            }}
          >
            <Avatar src={myProfile?.avatar?.url} />
          </div>
          <div className="logout hover-link" onClick={handleLogoutClicked}>
            <FiLogOut />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
