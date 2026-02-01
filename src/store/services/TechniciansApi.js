import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  BaseTechniciansUrl,
  BaseTechnincianUrl,
  BaseUrl,
  getTechnicians,
  getTopTechnicians,
  TechniciansDashboard,
} from "../../APIs/Api";

import Cookie from "cookie-universal";

const cleanParams = (params) => {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([_, v]) => v !== "" && v !== null && v !== undefined,
    ),
  );
};

const cookie = Cookie();
const token = cookie.get("token");

export const techniciansApi = createApi({
  reducerPath: "techniciansApi",
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
    getTechnicianDashboard: builder.query({
      query: () => ({
        url: TechniciansDashboard,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      transformResponse: (response) => {
        return response;
      },
    }),
    getTopTechniciansApi: builder.query({
      query: ({
        pageSize,
        pageIndex,
        sort,
        isActive,
        departmentId,
        city,
        center,
        search,
      }) => ({
        url: getTechnicians,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: cleanParams({
          pageSize,
          pageIndex,
          sort,
          isActive,
          departmentId,
          city,
          center,
          search,
        }),
      }),
    }),
    getTechnicianById: builder.query({
      query: ({ id }) => ({
        url: `${BaseTechniciansUrl}/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      transformResponse: (response) => {
        return response;
      },
    }),
    getCureentTechnician: builder.query({
      query: () => ({
        url: `${BaseTechniciansUrl}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      transformResponse: (response) => {
        return response;
      },
    }),
    getAvaliableDepartments: builder.query({
      query: () => ({
        url: `${BaseTechniciansUrl}/available-departments`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      transformResponse: (response) => {
        return response;
      },
    }),
  }),
});

export const {
  useGetTechnicianDashboardQuery,
  useGetTopTechniciansApiQuery,
  useGetTechnicianByIdQuery,
  useGetCureentTechnicianQuery,
  useGetAvaliableDepartmentsQuery,
} = techniciansApi;
