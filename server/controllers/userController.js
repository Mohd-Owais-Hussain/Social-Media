const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");
const { mapPostOutput } = require("../utils/Utils");
const { error, success } = require("../utils/responseWrapper");
const cloudinary = require("cloudinary").v2;

const followOrUnfollowUserController = async (req, res) => {
  try {
    const { userIdToFollow } = req.body;
    const curUserId = req._id;

    const userToFollow = await User.findById(userIdToFollow);
    const curUser = await User.findById(curUserId);

    if (curUserId === userIdToFollow) {
      return res.send(error(409, "Users cannot follow themselves"));
    }

    if (!userToFollow) {
      return res.send(error(404, "User to follow not found"));
    }

    if (curUser.followings.includes(userIdToFollow)) {
      const followingIndex = curUser.followings.indexOf(userIdToFollow);
      curUser.followings.splice(followingIndex, 1);

      const followerIndex = userToFollow.followers.indexOf(curUserId);
      userToFollow.followers.splice(followerIndex, 1);
    } else {
      userToFollow.followers.push(curUserId);
      curUser.followings.push(userIdToFollow);
    }

    await userToFollow.save();
    await curUser.save();

    return res.send(success(200, { user: userToFollow }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getPostsOfFollowing = async (req, res) => {
  try {
    const curUserId = req._id;
    const curUser = await User.findById(curUserId).populate("followings");

    const fullPosts = await Post.find({
      owner: {
        $in: curUser.followings,
      },
    }).populate("owner");

    const posts = fullPosts
      .map((item) => mapPostOutput(item, req._id))
      .reverse();

    curUser.posts = posts;

    const followingsIds = curUser.followings.map((item) => item._id);
    followingsIds.push(req._id);

    const suggestions = await User.find({
      _id: {
        $nin: followingsIds,
      },
    });

    return res.send(success(200, { ...curUser._doc, suggestions, posts }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getMyPosts = async (req, res) => {
  try {
    const curUserId = req._id;
    const allUserPosts = await Post.find({
      owner: curUserId,
    }).populate("likes");

    return res.send(success(200, { allUserPosts }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getUserPosts = async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res.send(error(400, "userId is required"));
    }

    const allUserPosts = await Post.find({
      owner: userId,
    }).populate("likes");

    return res.send(success(200, { allUserPosts }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const deleteMyProfile = async (req, res) => {
  try {
    const curUserId = req._id;
    const curUser = await User.findById(curUserId);

    const userPosts = await Post.find({ owner: curUserId });
    for (const post of userPosts) {
      await Comment.deleteMany({ post: post._id });

      await cloudinary.uploader.destroy(post.image.publicId);
      await post.deleteOne();
    }

    for (const followerId of curUser.followers) {
      const follower = await User.findById(followerId);
      if (!follower) {
        continue;
      }
      const index = follower.followings.indexOf(curUserId);
      if (index !== -1) {
        follower.followings.splice(index, 1);
      }
      await follower.save();
    }

    for (const followingId of curUser.followings) {
      const following = await User.findById(followingId);
      if (!following) {
        continue;
      }
      const index = following.followers.indexOf(curUserId);
      if (index !== -1) {
        following.followers.splice(index, 1);
      }
      await following.save();
    }

    const allPosts = await Post.find();
    const userComments = await Comment.find({ owner: curUserId });
    const userCommentIds = userComments.map((comment) =>
      comment._id.toString()
    );

    for (const post of allPosts) {
      const index = post.likes.indexOf(curUserId);
      if (index !== -1) {
        post.likes.splice(index, 1);
      }

      post.comments = post.comments.filter(
        (commentId) => !userCommentIds.includes(commentId.toString())
      );
      await post.save();
    }

    await Comment.deleteMany({ owner: curUserId });

    if (curUser.avatar?.publicId) {
      await cloudinary.uploader.destroy(curUser.avatar.publicId);
    }

    await curUser.deleteOne();

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });

    return res.send(success(200, "user deleted"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getMyInfo = async (req, res) => {
  try {
    const user = await User.findById(req._id);

    return res.send(success(200, { user }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { userImg } = req.body;
    let { name, bio } = req.body;
    console.log("name->", name, "bio->", bio, "userImg->", userImg);
    name = name.trim();
    bio = bio.trim();

    const user = await User.findById(req._id);

    const oldImgPublicId = user.avatar?.publicId;

    if (name) {
      user.name = name;
    } else {
      return res.send(error(400, "Name can't be empty"));
    }

    if (bio !== undefined && bio !== null) {
      user.bio = bio;
    }

    if (userImg) {
      const cloudImg = await cloudinary.uploader.upload(userImg, {
        folder: "profileImg",
      });
      user.avatar = {
        url: cloudImg.secure_url,
        publicId: cloudImg.public_id,
      };
    }

    if (oldImgPublicId) {
      await cloudinary.uploader.destroy(oldImgPublicId);
    }

    await user.save();
    console.log("user", user);
    return res.send(success(200, { user }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.send(error(404, "User Id is required"));
    }

    const user = await User.findById(userId).populate({
      path: "posts",
      populate: {
        path: "owner",
      },
    });

    if (!user) {
      return res.send(error(404, "User not found"));
    }

    const fullPosts = user.posts;
    const posts = fullPosts
      .map((item) => mapPostOutput(item, req._id))
      .reverse();

    return res.send(success(200, { ...user._doc, posts }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

module.exports = {
  followOrUnfollowUserController,
  getPostsOfFollowing,
  getMyPosts,
  getUserPosts,
  deleteMyProfile,
  getMyInfo,
  updateUserProfile,
  getUserProfile,
};
