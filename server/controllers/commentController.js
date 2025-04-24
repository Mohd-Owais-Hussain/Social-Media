const Comment = require("../models/Comment");
const Post = require("../models/Post");
const { mapCommentOutput } = require("../utils/Utils");
const { success, error } = require("../utils/responseWrapper");

const createCommentController = async (req, res) => {
  try {
    const { comment, postId } = req.body;
    const curUserId = req._id;

    if (!comment) {
      return res.send(error(400, "Comment can't be empty"));
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.send(error(404, "Post not found"));
    }

    const userComment = await Comment.create({
      comment,
      owner: curUserId,
      post: post._id,
    });

    post.comments.push(userComment._id);
    await post.save();

    const newComment = await Comment.findById(userComment._id).populate(
      "owner"
    );

    return res.send(success(200, mapCommentOutput(newComment)));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const deleteCommentController = async (req, res) => {
  try {
    const { commentId } = req.query;
    const curUserId = req._id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.send(error(404, "Comment not found"));
    }

    if (comment.owner.toString() !== curUserId) {
      return res.send(error(403, "Only owners can delete their comments"));
    }

    const post = await Post.findById(comment.post);
    const index = post.comments.indexOf(comment._id);
    if (index !== -1) {
      post.comments.splice(index, 1);
    }

    await post.save();
    await comment.deleteOne();

    return res.send(success(200, comment));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getPostCommentsController = async (req, res) => {
  try {
    const { postId } = req.query;

    const post = await Post.findById(postId).populate({
      path: "comments",
      populate: {
        path: "owner",
      },
    });

    if (!post) {
      return res.send(error(404, "Post not found"));
    }

    const fullComments = post.comments;
    const comments = fullComments.map((item) => mapCommentOutput(item));

    return res.send(success(200, comments));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

module.exports = {
  createCommentController,
  deleteCommentController,
  getPostCommentsController,
};
