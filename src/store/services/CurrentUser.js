import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseUrl, CurrentUser } from "../../APIs/Api";
import Cookie from "cookie-universal";

export const currentUserApi = createApi({
  reducerPath: "currentUserApi",
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
    getCurrentUser: builder.query({
      query: () => {
        const cookie = Cookie();
        const token = cookie.get("token");

        return {
          url: CurrentUser,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      transformResponse: (response) => response,
    }),
  }),
});

export const { useGetCurrentUserQuery } = currentUserApi;
