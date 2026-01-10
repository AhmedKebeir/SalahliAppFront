import Cookie from "cookie-universal";

import axios from "axios";
import { BaseUrl } from "../APIs/Api";
import { currentUserApi } from "../store/services/CurrentUser";

export const handleLogout = async (dispatch, navigate) => {
  try {
    const cookie = Cookie();
    const token = cookie.get("token");

    if (token) {
      // إرسال طلب تسجيل الخروج للـ backend
      await axios.post(
        `${BaseUrl}/account/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    // مسح التوكن من الكوكي
    cookie.remove("token");

    // إعادة تهيئة cache الخاصة بالـ currentUser
    dispatch(currentUserApi.util.resetApiState());

    // إعادة التوجيه للصفحة الرئيسية أو login
    navigate("/login", { replace: true });
  } catch (err) {
    console.error("Logout failed:", err);
    // حتى لو فشل الطلب، نزال نزيل التوكن ونعمل redirect
    Cookie().remove("token");
    dispatch(currentUserApi.util.resetApiState());
    navigate("/login", { replace: true });
  }
};
