import { AiFillCaretDown, AiOutlineEye } from "react-icons/ai";
import "../Css/UpdateUserProfile.css";
import Header from "../Components/Header";
import { useEffect, useState } from "react";

import { useGetCurrentUserQuery } from "../store/services/CurrentUser";
import axios from "axios";
import { BaseUrl, UpdatePasswordApi, UpdateProfile } from "../APIs/Api";
import Cookie from "cookie-universal";
import AppLoading from "../Components/AppLoading";
import { FaEyeSlash } from "react-icons/fa6";
import { SlLock } from "react-icons/sl";

export default function UpdateUserProfile() {
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passErr, setPassErr] = useState("");
  const cookie = Cookie();
  const token = cookie.get("token");
  const {
    data: currentUser,
    refetch,
    isLoading,
    isFetching,
  } = useGetCurrentUserQuery();

  const [form, setform] = useState({
    firstName: "",
    lastName: "",
    fullName: "",
    phoneNumber: "",
    bio: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setform({
        firstName: currentUser?.displayName.split(" ")[0],
        lastName: currentUser?.displayName.split(" ")[1],
        fullName: currentUser?.fullName,
        phoneNumber: currentUser?.phoneNumber,
        bio: currentUser?.bio,
      });
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (
        form.firstName === currentUser?.displayName.split(" ")[0] &&
        form.lastName === currentUser?.displayName.split(" ")[1] &&
        form.fullName === currentUser?.fullName &&
        form.phoneNumber === currentUser?.phoneNumber &&
        form.bio === currentUser?.bio
      ) {
        console.log("form is not valid");
      } else {
        const res = await axios.put(`${BaseUrl}/${UpdateProfile}`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 200) {
          refetch();
        }
      }
    } catch (err) {
      refetch();
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  function handleChange(e) {
    setform({ ...form, [e.target.name]: e.target.value });
  }
  function handleChangePassword(e) {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  }

  const handleSubmitNewPassword = async (e) => {
    e.preventDefault();
    setPassLoading(true);
    if (passwordForm.password !== passwordForm.confirmPassword) {
      setPassErr("كلمة المرور الجديدة غير متطابقة!");
      setPassLoading(false);
      return;
    }
    try {
      const res = await axios.put(
        `${BaseUrl}/${UpdatePasswordApi}`,
        {
          currentPassword: passwordForm.oldPassword,
          newPassword: passwordForm.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.status === 200) {
        setPasswordForm({
          ...passwordForm,
          oldPassword: "",
          password: "",
          confirmPassword: "",
        });
        setPassErr("تم تحديث كلمة المرور بنجاح!");
      }
    } catch (err) {
      setPassErr(err.response.data.message);
      console.log(err);
    } finally {
      setPassLoading(false);
    }
  };
  return (
    <>
      <Header />

      <div className="Update-profile bg-page">
        {isLoading || isFetching ? (
          <AppLoading heading="جاري التحميل...." />
        ) : (
          <div className="container">
            <div className="title">
              <h2>تعديل الملف الشخصي</h2>
            </div>
            <div className="personal-info">
              <div className="title">
                <div className="info">
                  <div className="image">
                    <img src={currentUser?.image} alt="user" />
                  </div>
                  <div className="main-info">
                    <h3>بياناتي الشخصية</h3>
                    <p>الاسم, البريد الإلكتروني, رقم الهاتف, الوصف</p>
                  </div>
                </div>
                <AiFillCaretDown />
              </div>

              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="firstName">الاسم الأول</label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="ادخل الاسم الأول...."
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="lastName">الاسم الأخير</label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="ادخل الاسم الأخير...."
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="fullName">الاسم الكامل</label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="ادخل الاسم بالكامل...."
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="email">البريد الإلكتروني</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="ادخل البريد الإلكتروني...."
                    name="email"
                    readOnly
                    value={currentUser?.email}
                  />
                </div>

                <div>
                  <label htmlFor="phone">رقم الهاتف</label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="ادخل رقم الهاتف...."
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="bio">الوصف</label>
                  <input
                    id="bio"
                    type="text"
                    placeholder="ادخل الوصف...."
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? <span className="btn-loader"></span> : "تعديل"}{" "}
                </button>
              </form>
            </div>

            <div className="personal-info  update-pass">
              <div className="title">
                <div className="info">
                  <div className="main-info">
                    <h3>تغيير الرقم السري</h3>
                    <p>
                      إذا كنت ترغب في تغيير رقمك السري، يمكنك القيام بذلك من
                      هنا.
                    </p>
                  </div>
                </div>
                <AiFillCaretDown />
              </div>

              <form onSubmit={handleSubmitNewPassword}>
                <div>
                  <label htmlFor="oldPassword">كلمة المرور القديمة</label>
                  <div className="password">
                    <span>
                      <SlLock />

                      <input
                        id="oldPassword"
                        type={`${show ? "text" : "password"}`}
                        placeholder="ادخل كلمة المرور القديمة"
                        name="oldPassword"
                        onChange={handleChangePassword}
                        value={form.oldPassword}
                        required
                      />
                    </span>
                    {show ? (
                      <FaEyeSlash onClick={() => setShow(false)} />
                    ) : (
                      <AiOutlineEye onClick={() => setShow(true)} />
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="password">كلمة المرور الجديدة</label>
                  <div className="password">
                    <span>
                      <SlLock />

                      <input
                        id="password"
                        type={`${show ? "text" : "password"}`}
                        placeholder="ادخل كلمة المرور الجديدة"
                        name="password"
                        onChange={handleChangePassword}
                        value={form.password}
                        required
                      />
                    </span>
                  </div>
                </div>
                <div>
                  <label htmlFor="confirm">تأكيد كلمة المرور الجديدة</label>
                  <div className="password">
                    <span>
                      <SlLock />

                      <input
                        id="confirm"
                        type={`${show ? "text" : "password"}`}
                        placeholder="اعد كتابة كلمة المرور الجديدة"
                        name="confirmPassword"
                        onChange={handleChangePassword}
                        value={form.confirmPassword}
                        required
                      />
                    </span>
                  </div>
                </div>
                {passErr && <p className="err">{passErr}</p>}
                <div className="btns">
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={passLoading}
                  >
                    {passLoading ? (
                      <span className="btn-loader"></span>
                    ) : (
                      "تغيير"
                    )}{" "}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
