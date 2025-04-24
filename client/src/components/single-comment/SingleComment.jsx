import React, { useRef, useState } from "react";
import "./SingleComment.scss";
import Avatar from "../avatar/Avatar";
import { AiOutlineEllipsis } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmDeletion from "../confirm-account-deletion/ConfirmDeletion";

function SingleComment({
  userComment,
  curUserId,
  deleteCommentFunction,
  warning,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const moreOptionsRef = useRef(null);
  const [toggleOptionsMenu, setToggleOptionsMenu] = useState(false);
  const [toggleDeletePostConfirm, setToggleDeletePostConfirm] = useState(false);

  return (
    <div className="SingleComment">
      <div
        className="avatar"
        onClick={() => {
          if (location.pathname !== `/profile/${userComment?.owner?._id}`) {
            navigate(`/profile/${userComment?.owner?._id}`);
          } else {
            navigate(0);
          }
        }}
      >
        <Avatar src={userComment?.owner?.avatar?.url} />
      </div>
      <div className="comment-container">
        <span
          className="owner-name"
          onClick={() => {
            if (location.pathname !== `/profile/${userComment?.owner?._id}`) {
              navigate(`/profile/${userComment?.owner?._id}`);
            } else {
              navigate(0);
            }
          }}
        >
          {userComment?.owner?.name}
        </span>
        <span className="info">{userComment?.comment}</span>
        <p className="time-ago">{userComment?.timeAgo}</p>
      </div>
      <div className="more-options">
        <div
          className="menu-btn"
          onMouseDown={(e) => {
            e.preventDefault();
            if (toggleOptionsMenu) {
              moreOptionsRef?.current?.blur();
              setToggleOptionsMenu(!toggleOptionsMenu);
            } else {
              moreOptionsRef?.current?.focus();
              setToggleOptionsMenu(!toggleOptionsMenu);
            }
          }}
        >
          <AiOutlineEllipsis />
        </div>

        <ul
          className="menu"
          ref={moreOptionsRef}
          tabIndex={0}
          onBlur={() => setToggleOptionsMenu(false)}
        >
          <li
            className="single-option"
            onClick={() => {
              if (location.pathname !== `/profile/${userComment?.owner?._id}`) {
                navigate(`/profile/${userComment?.owner?._id}`);
              } else {
                navigate(0);
              }
            }}
          >
            View Profile
          </li>
          {userComment?.owner?._id === curUserId && (
            <li
              className="single-option"
              onClick={() =>
                setToggleDeletePostConfirm(!toggleDeletePostConfirm)
              }
            >
              Delete
            </li>
          )}
        </ul>
      </div>
      {toggleDeletePostConfirm && (
        <ConfirmDeletion
          closeModal={() =>
            setToggleDeletePostConfirm(!toggleDeletePostConfirm)
          }
          warning={warning}
          deleteFunction={deleteCommentFunction}
        />
      )}
    </div>
  );
}

export default SingleComment;
