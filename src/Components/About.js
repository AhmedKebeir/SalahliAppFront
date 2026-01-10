import { Link } from "react-router-dom";
import Logo from "./Logo";
import "../Css/Components/About.css";

export default function About() {
  return (
    <div className="about">
      <div className="container d-flex">
        <ul>
          <li>
            <Logo />
          </li>
          <li>شريكك الموثوق لإصلاح الأجهزة المنزلية.</li>
        </ul>
        <ul>
          <li>الشركة</li>
          <li>
            <Link to="">من نحن</Link>
          </li>
          <li>
            <Link to="">الوظائف</Link>
          </li>
          <li>
            <Link to="">الفنيون</Link>
          </li>
        </ul>
        <ul>
          <li>الدعم</li>
          <li>
            <Link to="">الأسئلة الشائعة</Link>
          </li>
          <li>
            <Link to="">اتصل بنا</Link>
          </li>
          <li>
            <Link to="">مركز المساعدة</Link>
          </li>
        </ul>
        <ul>
          <li>قانوني</li>
          <li>
            <Link to="">شروط الخدمة</Link>
          </li>
          <li>
            <Link to="">سياسة الخصوصية</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
