import { FaCloudUploadAlt } from "react-icons/fa";

import Logo from "../../Components/Logo";
import { useState } from "react";
import {
  useGetAllCategoryQuery,
  useGetTopFourCategoriesQuery,
} from "../../store/services/CategoriesApi";
import axios from "axios";
import { BaseTechniciansUrl, BaseUrl } from "../../APIs/Api";
import Cookie from "cookie-universal";
import { useNavigate } from "react-router-dom";

export default function TechnicianRegister() {
  const [loading, setLoading] = useState(false);
  const cookie = Cookie();
  const nav = useNavigate();
  const { data } = useGetAllCategoryQuery();
  const [image, setImage] = useState(null);

  const [err, setErr] = useState(null);
  const [experienceYears, setExperienceYears] = useState(null);
  const [departments, setDepartments] = useState(null);
  const [idCard, setIdCard] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // تحويل الملف لرابط عرض مؤقت
      setIdCard(file);
    }
  };

  const [categories, setCategories] = useState([]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    const id = Number(e.target.id); // ← مهم جداً

    if (categories.some((c) => c.id === id)) {
      setCategories(categories.filter((c) => c.id !== id));
    } else {
      setCategories([...categories, { id, name: value }]);
    }
  };
  const dataShow = Array.isArray(data)
    ? data.map((item) => (
        <div key={item?.id} className="category-option">
          <span>{item?.name}</span>
          <input
            id={item?.id}
            type="checkbox"
            value={item?.name}
            onChange={handleCategoryChange}
            checked={categories.some((c) => c.id === Number(item?.id))}
          />
        </div>
      ))
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!experienceYears || !categories.length) {
        setErr("يرجى ملء جميع الحقول!");
        return;
      }
      const token = cookie.get("token");
      const formData = new FormData();
      formData.append("experienceYears", experienceYears);
      categories.forEach((cat, index) => {
        formData.append(`Departments[${index}].Id`, cat.id);
        formData.append(`Departments[${index}].Name`, cat.name);
      });
      formData.append("idCard", idCard);
      const res = await axios.post(
        `${BaseUrl}/${BaseTechniciansUrl}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status == 200) {
        nav("/technician-dashboard");
      }
    } catch (err) {
      setErr("حدث خطأ في التسجيل!");
    } finally {
      setLoading(false);
    }
  };
  console.log(experienceYears);

  return (
    <div className="tech-register bg-section">
      <div className="container">
        <Logo />
        <h2>استكمال الملف الشخصي</h2>
        <p>يرجى ادخال البيانات كامله لتوثيق حسابك لكسب ثقة العملاء.</p>
        <div className="form">
          <div className="experience">
            <label htmtfor="exper">سنوات الخبرة</label>
            <input
              type="number"
              placeholder="ادخل عدد سنوات الخبرة"
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
              required
            />
          </div>
          <div className="categories">
            <label htmlFor="">اختر الأقسام المناسبة</label>
            <div className="category-list">{dataShow}</div>
          </div>
          <div className="id- card">
            <label htmlFor="">صورة بطاقة الهوية</label>
            <div className="image">
              <h3>صورة بطاقة الهوية</h3>
              <FaCloudUploadAlt />
              <h3>انقر للتحميل أو اسحب وأفلت</h3>
              <p>SVG, PNG, JPG (بحد أقصى 5 ميجابايت)</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>
          <div className="image-show">
            معاينة
            {image ? <img src={image} className="" alt="User" /> : ""}
          </div>
        </div>
        {err ? <p className="err">{err}</p> : ""}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="submit-btn"
        >
          {loading ? <span className="btn-loader"></span> : "حفظ"}
        </button>
      </div>
    </div>
  );
}
