import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import Logo from "../../Components/Logo";
import { RxExit } from "react-icons/rx";
import { AiOutlineBell } from "react-icons/ai";
import "../../Css/TechnicinaDashboard/TechnicianDashboard.css";
import { FaUser } from "react-icons/fa6";
import { RiDashboardFill } from "react-icons/ri";
import { LuBellRing } from "react-icons/lu";
import { CiStar } from "react-icons/ci";
import { IoMdMenu } from "react-icons/io";
import { useState } from "react";
import { CgWebsite } from "react-icons/cg";
import { useGetCurrentUserQuery } from "../../store/services/CurrentUser";
import { useDispatch } from "react-redux";
import { handleLogout } from "../../Components/HandleLogout";

export default function TechnicianDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: currentUser } = useGetCurrentUserQuery();
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="technician-dashboard" onClick={() => setShowMenu(false)}>
      <aside
        className={`${showMenu ? "show-menu" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <Logo />
        <ul>
          <li>
            <NavLink to="" end>
              <RiDashboardFill />
              لوحة التحكم
            </NavLink>
          </li>
          <li>
            <NavLink to="/home">
              <CgWebsite />
              الموقع
            </NavLink>
          </li>

          <li>
            <NavLink to="orders">
              <LuBellRing />
              الطلبات
            </NavLink>
          </li>
          <li>
            <NavLink to="reviews">
              <CiStar />
              التقييمات
            </NavLink>
          </li>
        </ul>
        <button onClick={() => handleLogout(dispatch, navigate)}>
          <RxExit />
          تسجيل الخروج
        </button>
      </aside>
      <div className="content">
        <div className="header">
          <h2>
            <IoMdMenu
              onClick={(e) => {
                setShowMenu(!showMenu);
                e.stopPropagation();
              }}
            />
            مرحباً {currentUser?.displayName}
          </h2>
          <div className="links ">
            <Link>
              <AiOutlineBell />
            </Link>
            <Link>
              {currentUser?.image !== "" ? (
                <img src={currentUser?.image} alt="avatar" />
              ) : (
                <FaUser />
              )}
            </Link>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
