var ta = require("time-ago");

const mapPostOutput = (post, userId) => {
  return {
    _id: post._id,
    caption: post.caption,
    image: post.image,
    owner: {
      _id: post.owner._id,
      name: post.owner.name,
      avatar: post.owner.avatar,
      followers: post.owner.followers,
    },
    likesCount: post.likes.length,
    isLiked: post.likes.includes(userId),
    commentsCount: post.comments.length,
    timeAgo:
      ta.ago(post.createdAt).endsWith("ms ago") ||
      ta.ago(post.createdAt).endsWith("seconds ago")
        ? "Just now"
        : ta.ago(post.createdAt),
  };
};

const mapCommentOutput = (userComment) => {
  return {
    _id: userComment._id,
    comment: userComment.comment,
    owner: {
      _id: userComment.owner._id,
      name: userComment.owner.name,
      avatar: userComment.owner.avatar,
    },
    post: userComment.post,
    timeAgo:
      ta.ago(userComment.createdAt).endsWith("ms ago") ||
      ta.ago(userComment.createdAt).endsWith("seconds ago")
        ? "Just now"
        : ta.ago(userComment.createdAt),
  };
};

module.exports = {
  mapPostOutput,
  mapCommentOutput,
};
