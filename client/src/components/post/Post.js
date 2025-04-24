import React, { useRef, useState } from "react";
import Avatar from "../avatar/Avatar";
import "./Post.scss";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { AiOutlineEllipsis } from "react-icons/ai";
import { IoChatbubbleOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { deletePost, likeAndUnlikePost } from "../../redux/slices/postsSlice";
import { useLocation, useNavigate } from "react-router-dom";
import UpdatePost from "../update-post/UpdatePost";
import ConfirmDeletion from "../confirm-account-deletion/ConfirmDeletion";
import { followAndUnfollowUser } from "../../redux/slices/feedSlice";
import Comments from "../comments/Comments";

function Post({ post }) {
  const moreOptionsRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const myProfileId = useSelector(
    (state) => state.appConfigReducer.myProfile?._id
  );
  const [toggleOptionsMenu, setToggleOptionsMenu] = useState(false);
  const [togglePostDetail, setTogglePostDetail] = useState(false);
  const [toggleUpdatePost, setToggleUpdatePost] = useState(false);
  const [toggleDeletePostConfirm, setToggleDeletePostConfirm] = useState(false);
  const [isFollowing, setIsFollowing] = useState(
    post?.owner.followers.includes(myProfileId)
  );

  function handlePostLiked() {
    dispatch(
      likeAndUnlikePost({
        postId: post._id,
      })
    );
  }

  function handlePostDelete() {
    dispatch(deletePost(post._id));
  }

  function handleUserFollow() {
    dispatch(
      followAndUnfollowUser({
        userIdToFollow: post?.owner._id,
        myProfileId,
      })
    );
    setIsFollowing(!isFollowing);
  }

  return (
    <div className="Post">
      <div className="heading">
        <div
          className="user-info"
          onClick={() => {
            if (location.pathname !== `/profile/${post?.owner._id}`) {
              navigate(`/profile/${post?.owner._id}`);
            } else {
              navigate(0);
            }
          }}
        >
          <Avatar src={post?.owner?.avatar?.url} />
          <h4>{post?.owner?.name}</h4>
        </div>

        <div
          className="options-btn"
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
          className="more-options"
          ref={moreOptionsRef}
          tabIndex={0}
          onBlur={() => setToggleOptionsMenu(false)}
        >
          {myProfileId === post.owner._id ? (
            <>
              <li
                className="single-option"
                onClick={() => setToggleUpdatePost(!toggleUpdatePost)}
              >
                Update Post
              </li>
              <li
                className="single-option"
                onClick={() =>
                  setToggleDeletePostConfirm(!toggleDeletePostConfirm)
                }
              >
                Delete Post
              </li>
            </>
          ) : (
            <li className="single-option" onClick={handleUserFollow}>
              {isFollowing ? "Unfollow" : "Follow"}
            </li>
          )}
        </ul>
      </div>
      <div className="content">
        <img src={post?.image?.url} alt="post image" />
      </div>
      <div className="footer">
        <div className="post-buttons">
          <div className="like" onClick={handlePostLiked}>
            {post.isLiked ? (
              <FaHeart className="icon" style={{ color: "red" }} />
            ) : (
              <FaRegHeart className="icon" />
            )}
            <h4>{`${post.likesCount} likes`}</h4>
          </div>

          <div
            className="comment"
            onClick={() => setTogglePostDetail(!togglePostDetail)}
          >
            <IoChatbubbleOutline className="icon" />
            <h4>{`${post.commentsCount} comments`}</h4>
          </div>
        </div>
        <p className="caption">{post?.caption}</p>
        <h6 className="time-ago">{post?.timeAgo}</h6>
      </div>

      {togglePostDetail && (
        <Comments
          post={post}
          onPostLike={() => handlePostLiked()}
          closeModal={() => setTogglePostDetail(!togglePostDetail)}
        />
      )}

      {toggleUpdatePost && (
        <UpdatePost
          post={post}
          closeModal={() => setToggleUpdatePost(!toggleUpdatePost)}
        />
      )}
      {toggleDeletePostConfirm && (
        <ConfirmDeletion
          closeModal={() =>
            setToggleDeletePostConfirm(!toggleDeletePostConfirm)
          }
          warning="Are you sure you want to delete this Post? This can't be undone."
          deleteFunction={handlePostDelete}
        />
      )}
    </div>
  );
}

export default Post;
