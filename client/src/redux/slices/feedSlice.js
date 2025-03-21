import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";
import { likeAndUnlikePost } from "./postsSlice";

export const getFeedData = createAsyncThunk("user/getFeedData", async () => {
  try {
    const response = await axiosClient.get("/user/getFeedData");
    console.log("userProfile", response);
    return response.result;
  } catch (e) {
    return Promise.reject(e);
  }
});

export const followAndUnfollowUser = createAsyncThunk(
  "user/followAndUnfollow",
  async (body) => {
    try {
      const response = await axiosClient.post("/user/follow", body);
      return response.result.user;
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
        if (index != undefined && index != -1) {
          state.feedData.posts[index] = post;
        }
      })
      .addCase(followAndUnfollowUser.fulfilled, (state, action) => {
        const user = action.payload;
        const index = state?.feedData?.followings.findIndex(
          (item) => item._id == user._id
        );
        if (index != -1) {
          state?.feedData.followings.splice(index, 1);
          state?.feedData.suggestions.push(user);
        } else {
          state?.feedData.followings.push(user);
          const index = state?.feedData?.suggestions.findIndex(
            (item) => item._id == user._id
          );
          state?.feedData.suggestions.splice(index, 1);
        }
      });
  },
});

export default feedSlice.reducer;
