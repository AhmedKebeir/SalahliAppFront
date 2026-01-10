import { Link, useNavigate } from "react-router-dom";
import Logo from "../../Components/Logo";
import { CiUser } from "react-icons/ci";
import { SlLock } from "react-icons/sl";
import { AiOutlineEye } from "react-icons/ai";
import { FaTools } from "react-icons/fa";

import "../../Css/Auth.css";
import { useState } from "react";
import { FaUser } from "react-icons/fa6";

export default function AccountType() {
  const nav = useNavigate();

  const [type, setType] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (type === "user") {
      sessionStorage.setItem("accountType", "user");
      nav("/register");
    }
    if (type === "technician") {
      sessionStorage.setItem("accountType", "technician");
      nav("/register");
    }
  }

  return (
    <div className="sign d-flex">
      <div className="right">
        <Logo />
        <h2>اختر نوع حسابك</h2>
        <p>اختر الخيار الذي يصفك بشكل أفضل لمساعدتنا في تخصيص تجربتك.</p>
        <form onSubmit={handleSubmit}>
          <div className="account-type">
            <div>
              <input
                type="radio"
                name="accountType"
                value="user"
                id="user"
                onClick={(e) => setType(e.target.value)}
                checked={type === "user"}
              />
              <label htmlFor="user">
                <div className="title">
                  <div className="icon">
                    <FaUser />
                  </div>
                  <div></div>
                </div>
                <h3>مستخدم عادي</h3>
                <p>
                  للأفراد الذين يتطلعون إلى تصفح الخدمات وحجز المواعيد وإدارة
                  حساباتهم الشخصية.
                </p>
              </label>
            </div>
            <div>
              <input
                type="radio"
                name="accountType"
                value="technician"
                id="technician"
                onClick={(e) => setType(e.target.value)}
                checked={type === "technician"}
              />
              <label htmlFor="technician">
                <div className="title">
                  <div className="icon">
                    <FaTools />
                  </div>
                  <div></div>
                </div>
                <h3>فني</h3>
                <p>
                  للمحترفين المعتمدين الذين يقدمون الخدمات ويديرون جداولهم
                  ويتواصلون مع العملاء.
                </p>
              </label>
            </div>
          </div>
          <button type="submit" onClick={() => nav("/register")}>
            متابعة
          </button>
        </form>
      </div>
      <aside>
        <h2>صلحلي</h2>
        <p>خبراء الصيانة بين يديك</p>
      </aside>
    </div>
  );
}
