import { configureStore } from "@reduxjs/toolkit";
import currentUser from "./slices/user-slice";
import departmentSlice from "./slices/department-slice";
import dashboardSlice from "./slices/dashboardSlices/overview-slice";
import usersSlice from "./slices/dashboardSlices/users-slice";
import techniciansSlice from "./slices/TechniciansSlices/technician-slice";
import { ordersApi } from "./services/ordersApi";
import { techniciansApi } from "./services/TechniciansApi";
import { currentUserApi } from "./services/CurrentUser";
import { categoriesApi } from "./services/CategoriesApi";
import orderSlice from "./slices/Order-Slices/order-slice";
import { reviewsApi } from "./services/ReviewsApi";
import { userApi } from "./services/UserApi";
import { adminDashboardApi } from "./services/AdminDashboardApi";

export const store = configureStore({
  reducer: {
    department: departmentSlice,
    dashboard: dashboardSlice,
    users: usersSlice,
    technicians: techniciansSlice,
    order: orderSlice,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [techniciansApi.reducerPath]: techniciansApi.reducer,
    [currentUserApi.reducerPath]: currentUserApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [reviewsApi.reducerPath]: reviewsApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [adminDashboardApi.reducerPath]: adminDashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      ordersApi.middleware,
      techniciansApi.middleware,
      currentUserApi.middleware,
      categoriesApi.middleware,
      reviewsApi.middleware,
      userApi.middleware,
      adminDashboardApi.middleware
    ),
});
