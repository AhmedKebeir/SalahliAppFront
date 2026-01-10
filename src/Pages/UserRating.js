import Header from "../Components/Header";
import { BsClipboard2CheckFill } from "react-icons/bs";
import "../Css/UserRating.css";
import Rating from "@mui/material/Rating";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetOrderDetailsQuery } from "../store/services/ordersApi";
import { useState } from "react";
import axios from "axios";
import { BaseUrl, Review } from "../APIs/Api";
import Cookie from "cookie-universal";
import { FaCloudUploadAlt } from "react-icons/fa";
import AppLoading from "../Components/AppLoading";

export default function UserRating() {
  const nav = useNavigate();
  const cookie = Cookie();
  const token = cookie.get("token");
  const pageParams = useParams();
  const [loading, setLoading] = useState(false);
  const { data: order, isLoading, isFetching } = useGetOrderDetailsQuery({
    id: pageParams?.id,
  });
  console.log(order);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [imageSrc, setImageSrc] = useState(null);
  const [err, setErr] = useState(null);

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
    setImageList((prev) => [...prev, ...files]);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("Comment", comment);
      formData.append("Rating", rating);
      formData.append("TechnicianId", order?.technician?.id);

      imageList.forEach((file) => formData.append("OrderImages", file));
      const res = await axios.post(
        `${BaseUrl}/${Review}/${order?.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        nav("/my-orders");
      }
      console.log(res);
    } catch (err) {
      setErr(err);
      console.log(err);
      setErr("حدث خطأ أثناء إرسال التقييم!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="user-rating bg-page">
        {isLoading || isFetching ? (
          <AppLoading heading="جاري تحميل الصفحة..." />
        ) : (
          <>
            {imageSrc !== null ? (
              <div className="active-image" onClick={() => setImageSrc(null)}>
                <img
                  src={imageSrc}
                  alt=""
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            ) : (
              ""
            )}
            <div className="container">
              <div className="title">
                <h1>تقييم الخدمة والفني</h1>
                <p>نقدر رأيك لمساعدتنا في تحسين خدماتنا</p>
                <div className="serv-name">
                  <BsClipboard2CheckFill />
                  <span>الخدمة المنجزة رقم #{order?.id}</span>
                </div>
              </div>

              <div className="technician-details">
                <div className="image">
                  {order?.technician?.isActive ? <span></span> : ""}

                  <img src={order?.technician?.image} alt="technician" />
                </div>
                <div className="technician-info">
                  <h2>{order?.technician?.displayName}</h2>
                  <div className="stars">
                    <Rating
                      name="half-rating"
                      defaultValue={order?.technician?.averageRating}
                      value={order?.technician?.averageRating}
                      precision={0.5}
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div className="rating-box">
                <h3>تقييم الخدمة</h3>
                <div className="stars">
                  <Rating
                    name="half-rating"
                    defaultValue={rating}
                    value={rating}
                    precision={1}
                    onChange={(e) => setRating(e.target.value)}
                  />
                </div>
                <p>اضغط للتقييم</p>
              </div>

              <div className="rating-comment">
                <label htmlFor="comment">كتابة تعليقك</label>
                <textarea
                  id="comment"
                  placeholder="أخبرنا المزيد عن جودة الخدمة، تعامل الفني، والوقت..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>
              <div className="image">
                <label>إرفاق صور للمشكلة (اختياري):</label>
                <div className="serv-image">
                  <FaCloudUploadAlt />
                  <h3>انقر للتحميل أو اسحب وأفلت</h3>
                  <p>SVG, PNG, JPG (بحد أقصى 5 ميجابايت)</p>
                  <input type="file" onChange={handleImageChange} />
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
              {err && <p className="err">{err}</p>}
              <div className="links">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="btn-loader"></span>
                  ) : (
                    "إرسال التقييم"
                  )}{" "}
                </button>
                <Link to="/home">رجوع</Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
