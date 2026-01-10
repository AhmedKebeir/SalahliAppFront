import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseUrl, getAllOrders, getAllUsers, overview } from "../../APIs/Api";
import Cookie from "cookie-universal";

const cookie = Cookie();
const token = cookie.get("token");

const cleanParams = (params) => {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([_, v]) => v !== "" && v !== null && v !== undefined
    )
  );
};
export const adminDashboardApi = createApi({
  reducerPath: "adminDashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BaseUrl,
  }),
  endpoints: (builder) => ({
    getAdminDashboard: builder.query({
      query: () => {
        return {
          url: overview,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      transformResponse: (response) => response,
    }),
    getAllOrders: builder.query({
      query: ({
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
        return {
          url: getAllOrders,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: cleanParams({
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
          }),
        };
      },
      transformResponse: (response) => response,
    }),
    getAllUsersApi: builder.query({
      query: ({ pageIndex, pageSize = 8, search, city, center, sort }) => {
        return {
          url: getAllUsers,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: cleanParams({
            pageIndex,
            pageSize,
            search,
            city,
            center,
            sort,
          }),
        };
      },
      transformResponse: (response) => response,
    }),
  }),
});

export const {
  useGetAdminDashboardQuery,
  useGetAllOrdersQuery,
  useGetAllUsersApiQuery,
} = adminDashboardApi;
