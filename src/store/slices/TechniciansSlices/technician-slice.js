import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BaseUrl, getTechnicians } from "../../../APIs/Api";
import axios from "axios";
export const featchAllTechnicians = createAsyncThunk(
  "dashboardSlice/all-technicians",
  async ({
    pageIndex,
    pageSize = 8,
    search,
    city,
    center,
    sort,
    isActive,
    department,
  }) => {
    const res = await axios.get(`${BaseUrl}/${getTechnicians}`, {
      params: {
        pageSize,
        pageIndex,
        search,
        city,
        center,
        sort,
        isActive,
        department,
      },
    });
    return res.data;
  }
);

export const techniciansSlice = createSlice({
  name: "techniciansSlice",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(featchAllTechnicians.pending, () => "pending");
    builder.addCase(
      featchAllTechnicians.fulfilled,
      (state, action) => action.payload
    );
    builder.addCase(featchAllTechnicians.rejected, () => "error");
  },
});

export default techniciansSlice.reducer;
