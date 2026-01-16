import { Link, useNavigate } from "react-router-dom";
import Logo from "../../Components/Logo";
import { CiUser } from "react-icons/ci";
import { SlLock } from "react-icons/sl";
import { AiOutlineEye } from "react-icons/ai";

import "../../Css/Auth.css";
import { useState } from "react";
import { FaEyeSlash } from "react-icons/fa6";
import axios from "axios";
import { BaseUrl, ForgetPasswordApi, LoginUser } from "../../APIs/Api";
import Cookie from "cookie-universal";
import { useDispatch } from "react-redux";
import { currentUserApi } from "../../store/services/CurrentUser";

export default function ForgetPassword() {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    email: "",
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
    try {
      const res = await axios.post(
        `${BaseUrl}/${ForgetPasswordApi}?email=${form.email}`,
        {}
      );
      if (res.status === 200) {
        sessionStorage.setItem("forget-password-email", form.email);
        nav("/verify-reset-password");
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
        <h2>استرداد كلمة المرور</h2>
        <p>أدخل بريدك الإلكتروني المسجل في حسابك</p>
        <form onSubmit={handelSubmit}>
          <label htmlFor="email">اسم المستخدم او البريد الإلكتروني</label>
          <div className="username">
            <CiUser />

            <input
              id="email"
              type="text"
              placeholder="ادخل اسم المستخدم أو البريد الإلكتروني"
              name="email"
              value={form.email}
              onChange={handelChange}
              required
            />
          </div>

          {err ? <div className="err">{err}</div> : ""}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <span className="btn-loader"></span>
            ) : (
              "استرداد كلمة المرور"
            )}
          </button>
        </form>
        <div className="other">
          <span>العودة إلى تسجيل الدخول</span>
        </div>
        <div className="create">
          <Link to="/login"> العودة إلى تسجيل الدخول</Link>
        </div>
      </div>
      <aside>
        <h2>صلحلي</h2>
        <p>خبراء الصيانة بين يديك</p>
      </aside>
    </div>
  );
}
