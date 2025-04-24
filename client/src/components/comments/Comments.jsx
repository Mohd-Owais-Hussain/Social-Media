import React, { useEffect, useState } from "react";
import "./Comments.scss";
import Avatar from "../avatar/Avatar";
import { IoClose } from "react-icons/io5";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { IoChatbubbleOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  createComment,
  deleteComment,
  getPostComments,
} from "../../redux/slices/commentsSlice";
import SingleComment from "../single-comment/SingleComment";
import { deletePost } from "../../redux/slices/postsSlice";
import { useLocation, useNavigate } from "react-router-dom";

function Comments({ post, onPostLike, closeModal }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [commentText, setCommentText] = useState("");
  const commentsData = useSelector(
    (state) => state.commentsReducer.postComments
  );
  const myProfileId = useSelector(
    (state) => state.appConfigReducer.myProfile?._id
  );

  function handlePostDelete() {
    dispatch(deletePost(post?._id));
  }

  function handleCommentDelete(userCommentId) {
    dispatch(deleteComment(userCommentId));
  }

  async function handleCreateComment(e) {
    e.preventDefault();
    dispatch(createComment({ comment: commentText, postId: post?._id }));
    setCommentText("");
  }

  useEffect(() => {
    dispatch(getPostComments(post?._id));
  }, [dispatch]);

  return (
    <div className="Comments">
      <div className="overlay" onClick={closeModal}></div>

      <div className="post-detail-container">
        <div className="post-img-container">
          <img className="post-img" src={post?.image?.url} alt="post" />
        </div>

        <div className="right-side">
          <div className="header">
            <div className="user-info" onClick={() => {
              if (location.pathname !== `/profile/${post?.owner?._id}`) {
                navigate(`/profile/${post?.owner?._id}`);
              } else {
                navigate(0);
              }
            }}>
              <Avatar src={post?.owner?.avatar?.url} />
              <h4>{post?.owner?.name}</h4>
            </div>

            <div className="close-btn" onClick={closeModal}>
              <IoClose />
            </div>
          </div>

          <div className="comment-box">
            <div className="comments-list">
              <div className="post-owner-caption">
                <SingleComment
                  userComment={{
                    comment: post?.caption,
                    owner: {
                      _id: post?.owner?._id,
                      name: post?.owner?.name,
                      avatar: {
                        url: post?.owner?.avatar?.url,
                      },
                    },
                    timeAgo: post?.timeAgo,
                  }}
                  curUserId={myProfileId}
                  deleteCommentFunction={handlePostDelete}
                  warning="Are you sure you want to delete this Post? This can't be undone."
                />
              </div>

              {commentsData?.map((userComment) => (
                <div className="user-comment" key={userComment?._id}>
                  <SingleComment
                    userComment={userComment}
                    curUserId={myProfileId}
                    deleteCommentFunction={() =>
                      handleCommentDelete(userComment?._id)
                    }
                    warning="Are you sure you want to delete this Comment?"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="info-footer">
            <div className="buttons">
              <div className="like-btn btn" onClick={onPostLike}>
                {post?.isLiked ? (
                  <FaHeart className="icon" style={{ color: "red" }} />
                ) : (
                  <FaRegHeart className="icon" />
                )}
              </div>
              <label className="comment-btn btn" htmlFor="comment-input">
                <IoChatbubbleOutline className="icon" />
              </label>
            </div>

            <div className="post-info">
              <div className="likes-comments-count">
                <h4>{`${post?.likesCount} likes`}</h4>
                <h4>{`${commentsData?.length} comments`}</h4>
              </div>
              <h6 className="time-ago">{post?.timeAgo}</h6>
            </div>
            <form className="add-comment-box" onSubmit={handleCreateComment}>
              <input
                className="enter-comment-input"
                id="comment-input"
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
              />
              <input
                className="comment-submit btn-primary"
                value="Post"
                type="submit"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comments;
