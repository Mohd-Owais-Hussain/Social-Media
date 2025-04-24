import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";
import { showToast } from "./appConfigSlice";
import { TOAST_SUCCESS } from "../../App";

export const getUserProfile = createAsyncThunk(
  "user/getUserProfile",
  async (body) => {
    try {
      const response = await axiosClient.post("/user/getUserProfile", body);

      return response.data ? response.data.result : response.result;
    } catch (e) {
      return Promise.reject(e);
    }
  }
);

export const likeAndUnlikePost = createAsyncThunk(
  "post/likeAndUnlike",
  async (body, { dispatch }) => {
    try {
      const response = await axiosClient.post("/posts/like", body);

      const post = response.data
        ? response.data.result.post
        : response.result.post;

      dispatch(
        showToast({
          type: TOAST_SUCCESS,
          message: post.isLiked === true ? "Post liked" : "Post unliked",
        })
      );

      return post;
    } catch (e) {
      return Promise.reject(e);
    }
  }
);

export const updatePost = createAsyncThunk(
  "post/update",
  async (body, { dispatch }) => {
    try {
      const response = await axiosClient.put("/posts/", {
        ...body,
      });

      dispatch(
        showToast({
          type: TOAST_SUCCESS,
          message: "Post updated",
        })
      );

      return response.data ? response.data.result.post : response.result.post;
    } catch (e) {
      return Promise.reject(e);
    }
  }
);

export const deletePost = createAsyncThunk(
  "post/delete",
  async (body, { dispatch }) => {
    try {
      const response = await axiosClient.delete("/posts/", {
        params: { postId: body },
      });

      dispatch(
        showToast({
          type: TOAST_SUCCESS,
          message: "Post deleted",
        })
      );

      return response.data ? response.data.result : response.result;
    } catch (e) {
      return Promise.reject(e);
    }
  }
);

const postsSlice = createSlice({
  name: "postsSlice",
  initialState: {
    userProfile: {},
  },
  reducers: {
    updateCommentCountInUserProfile: (state, action) => {
      const { comment, direction } = action.payload;
      const postIndex = state?.userProfile?.posts?.findIndex(
        (post) => post._id === comment.post
      );
      if (postIndex !== -1) {
        direction === "increase"
          ? (state.userProfile.posts[postIndex].commentsCount += 1)
          : (state.userProfile.posts[postIndex].commentsCount -= 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload;
      })
      .addCase(likeAndUnlikePost.fulfilled, (state, action) => {
        const post = action.payload;
        const index = state?.userProfile?.posts?.findIndex(
          (item) => item._id === post._id
        );
        if (index != undefined && index != -1) {
          state.userProfile.posts[index] = post;
        }
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const post = action.payload;
        const index = state?.userProfile?.posts?.findIndex(
          (item) => item._id === post._id
        );
        if (index != undefined && index != -1) {
          state.userProfile.posts[index].caption = post.caption;
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const postId = action.payload;
        const index = state?.userProfile?.posts?.findIndex(
          (post) => post._id === postId
        );
        if (index != undefined && index != -1) {
          state.userProfile.posts.splice(index, 1);
        }
      });
  },
});

export default postsSlice.reducer;

export const { updateCommentCountInUserProfile } = postsSlice.actions;
