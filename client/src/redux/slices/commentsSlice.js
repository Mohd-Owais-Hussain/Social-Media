import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";
import { showToast } from "./appConfigSlice";
import { TOAST_SUCCESS } from "../../App";
import { updateCommentCountInFeed } from "./feedSlice";
import { updateCommentCountInUserProfile } from "./postsSlice";

export const getPostComments = createAsyncThunk(
  "comment/getPostComments",
  async (body) => {
    try {
      const response = await axiosClient.get("/comment/", {
        params: { postId: body },
      });

      return response.result;
    } catch (e) {
      return Promise.reject(e);
    }
  }
);

export const createComment = createAsyncThunk(
  "comment/create",
  async (body, { dispatch }) => {
    try {
      const response = await axiosClient.post("/comment/", body);

      dispatch(
        showToast({
          type: TOAST_SUCCESS,
          message: "Comment added",
        })
      );

      dispatch(
        updateCommentCountInFeed({
          comment: response.result,
          direction: "increase",
        })
      );

      dispatch(
        updateCommentCountInUserProfile({
          comment: response.result,
          direction: "increase",
        })
      );

      return response.result;
    } catch (e) {
      return Promise.reject(e);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comment/delete",
  async (body, { dispatch }) => {
    try {
      const response = await axiosClient.delete("/comment/", {
        params: { commentId: body },
      });
      
      dispatch(
        showToast({
          type: TOAST_SUCCESS,
          message: "Comment deleted",
        })
      );

      dispatch(
        updateCommentCountInFeed({
          comment: response.result,
          direction: "decrease",
        })
      );
      
      dispatch(
        updateCommentCountInUserProfile({
          comment: response.result,
          direction: "decrease",
        })
      );

      return response.result;
    } catch (e) {
      return Promise.reject(e);
    }
  }
);

const commentsSlice = createSlice({
  name: "commentsSlice",
  initialState: {
    postComments: [],
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPostComments.fulfilled, (state, action) => {
        state.postComments = action.payload;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.postComments.push(action.payload);
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const deletedComment = action.payload;
        const commentId = deletedComment._id;
        const index = state?.postComments?.findIndex(
          (comment) => comment._id === commentId
        );
        if (index !== undefined && index !== -1) {
          state.postComments.splice(index, 1);
        }
      });
  },
});

export default commentsSlice.reducer;
