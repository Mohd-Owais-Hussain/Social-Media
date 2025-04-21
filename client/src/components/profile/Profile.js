import React, { useEffect, useState } from "react";
import "./Profile.scss";
import Post from "../post/Post";
import dummyUserImg from "../../assets/user.png";
import { useNavigate, useParams } from "react-router-dom";
import CreatePost from "../createPost/CreatePost";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../../redux/slices/postsSlice";
import {
  followAndUnfollowUser,
  getFeedData,
} from "../../redux/slices/feedSlice";
import { showToast } from "../../redux/slices/appConfigSlice";
import { TOAST_SUCCESS } from "../../App";

function Profile() {
  const navigate = useNavigate();
  const params = useParams();
  const userProfile = useSelector((state) => state.postsReducer.userProfile);
  const myProfile = useSelector((state) => state.appConfigReducer.myProfile);
  const feedData = useSelector((state) => state.feedDataReducer.feedData);
  const dispatch = useDispatch();
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    dispatch(
      getUserProfile({
        userId: params.userId,
      })
    );
    dispatch(getFeedData());
  }, [params.userId, dispatch]);

  useEffect(() => {
    setIsMyProfile(myProfile?._id === params.userId);
    setIsFollowing(
      feedData?.followings?.find((item) => item._id === params.userId)
    );
  }, [myProfile, params.userId, feedData]);

  function handleUserFollow() {
    dispatch(
      showToast({
        type: TOAST_SUCCESS,
        message: `You ${
          userProfile.followers.includes(myProfile?._id)
            ? "unfollowed"
            : "followed"
        } ${userProfile?.name}`,
      })
    );
    dispatch(
      followAndUnfollowUser({
        userIdToFollow: params.userId,
      })
    ).then(() => {
      dispatch(
        getUserProfile({
          userId: params.userId,
        })
      );
    });
  }

  return (
    <div className="Profile">
      <div className="container">
        <div className="left-part">
          {isMyProfile && <CreatePost />}
          {!isMyProfile && userProfile?.posts?.length === 0 && (
            <p className="no-posts">No posts yet.</p>
          )}
          {userProfile?.posts?.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
        <div className="right-part">
          <div className="profile-card">
            <img
              className="user-img"
              src={userProfile?.avatar?.url || dummyUserImg}
              alt=""
            />
            <h3 className="user-name">{userProfile?.name}</h3>
            <p className="bio">{userProfile?.bio}</p>
            <div className="follower-info">
              <h4>{`${userProfile?.followers?.length} Followers`}</h4>
              <h4>{`${userProfile?.followings?.length} Following`}</h4>
            </div>
            {!isMyProfile && (
              <h5
                style={{ marginTop: "10px" }}
                onClick={handleUserFollow}
                className={
                  isFollowing ? "hover-link follow-link" : "btn-primary"
                }
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </h5>
            )}
            {isMyProfile && (
              <button
                className="update-profile btn-secondary"
                onClick={() => {
                  navigate("/updateProfile");
                }}
              >
                Update Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
