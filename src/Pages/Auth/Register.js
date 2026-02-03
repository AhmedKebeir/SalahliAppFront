import { CiUser } from "react-icons/ci";

import { SlLock } from "react-icons/sl";
import { AiOutlineEye, AiOutlinePhone } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineMailOutline } from "react-icons/md";
import Logo from "../../Components/Logo";
import { useState } from "react";
import axios from "axios";
import { BaseUrl, RegisterUser } from "../../APIs/Api";
import { FaEyeSlash } from "react-icons/fa6";
import Cookie from "cookie-universal";
import { useDispatch } from "react-redux";
import { currentUserApi } from "../../store/services/CurrentUser";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const cookie = Cookie();
  const nav = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [err, setErr] = useState(null);
  const [errPass, setErrPass] = useState(null);
  const [show, setShow] = useState(false);
  function handelChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  async function handelSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (!passwordRegex.test(form.password)) {
        setErr(
          "الباسورد يجب أن يحتوي على حرف كبير وصغير ورقم ورمز وليس أقل من 8 أحرف.",
        );
      }
      if (form.confirmPassword !== form.password) {
        setErrPass("كلمة المرور غير مطابقة");
      }
      const res = await axios.post(`${BaseUrl}/${RegisterUser}`, form);
      if (res.status === 200) {
        cookie.set("token", res.data.token);
        dispatch(currentUserApi.util.resetApiState());
        nav("/verify");
      }
      console.log(res);
    } catch (err) {
      setErr(err.response.message[0]);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="sign register d-flex">
      <div className="right">
        <Logo />
        <h2>إنشاء حساب جديد</h2>
        <p>انضم إلي منصة المنقذ اليوم</p>
        <div className="display-name">
          <div div className="first-name">
            <label htmlFor="firstname">الاسم الأول</label>
            <input
              id="firstname"
              type="text"
              placeholder="ادخل الاسم الأول "
              name="firstName"
              value={form.firstName}
              onChange={handelChange}
            />
          </div>

          <div className="last-name">
            <label htmlFor="lastname">الاسم الأخير</label>
            <input
              id="lastname"
              type="text"
              placeholder="ادخل الاسم الأخير "
              name="lastName"
              value={form.lastName}
              onChange={handelChange}
            />
          </div>
        </div>
        <form onSubmit={handelSubmit}>
          <label htmlFor="username">الاسم بالكامل</label>
          <div className="username">
            <CiUser />
            <input
              id="username"
              type="text"
              placeholder="ادخل اسمك الكامل"
              name="fullName"
              onChange={handelChange}
              value={form.fullName}
              required
            />
          </div>
          <label htmlFor="email">البريد الإلكتروني</label>
          <div className="username">
            <MdOutlineMailOutline />
            <input
              id="email"
              type="email"
              placeholder="ادخل البريد الإلكتروني"
              name="email"
              onChange={handelChange}
              value={form.email}
              required
            />
          </div>
          <label htmlFor="phone">ادخل رقم الهاتف</label>
          <div className="username">
            <AiOutlinePhone />
            <input
              id="phone"
              type="text"
              placeholder="ادخل رقمك الهاتف"
              name="phone"
              onChange={handelChange}
              value={form.phone}
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
          <label htmlFor="confirm">تأكيد كلمة المرور</label>
          <div className="password">
            <span>
              <SlLock />

              <input
                id="confirm"
                type={`${show ? "text" : "password"}`}
                placeholder="اعد كتابة كلمة المرور"
                name="confirmPassword"
                onChange={handelChange}
                value={form.confirmPassword}
                required
              />
            </span>
          </div>
          {err && !passwordRegex.test(form.password) ? (
            <div className="err">{err}</div>
          ) : (
            ""
          )}
          {errPass && form.confirmPassword !== form.password ? (
            <div className="err">{errPass}</div>
          ) : (
            ""
          )}
          <div className={`remmember-my ${err ? "" : "err-active"}`}>
            <div>
              <input id="remmember" type="checkbox" />
              <label htmlFor="remmember">
                أوافق على <span>الشروط والأحكام </span>
              </label>
            </div>
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <span className="btn-loader"></span> : "تسجيل الدخول"}{" "}
          </button>
        </form>
        <div className="create">
          لدي حساب بالفعل؟
          <Link to="/login">تسجيل الدخول</Link>
        </div>
      </div>
      <aside>
        <h2>المنقذ</h2>
        <p>حلول موثوقة لجميع أجهزتك المنزلية</p>
      </aside>
    </div>
  );
}
