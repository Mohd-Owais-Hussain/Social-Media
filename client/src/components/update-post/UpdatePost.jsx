import React, { useState } from "react";
import "./UpdatePost.scss";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { updatePost } from "../../redux/slices/postsSlice";

function UpdatePost({ post, closeModal }) {
  const dispatch = useDispatch();
  const [updatedCaption, setUpdatedCaption] = useState(post?.caption);

  function handlePostUpdate(e) {
    e.preventDefault();
    dispatch(updatePost({ postId: post._id, caption: updatedCaption }));
    closeModal();
  }

  return (
    <div className="UpdatePost">
      <div className="overlay" onClick={closeModal}></div>
      <div className="update-container">
        <div className="header">
          <h4 className="title">Update Post</h4>
          <button className="close-btn" onClick={closeModal}>
            <IoClose />
          </button>
        </div>
        <div className="post-info">
          <div className="content">
            <img src={post?.image?.url} alt="post" />
          </div>

          <form className="update-post-form" onSubmit={handlePostUpdate}>
            <input
              className="update-post-input"
              type="text"
              value={updatedCaption}
              onChange={(e) => setUpdatedCaption(e.target.value)}
            />

            <label className="submit-update-post-btn" htmlFor="submitBtn">
              <FaCheck />
            </label>

            <input
              className="submit-update-post"
              id="submitBtn"
              type="submit"
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdatePost;
