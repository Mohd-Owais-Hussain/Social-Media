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

      return response.data ? response.data.result : response.result;
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

      const result = response.data ? response.data.result : response.result;

      dispatch(
        updateCommentCountInFeed({
          comment: result,
          direction: "increase",
        })
      );
      dispatch(
        updateCommentCountInUserProfile({
          comment: result,
          direction: "increase",
        })
      );

      return result;
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

      const result = response.data ? response.data.result : response.result;

      dispatch(
        updateCommentCountInFeed({
          comment: result,
          direction: "decrease",
        })
      );
      dispatch(
        updateCommentCountInUserProfile({
          comment: result,
          direction: "decrease",
        })
      );

      return result;
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
        const comment = action.payload;
        const commentId = comment._id;
        const index = state?.postComments?.findIndex(
          (comment) => comment._id === commentId
        );
        if (index != undefined && index != -1) {
          state.postComments.splice(index, 1);
        }
      });
  },
});

export default commentsSlice.reducer;
