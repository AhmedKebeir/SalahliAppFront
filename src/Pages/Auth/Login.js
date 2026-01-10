import { Link, useNavigate } from "react-router-dom";
import Logo from "../../Components/Logo";
import { CiUser } from "react-icons/ci";
import { SlLock } from "react-icons/sl";
import { AiOutlineEye } from "react-icons/ai";

import "../../Css/Auth.css";
import { useState } from "react";
import { FaEyeSlash } from "react-icons/fa6";
import axios from "axios";
import { BaseUrl, LoginUser } from "../../APIs/Api";
import Cookie from "cookie-universal";
import { useDispatch } from "react-redux";
import { currentUserApi } from "../../store/services/CurrentUser";

export default function Login() {
  const nav = useNavigate();
  const cookie = Cookie();
  const token = cookie.get("token");
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    email: "",
    password: "",
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
      const res = await axios.post(`${BaseUrl}/${LoginUser}`, form);
      console.log(res);
      if (res.status === 200) {
        cookie.set("token", res.data.token);

        dispatch(currentUserApi.util.resetApiState());
        if (res.data.role === "Admin") {
          nav("/admin-dashboard");
        } else {
          nav("/home");
        }
      }
    } catch (err) {
      setErr("هناك خطأ في البريد الإلكتروني أو كلمة المرور");
      console.log(err);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="sign d-flex">
      <div className="right">
        <Logo />
        <h2>تسجيل الدخول إلي حسابك</h2>
        <p>أهلاً بك مجدداً في صلحلي</p>
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
          <label htmlFor="password">كلمة المرور</label>
          <div className="password">
            <span>
              <SlLock />
              <input
                id="password"
                type={`${show ? "text" : "password"}`}
                placeholder="ادخل كلمة المرور"
                name="password"
                value={form.password}
                onChange={handelChange}
                required
              />
            </span>
            {show ? (
              <FaEyeSlash onClick={() => setShow(false)} />
            ) : (
              <AiOutlineEye onClick={() => setShow(true)} />
            )}
          </div>
          {err ? <div className="err">{err}</div> : ""}
          <div className={`remmember-my ${err ? "" : "err-active"}`}>
            <div>
              <input id="remmember" type="checkbox" />
              <label htmlFor="remmember">تذكرني</label>
            </div>
            <Link to="">نسيت كلمة السر؟</Link>
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <span className="btn-loader"></span> : "تسجيل الدخول"}{" "}
          </button>
        </form>
        <div className="other">
          <span>أو سجل الدخول باستخدام</span>
        </div>
        <div className="sign-google">المتابعة باستخدام جوجل</div>
        <div className="create">
          ليس لديك حساب؟
          <Link to="/account-type"> إنشاء حساب جديد</Link>
        </div>
      </div>
      <aside>
        <h2>صلحلي</h2>
        <p>خبراء الصيانة بين يديك</p>
      </aside>
    </div>
  );
}
