import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BaseUrl, getAllDepartments } from "../../APIs/Api";
import axios from "axios";

export default function CreateDepartment() {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: null,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: URL.createObjectURL(file) });
      setImageFile(file); // تحويل الملف لرابط عرض مؤقت
    }
  };
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (form.image !== null || form.description !== "" || form.name !== "") {
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("description", form.description);
        formData.append("imageUrl", imageFile);

        const response = await axios.post(
          `${BaseUrl}/${getAllDepartments}`,
          formData,
          {
            headers: {
              Accept: "application/json",

              // مهم: لا تضيف Content-Type هنا !!!
            },
          }
        );
        console.log(response);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="create-department bg-page">
      <div className="title">
        <h2>إنشاء قسم خدمة جديد</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">اسم القسم</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="اسم القسم"
              value={form.name}
              onChange={handleChange}
              required
            />

            <label htmlFor="description">وصف القسم</label>
            <textarea
              id="description"
              name="description"
              type="text"
              placeholder="ادخل وصفا موجزا للقسم الذي تريد انشاؤه..."
              value={form.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="image">
            <img src={form.image} alt="" />
            <h3>إضافة صورة القسم</h3>
            <FaCloudUploadAlt />
            <h3>انقر للتحميل أو اسحب وأفلت</h3>
            <p>SVG, PNG, JPG (بحد أقصى 5 ميجابايت)</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>

          <div className="btns">
            <button type="submit" disabled={loading}>
              {loading ? <span className="btn-loader"></span> : "إنشاء القسم"}
            </button>
            <Link to="/admin-dashboard/categories">إلغاء</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
