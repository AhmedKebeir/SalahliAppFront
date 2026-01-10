import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  BaseUrl,
  getAllUsers,
  getAllDepartments,
  getAllOrders,
  landingDepartment,
  overview,
  getTechnicians,
} from "../../../APIs/Api.js";
import axios from "axios";
export const featchOverview = createAsyncThunk(
  "dashboardSlice/overview",
  async () => {
    const res = await axios.get(`${BaseUrl}/${overview}`);
    return res.data;
  }
);

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
    departmentId,
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
        departmentId,
      },
    });
    return res.data;
  }
);

//users
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

export const featchAllDepartment = createAsyncThunk(
  "dashboardSlice/all-department",
  async ({ pageIndex, pageSize = 8, search, sort }) => {
    const res = await axios.get(`${BaseUrl}/${landingDepartment}`, {
      params: {
        pageSize,
        pageIndex,
        search,
        sort,
      },
    });
    return res.data;
  }
);
export const featchDepartmentById = createAsyncThunk(
  "dashboardSlice/department-by-id",
  async (id) => {
    const res = await axios.get(`${BaseUrl}/${getAllDepartments}/${id}`, {});
    return res.data;
  }
);
export const featchAllOrders = createAsyncThunk(
  "dashboardSlice/all-orders",
  async ({
    pageIndex,
    pageSize = 8,
    sort,
    departmentId,
    userId,
    technicianId,
    date,
    status,
    city,
    center,
    search,
  }) => {
    const res = await axios.get(`${BaseUrl}/${getAllOrders}`, {
      params: {
        pageIndex,
        pageSize,
        sort,
        departmentId,
        userId,
        technicianId,
        date,
        status,
        city,
        center,
        search,
      },
    });
    return res.data;
  }
);

export const dashboardSlice = createSlice({
  name: "dashboardSlice",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(featchOverview.pending, () => "pending");
    builder.addCase(
      featchOverview.fulfilled,
      (state, action) => action.payload
    );
    builder.addCase(featchOverview.rejected, () => "error");

    //Technicians
    builder.addCase(featchAllTechnicians.pending, () => "pending");
    builder.addCase(
      featchAllTechnicians.fulfilled,
      (state, action) => action.payload
    );
    builder.addCase(featchAllTechnicians.rejected, () => "error");

    //Users
    builder.addCase(featchAllUsers.pending, () => "pending");
    builder.addCase(
      featchAllUsers.fulfilled,
      (state, action) => action.payload
    );
    builder.addCase(featchAllUsers.rejected, () => "error");

    //departments
    builder.addCase(featchAllDepartment.pending, () => "pending");
    builder.addCase(
      featchAllDepartment.fulfilled,
      (state, action) => action.payload
    );
    builder.addCase(featchAllDepartment.rejected, () => "error");

    //department by id
    builder.addCase(featchDepartmentById.pending, () => "pending");
    builder.addCase(
      featchDepartmentById.fulfilled,
      (state, action) => action.payload
    );
    builder.addCase(featchDepartmentById.rejected, () => "error");

    //orders
    builder.addCase(featchAllOrders.pending, () => "pending");
    builder.addCase(
      featchAllOrders.fulfilled,
      (state, action) => action.payload
    );
    builder.addCase(featchAllOrders.rejected, () => "error");
  },
});

export default dashboardSlice.reducer;
