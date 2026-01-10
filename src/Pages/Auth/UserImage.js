import { useState } from "react";
import { TbCameraPlus } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../Components/Logo";
import axios from "axios";
import { BaseUrl, UpdateImage } from "../../APIs/Api";
import Cookie from "cookie-universal";

export default function UserImage() {
  const [loading, setLoading] = useState(false);
  const cookie = Cookie();
  const nav = useNavigate();
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [err, setErr] = useState("لم يتم حفظ الصورة!");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // تحويل الملف لرابط عرض مؤقت
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!imageFile) return;
      const formData = new FormData();
      formData.append("image", imageFile);
      const res = await axios.put(`${BaseUrl}/${UpdateImage}`, formData, {
        headers: {
          Authorization: "Bearer " + cookie.get("token"),
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status === 200) {
        if (sessionStorage.getItem("accountType") === "user") {
          nav("/home");
        } else if (sessionStorage.getItem("accountType") === "technician") {
          nav("/tech-register");
        }
      }
      console.log(res);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="user-image">
      <div className="container">
        <Logo />
        <h2>إرفاق صورة لملفك التعريفي</h2>
        <p>الصورة الواضحة تساعد على بناء الثقة مع المستخدمين.</p>
        <form onSubmit={handleSubmit}>
          <div className="image ">
            {image ? (
              <img src={image} className="" alt="User" />
            ) : (
              <TbCameraPlus />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ cursor: "pointer" }}
            />
          </div>
          {err ? <div className="err">{err}</div> : ""}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <span className="btn-loader"></span> : "حفظ الصورة"}
          </button>
          <Link
            to={`${
              sessionStorage.getItem("accountType") === "user"
                ? "/home"
                : sessionStorage.getItem("accountType") === "technician"
                ? "/tech-register"
                : ""
            }`}
          >
            تخطي
          </Link>
        </form>
      </div>
    </div>
  );
}
