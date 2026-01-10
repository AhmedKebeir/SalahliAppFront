import Rating from "@mui/material/Rating";
import Header from "../Components/Header";
import "../Css/RequestDetails.css";
import { useState } from "react";
// import { FaRegCheckCircle } from "react-icons/fa";
import { FaCheck, FaMotorcycle, FaUserCheck } from "react-icons/fa";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { AiFillTool } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { useGetOrderDetailsQuery } from "../store/services/ordersApi";
import { BaseUrl, orderApi } from "../APIs/Api";
import axios from "axios";
import Cookie from "cookie-universal";
import { BsBan } from "react-icons/bs";
import AppLoading from "../Components/AppLoading";

export default function RequestDetails() {
  const [unSendLoading, setUnSendLoading] = useState(false);
  const cookie = Cookie();
  const token = cookie.get("token");
  const [imageSrc, setImageSrc] = useState(null);
  console.log(imageSrc);
  const params = useParams();

  const { data: order, isFetching, isLoading } = useGetOrderDetailsQuery({
    id: params.id,
  });

  console.log(order?.technician?.averageRating);

  const status = {
    Pending: 1,
    Accepted: 2,
    OnTheWay: 3,
    InProgress: 4,
    Finished: 5,
    Cancelled: 6,
  };

  const orderstatus = {
    Pending: "قيد الانتظار",
    Accepted: "تم قبول الطلب",
    OnTheWay: "الفني في الطريق",
    InProgress: "جاري العمل",
    Finished: "إكتمال الطلب",
    Cancelled: "لم يتم قبول الطلب",
  };
  const nav = useNavigate();
  const cancelRequest = async (id) => {
    setUnSendLoading(true);
    try {
      if (order?.status === "Pending") {
        const res = await axios.delete(`${BaseUrl}/${orderApi}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 200) {
          nav("/my-orders");
        }
      } else {
        alert("لا يمكنك الغاء الطلب");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setUnSendLoading(false);
    }
  };
  return (
    <>
      <Header />
      <div className="request-details-page bg-page">
        {isLoading || isFetching ? (
          <AppLoading heading="جارى التحميل..." />
        ) : (
          <div className="container">
            <div className="title">
              <h2>تفاصيل الطلب</h2>
              <div className="order-status">
                حالة الطلب: {orderstatus[order?.status]}
              </div>
            </div>
            <div className="content">
              <section>
                <div className="summary">
                  <h3>بيانات الطلب</h3>
                  <h4>نوع الطلب</h4>
                  <p>{order?.title}</p>
                  <h4>وصف المشكلة</h4>
                  <p>{order?.description}</p>
                  <h4>رقم الهاتف</h4>
                  <p>{order?.phoneNumber}</p>
                  <h4>العنوان</h4>
                  <p>
                    {order?.address?.city} - {order?.address?.center} -{" "}
                    {order?.address?.street}
                  </p>

                  <h4>الصور المرفقة</h4>
                  <div className="image-prob">
                    {order?.imageUrls.map((item) => (
                      <img
                        src={item}
                        alt=""
                        onClick={(e) => setImageSrc(e.target.src)}
                      />
                    ))}
                  </div>
                </div>
                <div className="tech-details">
                  <h3>بيانات الفني</h3>
                  <div className="info">
                    <img src={order?.technician?.image} alt=" " />
                    <div>
                      <h4>{order?.technician?.displayName}</h4>

                      <div className="stars">
                        <Rating
                          name="half-rating"
                          value={order?.technician?.averageRating}
                          precision={0.5}
                          readOnly
                        />
                      </div>
                      <p>{order?.technician?.bio}</p>
                    </div>
                  </div>
                </div>
                <div className="address-date"></div>
              </section>
              <aside>
                <div>
                  <h3>تتبع الطلب</h3>
                  <ul>
                    <li
                      className={`${
                        status[order?.status] >= 1 ? "active" : ""
                      }`}
                    >
                      <div
                        className={`${
                          status[order?.status] >= 1 ? "active" : ""
                        }`}
                      >
                        <FaCheck />
                      </div>
                      تم استلام الطلب
                    </li>

                    <li
                      className={`${
                        status[order?.status] >= 2
                          ? "active"
                          : status[order?.status] === 1
                          ? "comming"
                          : ""
                      }`}
                    >
                      <div
                        className={`${
                          status[order?.status] >= 2 &&
                          status[order?.status] < 6
                            ? "active"
                            : status[order?.status] === 1
                            ? "comming"
                            : ""
                        }`}
                      >
                        <FaUserCheck />
                      </div>
                      تم قبول الطلب
                    </li>
                    {order?.status === 6 ? (
                      <li
                        className={`${
                          status[order?.status] === 6 ? "activeCancel" : ""
                        }`}
                      >
                        <div
                          className={`${
                            status[order?.status] === 6 ? "activeCancel" : ""
                          }`}
                        >
                          <BsBan />
                        </div>
                        تم رفض الطلب
                      </li>
                    ) : null}

                    <li
                      className={`${
                        status[order?.status] >= 3 && status[order?.status] < 6
                          ? "active"
                          : status[order?.status] === 2
                          ? "comming"
                          : ""
                      }`}
                    >
                      <div
                        className={`${
                          status[order?.status] >= 3 &&
                          status[order?.status] < 6
                            ? "active"
                            : status[order?.status] === 2
                            ? "comming"
                            : ""
                        }`}
                      >
                        <FaMotorcycle />
                      </div>
                      الفني في الطريق
                    </li>
                    <li
                      className={`${
                        status[order?.status] >= 4 && status[order?.status] < 6
                          ? "active"
                          : status[order?.status] === 3
                          ? "comming"
                          : ""
                      }`}
                    >
                      <div
                        className={`${
                          status[order?.status] >= 4 &&
                          status[order?.status] < 6
                            ? "active"
                            : status[order?.status] === 3
                            ? "comming"
                            : ""
                        }`}
                      >
                        <AiFillTool />
                      </div>
                      جاري العمل
                    </li>
                    <li
                      className={`${
                        status[order?.status] === 5 && status[order?.status] < 6
                          ? "active"
                          : status[order?.status] === 4
                          ? "comming"
                          : ""
                      }`}
                    >
                      <div
                        className={`
                        ${
                          status[order?.status] === 5 &&
                          status[order?.status] < 6
                            ? "active"
                            : status[order?.status] === 4
                            ? "comming"
                            : ""
                        }
                      `}
                      >
                        <IoCheckmarkDoneOutline />
                      </div>
                      إكتمال الطلب
                    </li>
                  </ul>
                  <button
                    className={`submit-btn  ${
                      status[order?.status] >= 2 ? "not-active" : ""
                    }`}
                    onClick={() => {
                      if (order?.status === "Pending") {
                        cancelRequest(order?.id);
                      }
                    }}
                    disabled={unSendLoading}
                  >
                    {unSendLoading ? (
                      <span className="btn-loader"></span>
                    ) : (
                      "إلغاء الطلب"
                    )}{" "}
                  </button>
                </div>
              </aside>
            </div>
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
          </div>
        )}
      </div>
    </>
  );
}
