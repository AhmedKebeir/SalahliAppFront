import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  BaseUrl,
  CountOfOrdersByUserEmail,
  UserProfileApi,
} from "../../APIs/Api";
import Cookie from "cookie-universal";

const cookie = Cookie();
const token = cookie.get("token");
export const userApi = createApi({
  reducerPath: "userApi",
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
    getCountOfOrdersByUserEmail: builder.query({
      query: ({ email }) => {
        return {
          url: `${CountOfOrdersByUserEmail}/${email}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      transformResponse: (response) => response,
    }),
    getUserProfileById: builder.query({
      query: ({ id }) => {
        return {
          url: `${UserProfileApi}/${id}`,
        };
      },
      transformResponse: (response) => response,
    }),
  }),
});

export const {
  useGetCountOfOrdersByUserEmailQuery,
  useGetUserProfileByIdQuery,
} = userApi;
