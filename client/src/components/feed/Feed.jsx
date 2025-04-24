import React, { useEffect } from "react";
import "./Feed.scss";
import Post from "../post/Post";
import Follower from "../follower/Follower";
import { useDispatch, useSelector } from "react-redux";
import { getFeedData } from "../../redux/slices/feedSlice";

function Feed() {
  const dispatch = useDispatch();
  const feedData = useSelector((state) => state.feedDataReducer.feedData);

  useEffect(() => {
    dispatch(getFeedData());
  }, [dispatch]);

  return (
    <div className="Feed">
      <div className="container">
        <div className="left-part">
          {feedData?.posts?.length === 0 ? (
            <p className="empty-feed">
              No posts yet! Follow others to see what they're up to.
            </p>
          ) : (
            feedData?.posts?.map((post) => <Post key={post._id} post={post} />)
          )}
        </div>
        <div className="right-part">
          <div className="following">
            <h3 className="title">You are Following</h3>
            {feedData?.followings?.length === 0 ? (
              <p>
                No one here yet! Explore and follow accounts that interest you.
              </p>
            ) : (
              feedData?.followings?.map((user) => (
                <Follower key={user._id} user={user} />
              ))
            )}
          </div>
          <div className="suggestions">
            <h3 className="title">Suggested for You</h3>
            {feedData?.suggestions?.length === 0 ? (
              <p>No suggestions right now - check back soon!</p>
            ) : (
              feedData?.suggestions?.map((user) => (
                <Follower key={user._id} user={user} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feed;
