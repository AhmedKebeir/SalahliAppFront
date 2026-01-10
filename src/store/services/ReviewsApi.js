import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AnyUserReviews,
  BaseUrl,
  CountReviewsForTechnician,
  TechnicianReviews,
  UserReviews,
} from "../../APIs/Api";
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

export const reviewsApi = createApi({
  reducerPath: "reviewsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BaseUrl,
  }),
  endpoints: (builder) => ({
    getAllReviewsByUser: builder.query({
      query: ({
        pageIndex,
        pageSize = 8,
        sort,
        orderId,
        userId,
        technicianId,
      }) => {
        return {
          url: UserReviews,

          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: cleanParams({
            pageIndex,
            pageSize,
            sort,
            orderId,
            userId,
            technicianId,
          }),
        };
      },
      transformResponse: (response) => response,
    }),
    getAllReviewsByAnyUser: builder.query({
      query: ({
        pageIndex,
        pageSize = 8,
        sort,
        orderId,
        userId,
        technicianId,
      }) => {
        return {
          url: AnyUserReviews,

          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: cleanParams({
            pageIndex,
            pageSize,
            sort,
            orderId,
            userId,
            technicianId,
          }),
        };
      },
      transformResponse: (response) => response,
    }),
    getAllReviewsForTechnician: builder.query({
      query: ({
        pageIndex,
        pageSize = 8,
        sort,
        orderId,
        userId,
        technicianId,
      }) => {
        return {
          url: TechnicianReviews,

          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: cleanParams({
            pageIndex,
            pageSize,
            sort,
            orderId,
            userId,
            technicianId,
          }),
        };
      },
      transformResponse: (response) => response,
    }),
    getAllReviewsByTechnicianId: builder.query({
      query: ({ id }) => {
        return {
          url: `${CountReviewsForTechnician}/${id}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      transformResponse: (response) => response,
    }),
  }),
});

export const {
  useGetAllReviewsByUserQuery,
  useGetAllReviewsByAnyUserQuery,
  useGetAllReviewsByTechnicianIdQuery,
  useGetAllReviewsForTechnicianQuery,
} = reviewsApi;
