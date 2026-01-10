import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseUrl, getAllOrders, orderApi } from "../../APIs/Api";
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

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BaseUrl,
    prepareHeaders: (headers) => {
      const cookie = Cookie();
      const token = cookie.get("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getOrders: builder.query({
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
      }) => ({
        url: `${getAllOrders}`,
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
      }),
      transformResponse: (response) => {
        return response;
      },
    }),
    getOrderDetails: builder.query({
      query: ({ id }) => ({
        url: `${orderApi}/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      transformResponse: (response) => {
        return response;
      },
    }),
    getTechnicianOrders: builder.query({
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
        activity,
      }) => ({
        url: `${orderApi}/orders-by-technician`,
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
          activity,
        }),
      }),

      transformResponse: (response) => response,
    }),

    getUserOrders: builder.query({
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
        activity,
      }) => ({
        url: `${orderApi}/orders-by-user`,
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
          activity,
        }),
      }),

      transformResponse: (response) => response,
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderDetailsQuery,
  useGetTechnicianOrdersQuery,
  useGetUserOrdersQuery,
} = ordersApi;
