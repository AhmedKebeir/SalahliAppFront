import { Link, useNavigate } from "react-router-dom";
import Logo from "../../Components/Logo";
import { CiUser } from "react-icons/ci";
import { SlLock } from "react-icons/sl";
import { AiOutlineEye } from "react-icons/ai";

import "../../Css/Auth.css";
import { useState } from "react";
import { FaEyeSlash } from "react-icons/fa6";
import axios from "axios";
import {
  BaseUrl,
  ForgetPasswordApi,
  LoginUser,
  ResetPasswordApi,
} from "../../APIs/Api";
import Cookie from "cookie-universal";
import { useDispatch } from "react-redux";
import { currentUserApi } from "../../store/services/CurrentUser";

export default function NewResetPassword() {
  const cookie = Cookie();
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [err, setErr] = useState(null);
  function handelChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handelSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if (form.password === form.confirmPassword) {
      setErr(null);
    } else {
      setErr("كلمتان المرور غير متطابقان");
      return;
    }
    try {
      const token = sessionStorage.getItem("reset-token");
      const email = sessionStorage.getItem("forget-password-email");
      const res = await axios.post(`${BaseUrl}/${ResetPasswordApi}`, {
        token,
        email,
        newpassword: form.password,
      });
      if (res.status === 200) {
        cookie.set("token", res.data.token);
        sessionStorage.removeItem("reset-token");
        sessionStorage.removeItem("forget-password-email");
        dispatch(currentUserApi.util.resetApiState());
        if (res.data.role === "Admin") {
          nav("/admin-dashboard");
        } else {
          nav("/home");
        }
      }
      console.log(res);
    } catch (err) {
      console.log(err.response.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="sign d-flex">
      <div className="right">
        <Logo />
        <h2>تعيين كلمة مرور جديدة</h2>
        <p>برجاء تعيين كلمة مرور جديدة</p>
        <form onSubmit={handelSubmit}>
          <label htmlFor="password">كلمة المرور الجديدة</label>
          <div className="password">
            <span>
              <SlLock />

              <input
                id="password"
                type={`${show ? "text" : "password"}`}
                placeholder="ادخل كلمة المرور الجديدة"
                name="password"
                onChange={handelChange}
                value={form.password}
                required
              />
            </span>
            {show ? (
              <FaEyeSlash onClick={() => setShow(false)} />
            ) : (
              <AiOutlineEye onClick={() => setShow(true)} />
            )}
          </div>
          <label htmlFor="confirm">تأكيد كلمة المرور الجديدة</label>
          <div className="password">
            <span>
              <SlLock />

              <input
                id="confirm"
                type={`${show ? "text" : "password"}`}
                placeholder="اعد كتابة كلمة المرور الجديدة"
                name="confirmPassword"
                onChange={handelChange}
                value={form.confirmPassword}
                required
              />
            </span>
          </div>

          {err ? <div className="err">{err}</div> : ""}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <span className="btn-loader"></span> : "تعيين"}
          </button>
        </form>
      </div>
      <aside>
        <h2>المنقذ</h2>
        <p>خبراء الصيانة بين يديك</p>
      </aside>
    </div>
  );
}
