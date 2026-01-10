import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BaseUrl, getAllDepartments, landingDepartment } from "../../APIs/Api";

export const featchFourDepartment = createAsyncThunk(
  "departmentSlice/fourdepartment",
  async () => {
    const res = await axios.get(
      `${BaseUrl}/${landingDepartment}?PageSize=4&PageIndex=1&Sort=orderDesc`
    );
    return res.data.data;
  }
);
export const featchAllDepartment = createAsyncThunk(
  "departmentSlice/alldepartment",
  async () => {
    const res = await axios.get(`${BaseUrl}/${getAllDepartments}`);
    return res.data;
  }
);

export const departmentSlice = createSlice({
  name: "departmentSlice",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(featchFourDepartment.pending, () => "pending");

    builder.addCase(
      featchFourDepartment.fulfilled,
      (state, action) => action.payload
    );
    builder.addCase(featchFourDepartment.rejected, () => "error");

    //all departments
    builder.addCase(featchAllDepartment.pending, () => "pending");
    builder.addCase(
      featchAllDepartment.fulfilled,
      (state, action) => action.payload
    );
    builder.addCase(featchAllDepartment.rejected, () => "error");
  },
});

export default departmentSlice.reducer;
