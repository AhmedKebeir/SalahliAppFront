import { Outlet, Navigate } from "react-router-dom";
import { useGetCurrentUserQuery } from "../../store/services/CurrentUser";
import AppLoading from "../../Components/AppLoading";

export default function RequireAuth({ role }) {
  const { data: user, isLoading, isError } = useGetCurrentUserQuery();

  if (isLoading) {
    return <AppLoading heading="جاري التحميل الموقع...." />;
  }

  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  // Role check (string أو array)
  if (role) {
    if (Array.isArray(role) && !role.includes(user.role)) {
      return <Navigate to="/login" replace />;
    }

    if (typeof role === "string" && user.role !== role) {
      return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
}
