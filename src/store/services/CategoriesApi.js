import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseDepartmentUrl, BaseUrl, landingDepartment } from "../../APIs/Api";
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

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
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
    getTopFourCategories: builder.query({
      query: ({ pageSize, pageIndex, sort, search }) => ({
        url: landingDepartment,
        params: cleanParams({ pageSize, pageIndex, sort, search }),
      }),
      transformResponse: (response) => response,
    }),
    getAllCategory: builder.query({
      query: () => ({
        url: `${BaseDepartmentUrl}`,
      }),
    }),
    getCategoryById: builder.query({
      query: ({ id }) => ({
        url: `${BaseDepartmentUrl}/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const {
  useGetTopFourCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetAllCategoryQuery,
} = categoriesApi;
