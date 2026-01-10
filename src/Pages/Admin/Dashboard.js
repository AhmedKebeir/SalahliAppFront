import { useState } from "react";
import Logo from "../../Components/Logo";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { RiDashboardFill } from "react-icons/ri";
import { FaUser, FaUsers } from "react-icons/fa6";

import { RxExit } from "react-icons/rx";
import { IoMdMenu } from "react-icons/io";
import { AiOutlineBell } from "react-icons/ai";
import { FaUsersCog } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { GiNotebook } from "react-icons/gi";

import "../../Css/Admin/Dashboard.css";
import { useDispatch } from "react-redux";
import { handleLogout } from "../../Components/HandleLogout";

export default function DashboardAdmin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="admin-dashboard" onClick={() => setShowMenu(false)}>
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
            <NavLink to="categories">
              <MdCategory />
              إدارة الاقسام
            </NavLink>
          </li>
          <li>
            <NavLink to="technicians">
              <FaUsersCog />
              الفنيون
            </NavLink>
          </li>
          <li>
            <NavLink to="users">
              <FaUsers />
              المستخدمون
            </NavLink>
          </li>
          <li>
            <NavLink to="orders">
              <GiNotebook />
              الطلبات
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
            لوحة التحكم الرئيسية
          </h2>
          <div className="links ">
            <Link>
              <AiOutlineBell />
            </Link>
            <Link>
              <FaUser />
            </Link>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
