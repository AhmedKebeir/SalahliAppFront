import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BaseUrl, getAllUsers } from "../../../APIs/Api";
import axios from "axios";
export const featchAllUsers = createAsyncThunk(
  "dashboardSlice/all-users",
  async ({ pageIndex, pageSize = 8, search, city, center, sort }) => {
    const res = await axios.get(`${BaseUrl}/${getAllUsers}`, {
      params: {
        pageSize,
        pageIndex,
        search,
        city,
        center,
        sort,
      },
    });
    return res.data;
  }
);

export const usersSlice = createSlice({
  name: "usersSlice",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(featchAllUsers.pending, () => "pending");
    builder.addCase(
      featchAllUsers.fulfilled,
      (state, action) => action.payload
    );
    builder.addCase(featchAllUsers.rejected, () => "error");
  },
});

export default usersSlice.reducer;
