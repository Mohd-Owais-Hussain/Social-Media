import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";
import { likeAndUnlikePost } from "./postsSlice";
import { showToast } from "./appConfigSlice";
import { TOAST_SUCCESS } from "../../App";

export const getFeedData = createAsyncThunk("user/getFeedData", async () => {
  try {
    const response = await axiosClient.get("/user/getFeedData");

    return response.data ? response.data.result : response.result;
  } catch (e) {
    return Promise.reject(e);
  }
});

export const followAndUnfollowUser = createAsyncThunk(
  "user/followAndUnfollow",
  async (body, { dispatch }) => {
    try {
      const { userIdToFollow, myProfileId } = body;
      const response = await axiosClient.post("/user/follow", {
        userIdToFollow,
      });

      const user = response.data
        ? response.data.result.user
        : response.result.user;

      const isFollowing = user.followers.includes(myProfileId);

      dispatch(
        showToast({
          type: TOAST_SUCCESS,
          message: `You ${isFollowing ? "followed" : "unfollowed"} ${
            user.name
          }`,
        })
      );

      return user;
    } catch (e) {
      return Promise.reject(e);
    }
  }
);

const feedSlice = createSlice({
  name: "feedSlice",
  initialState: {
    feedData: {},
  },
  reducers: {
    updateCommentCountInFeed: (state, action) => {
      const { comment, direction } = action.payload;
      const postIndex = state?.feedData?.posts?.findIndex(
        (post) => post._id === comment.post
      );
      if (postIndex !== -1 && postIndex !== undefined) {
        direction === "increase"
          ? (state.feedData.posts[postIndex].commentsCount += 1)
          : (state.feedData.posts[postIndex].commentsCount -= 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeedData.fulfilled, (state, action) => {
        state.feedData = action.payload;
      })
      .addCase(likeAndUnlikePost.fulfilled, (state, action) => {
        const post = action.payload;
        const index = state?.feedData?.posts?.findIndex(
          (item) => item._id === post._id
        );
        if (index !== undefined && index !== -1) {
          state.feedData.posts[index] = post;
        }
      })
      .addCase(followAndUnfollowUser.fulfilled, (state, action) => {
        const user = action.payload;
        const index = state?.feedData?.followings.findIndex(
          (item) => item._id === user._id
        );
        if (index !== -1) {
          state?.feedData.followings.splice(index, 1);
          state?.feedData.suggestions.push(user);
        } else {
          state?.feedData.followings.push(user);
          const index = state?.feedData?.suggestions.findIndex(
            (item) => item._id === user._id
          );
          state?.feedData.suggestions.splice(index, 1);
        }
      });
  },
});

export default feedSlice.reducer;

export const { updateCommentCountInFeed } = feedSlice.actions;
