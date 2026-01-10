import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import { BsCheck2Circle } from "react-icons/bs";
import { FaRegFile } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import "../Css/RequestService.css";
import { styled } from "@mui/material/styles";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import Header from "../Components/Header";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useGetTechnicianByIdQuery } from "../store/services/TechniciansApi";
import { useEffect, useState } from "react";
import Cookie from "cookie-universal";
import axios from "axios";
import { BaseUrl, orderApi } from "../APIs/Api";
import { useDispatch } from "react-redux";
import { setOrder } from "../store/slices/Order-Slices/order-slice";

export default function RequestService() {
  const [imageSrc, setImageSrc] = useState(null);
  const params = useParams();
  const cookie = Cookie();
  const token = cookie.get("token");
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { data: technician } = useGetTechnicianByIdQuery({ id: params?.id });

  const [images, setImages] = useState([]);

  useEffect(() => {
    if (technician?.id) {
      setForm((prev) => ({
        ...prev,
        technicianId: technician.id,
      }));
    }
  }, [technician]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    technicianId: technician?.id,
    departmentId: "",
    phoneNumber: "",
    city: "",
    center: "",
    street: "",
    imageList: [],
  });
  function handleImageChange(e) {
    const files = Array.from(e.target.files);

    // 1) إضافة الصور للعرض (Base64)
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages((prev) => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });

    // 2) إضافة الملفات نفسها إلى الفورم
    setForm((prev) => ({
      ...prev,
      imageList: [...prev.imageList, ...files], // حفظ الملفات
    }));
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleSelectChange = (e) => {
    const selectedIndex = e.target.selectedIndex;
    const selectedOption = e.target.options[selectedIndex];

    setForm({
      ...form,
      title: selectedOption.value, // الاسم
      departmentId: selectedOption.dataset.id, // الرقم
    });
  };

  const [err, setErr] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (
        form.title === "" ||
        form.description === "" ||
        form.phoneNumber === "" ||
        form.city === "" ||
        form.center === "" ||
        form.street === ""
      ) {
        setErr("برجاء ادخل جميع المعلومات!");
        return;
      }

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("technicianId", form.technicianId);
      formData.append("departmentId", form.departmentId);
      formData.append("phoneNumber", form.phoneNumber);
      formData.append("address.city", form.city);
      formData.append("address.center", form.center);
      formData.append("address.street", form.street);
      form.imageList.forEach((file) => formData.append("OrderImages", file));

      const res = await axios.post(`${BaseUrl}/${orderApi}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Response:", res.status, res.data);

      if (res.status === 200) {
        dispatch(setOrder(res.data));
        nav("/request-success");
      } else {
        setErr("حدث خطأ في الارسال!");
      }
    } catch (err) {
      console.error(err);
      setErr("حدث خطأ في الارسال!");
    } finally {
      setLoading(false);
    }
  };

  console.log(technician);
  console.log(form);
  return (
    <>
      <Header />

      <div className="request-service">
        <div className="container">
          {imageSrc !== null ? (
            <div className="active-image" onClick={() => setImageSrc(null)}>
              <img src={imageSrc} alt="" onClick={(e) => e.stopPropagation()} />
            </div>
          ) : (
            ""
          )}
          <div className="title">
            <h2>اطلب خدمة صيانة</h2>
            <p>اتبع الخطوات التالية لإرسال طلبك بسهولة</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form">
              <div className="serv-type">
                <label htmlFor="serv-type">نوع الخدمة:</label>
                <select
                  type="text"
                  id="serv-type"
                  placeholder="ادخل نوع الخدمة....."
                  name="title"
                  value={form.title}
                  onChange={handleSelectChange}
                  required
                >
                  <option value="">اختر نوع الخدمه</option>
                  {Array.isArray(technician?.departments)
                    ? technician?.departments.map((department) => (
                        <option
                          key={department.id}
                          value={department.name}
                          data-id={department.id}
                        >
                          {department.name}
                        </option>
                      ))
                    : []}
                </select>
              </div>
              <div className="description">
                <label htmlFor="desc">وصف المشكلة:</label>

                <textarea
                  id="desc"
                  placeholder="اكتب وصف المشكلة بالتفصيل....."
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <div className="phone">
                <label htmlFor="phone"> رقم الهاتف:</label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="ادخل رقم هاتفك للتواصل....."
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="serv-address">
                <label htmlFor="city">المحافظة</label>
                <input
                  type="text"
                  id="city"
                  placeholder="ادخل محافظتك"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="center">المركز</label>
                <input
                  type="text"
                  id="center"
                  placeholder="ادخل المركز التابع له"
                  name="center"
                  value={form.center}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="street">الشارع</label>
                <input
                  type="text"
                  id="street"
                  placeholder="ادخل اسم الشارع"
                  name="street"
                  value={form.street}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="image">
                <label>إرفاق صور للمشكلة (اختياري):</label>
                <div className="serv-image">
                  <FaCloudUploadAlt />
                  <h3>انقر للتحميل أو اسحب وأفلت</h3>
                  <p>SVG, PNG, JPG (بحد أقصى 5 ميجابايت)</p>
                  <input type="file" multiple onChange={handleImageChange} />
                </div>
              </div>

              <div className="image-show">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt="service"
                    onClick={(e) => setImageSrc(e.target.src)}
                  />
                ))}
              </div>
            </div>
            <div className="summary-order">
              <h3>ملخص الطلب</h3>
              <div>
                <h4>الفني</h4>
                <p>{technician?.displayName}</p>
              </div>
              <div>
                <h4>الخدمة المطلوبة</h4>
                <p>{form.title}</p>
              </div>
              {err ? <div className="err">{err}</div> : ""}
              <button
                type="submit"
                onClick={handleSubmit}
                className="submit-btn"
                disabled={loading}
              >
                {loading ? <span className="btn-loader"></span> : "إرسال الطلب"}{" "}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
