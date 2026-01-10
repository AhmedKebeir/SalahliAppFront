import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BaseUrl, CurrentUser } from "../../APIs/Api";
import Cookie from "cookie-universal";

export const featchUser = createAsyncThunk("currentUser/getUser", async () => {
  const cookie = Cookie();
  const token = cookie.get("token");
  var res = await axios.get(`${BaseUrl}/${CurrentUser}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
});
export const currentUser = createSlice({
  initialState: {},
  name: "currentUser",
  reducers: {
    addtUser: (state, action) => {
      return state + action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(featchUser.pending, () => "pending");

    builder.addCase(featchUser.fulfilled, (state, action) => action.payload);

    builder.addCase(featchUser.rejected, () => "error");
  },
});

export const { getCurrentUser } = currentUser.actions;
export default currentUser.reducer;
