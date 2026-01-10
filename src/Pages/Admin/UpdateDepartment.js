import { useEffect, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BaseUrl, getAllDepartments } from "../../APIs/Api";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { featchDepartmentById } from "../../store/slices/dashboardSlices/overview-slice";
import { useGetCategoryByIdQuery } from "../../store/services/CategoriesApi";
import AppLoading from "../../Components/AppLoading";

export default function UpdateDepartment() {
  const [loading, setLoading] = useState(false);
  const params = useParams();
  // const department = useSelector((state) => state.dashboard);
  const nav = useNavigate();

  const [imageFile, setImageFile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: null,
  });

  const { data: department, isLoading, isFetching } = useGetCategoryByIdQuery({
    id: params.id,
  });

  useEffect(() => {
    if (department && department.name) {
      setForm({
        name: department.name,
        description: department.description,
        image: department.imageUrl,
      });
    }
  }, [department]);

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

        const response = await axios.put(
          `${BaseUrl}/${getAllDepartments}/${params.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Accept: "application/json",

              // مهم: لا تضيف Content-Type هنا !!!
            },
          }
        );
        if (response.status === 204) {
          nav("/admin-dashboard/categories");
        }
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
        <h2>تعديل قسم الخدمة</h2>
        {isLoading || isFetching ? (
          <AppLoading heading="جاري جلب القسم " />
        ) : (
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
              <h3>تعديل صورة القسم</h3>
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
                {loading ? <span className="btn-loader"></span> : "تعديل القسم"}
              </button>
              <Link to="/admin-dashboard/categories">إلغاء</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
