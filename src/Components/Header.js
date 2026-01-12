import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import "../Css/Components/Header.css";
import { IoMdHome, IoMdMenu } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { FaUser, FaUserPlus } from "react-icons/fa6";
import { BsX } from "react-icons/bs";
import { BiSolidCategory } from "react-icons/bi";
import { GiNotebook } from "react-icons/gi";
import { RxExit } from "react-icons/rx";
import { AiFillCaretDown } from "react-icons/ai";

import { useGetCurrentUserQuery } from "../store/services/CurrentUser";
import axios from "axios";
import { BaseUrl } from "../APIs/Api";
import Cookie from "cookie-universal";
import { handleLogout } from "./HandleLogout";
import { useDispatch } from "react-redux";

export default function Header() {
  const [yes, setYes] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showMenuWeb, setShowMenuWeb] = useState(false);
  const { data: currentUser } = useGetCurrentUserQuery();

  const cookie = Cookie();
  const token = cookie.get("token");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const phoneMenuRef = useRef(null);

  const webMenuRef = useRef(null);
  // 👉 قفل المنيو عند الضغط في أي مكان خارجها
  useEffect(() => {
    const handleClickOutside = (e) => {
      // موبايل منيو
      if (phoneMenuRef.current && !phoneMenuRef.current.contains(e.target)) {
        setShowMenu(false);
      }

      // ويب منيو
      if (webMenuRef.current && !webMenuRef.current.contains(e.target)) {
        setShowMenuWeb(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const phoneMenu = (
    <>
      <div
        ref={phoneMenuRef}
        className={`unorderd-list ${showMenu ? "active" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <ul>
          <li>
            <div className="menu-logo">
              <Logo />
              <div className="icon">
                <BsX onClick={() => setShowMenu(false)} />
              </div>
            </div>
          </li>
          <li>
            <Link to="">
              <div className="profile">
                <div className="image">
                  {currentUser?.image === "" || !currentUser ? (
                    <FaUser />
                  ) : (
                    <img src={currentUser?.image} alt="user" />
                  )}
                </div>
                <div className="info">
                  {currentUser ? (
                    <>
                      <span>مرحبا.</span>
                      <h2>{currentUser?.displayName}</h2>
                    </>
                  ) : (
                    <h2>زائر</h2>
                  )}
                </div>
              </div>
            </Link>
          </li>
          <div className="phone-links">
            <li>
              <NavLink to={`${currentUser ? "/home" : ""}`}>
                <div className="icon-name">
                  <IoMdHome />
                  الرئيسية
                </div>
                <span></span>
              </NavLink>
            </li>
            <li>
              <NavLink to={`${currentUser ? "/categories" : "/login"}`}>
                <div className="icon-name">
                  <BiSolidCategory />
                  تصفح الخدمات
                </div>
                <span></span>
              </NavLink>
            </li>
            <li className="orders">
              <NavLink to={`${currentUser ? "/my-orders" : "/login"}`}>
                <div className="icon-name">
                  <GiNotebook />
                  طلباتي
                </div>
                <span></span>
              </NavLink>
            </li>

            <li>
              <Link
                to={`${currentUser ? "/user-profile" : "/login"}`}
                className="my-profile"
              >
                <FaUser />
                ملفي الشخصي
              </Link>
            </li>
          </div>
          <div className="buttons">
            <li>
              {currentUser?.role === "User" ? (
                <button>
                  <FaUserPlus />
                  سجل كفني
                </button>
              ) : currentUser?.role === "Technician" ? (
                <button onClick={() => navigate("/technician-dashboard")}>
                  لوحة التحكم
                </button>
              ) : currentUser?.role === "Admin" ? (
                <button onClick={() => navigate("/admin-dashboard")}>
                  لوحة التحكم
                </button>
              ) : null}
            </li>
            <li>
              {currentUser ? (
                <button
                  className="log-out"
                  onClick={() => handleLogout(dispatch, navigate)}
                >
                  <RxExit />
                  تسجيل الخروج
                </button>
              ) : (
                <button className="log-out">تسجيل الدخول</button>
              )}
            </li>
          </div>
        </ul>
      </div>
    </>
  );

  return (
    <header>
      <div className="container">
        <div className="first">
          <IoMdMenu
            className="menu"
            onClick={(e) => {
              setShowMenu(!showMenu);
              e.stopPropagation();
            }}
          />
          <Logo />
          {phoneMenu}
          <ul>
            {currentUser ? (
              <>
                <li>
                  <Link to="/categories">خدماتنا</Link>
                </li>
                <li>
                  <Link to="/my-orders">طلباتي</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <a href="#how-work">كيف نعمل</a>
                </li>
                <li>
                  <a href="#categories">خدماتنا</a>
                </li>
                <li>
                  <Link to="/login">ابحث عن فني</Link>
                </li>
              </>
            )}
          </ul>
        </div>
        <div className="user-image">
          {currentUser?.image === "" || !currentUser ? (
            <FaUser />
          ) : (
            <img src={currentUser?.image} alt="user" />
          )}
        </div>
        {currentUser ? (
          <div className="user-peofile-web">
            <Link to="/categories" className="serv-btn">
              طلب خدمة
            </Link>
            <div className="profile-option">
              <div
                className="profile"
                onClick={(e) => {
                  setShowMenuWeb(!showMenuWeb);
                  e.stopPropagation();
                }}
              >
                <div className="image">
                  {currentUser?.image === "" || !currentUser ? (
                    <FaUser />
                  ) : (
                    <img src={currentUser?.image} alt="user" />
                  )}
                </div>
                <div className="info">
                  <span>مرحبا.</span>
                  <h2>{currentUser?.displayName}</h2>
                </div>
                <AiFillCaretDown
                  className={`${showMenuWeb ? "rotaion-icon" : ""}`}
                  onClick={(e) => {
                    setShowMenuWeb(!showMenuWeb);
                    e.stopPropagation();
                  }}
                />
              </div>
              <ul
                ref={webMenuRef}
                className={`${showMenuWeb ? "active" : ""}`}
                onClick={(e) => e.stopPropagation()}
              >
                <li>
                  <Link to="/user-profile" className="my-profile">
                    <FaUser />
                    ملفي الشخصي
                  </Link>
                </li>
                {currentUser?.role === "User" ? (
                  <li>
                    <button onClick={() => navigate("/tech-register")}>
                      <FaUserPlus />
                      سجل كفني
                    </button>
                  </li>
                ) : (
                  <li>
                    {currentUser?.role === "Technician" && (
                      <button onClick={() => navigate("/technician-dashboard")}>
                        لوحة التحكم
                      </button>
                    )}
                    {currentUser?.role === "Admin" && (
                      <button onClick={() => navigate("/admin-dashboard")}>
                        لوحة التحكم
                      </button>
                    )}
                  </li>
                )}

                <li>
                  <button
                    className="log-out"
                    onClick={() => handleLogout(dispatch, navigate)}
                  >
                    <RxExit />
                    تسجيل الخروج
                  </button>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="links-butns">
            <div className="btns">
              <Link to="/login" className="login-btn">
                تسجيل الدخول
              </Link>
              <Link to="/login" className="serv-btn">
                طلب خدمة
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
