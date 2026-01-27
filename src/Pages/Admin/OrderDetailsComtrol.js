import Rating from "@mui/material/Rating";
import { useEffect, useState } from "react";
import { AiFillTool } from "react-icons/ai";
import { FaCheck, FaMotorcycle, FaUserCheck } from "react-icons/fa";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import { useGetOrderDetailsQuery } from "../../store/services/ordersApi";
import Cookie from "cookie-universal";
import { useGetCurrentUserQuery } from "../../store/services/CurrentUser";
import { BaseUrl, orderApi, RejectOrder } from "../../APIs/Api";
import axios from "axios";
import AcceptOrderBox from "../../Components/AcceptOrderBox";
import { BsBan } from "react-icons/bs";
import AppLoading from "../../Components/AppLoading";

export default function OrderDetailsComtrol() {
  const { data: user } = useGetCurrentUserQuery();
  const [status, setStatus] = useState(1);
  const [imageSrc, setImageSrc] = useState(null);
  const [updateOrder, setUpdateOrder] = useState(false);
  const [selectStatus, setSelectStatus] = useState(null);

  const params = useParams();

  const cookie = Cookie();
  const token = cookie.get("token");

  const {
    data: order,
    refetch,
    isLoading,
    isFetching,
  } = useGetOrderDetailsQuery({
    id: params?.id,
    token,
  });

  const [showAccept, setShowAccept] = useState(false);
  const [orderAccept, setOrderAccept] = useState(order?.id);
  const [showReject, setShowReject] = useState(false);

  const techShow = (
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
      <Link to={`/technicians/${order?.technician?.id}`}>عرض الملف الشخصي</Link>
    </div>
  );

  const statusNumber = {
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

  const handleUpdateOrder = async () => {
    if (!selectStatus) return;
    if (selectStatus == 3) {
      try {
        const res = await axios.put(
          `${BaseUrl}/${orderApi}/ontheway/${order?.id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        );
        console.log(res);
        if (res.status === 200) {
          setSelectStatus(3);
          setUpdateOrder(false);
          refetch();
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (selectStatus == 4) {
      try {
        const res = await axios.put(
          `${BaseUrl}/${orderApi}/inprogress/${order?.id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        );
        console.log(res);
        if (res.status === 200) {
          setSelectStatus(4);
          setUpdateOrder(false);
          refetch();
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (selectStatus == 5) {
      try {
        const res = await axios.put(
          `${BaseUrl}/${orderApi}/finish/${order?.id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        );
        console.log(res);
        if (res.status === 200) {
          setSelectStatus(5);
          setUpdateOrder(false);
          refetch();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div className="order-control bg-page">
      {isLoading || isFetching ? (
        <AppLoading heading="جاري تحميل الطلب" />
      ) : (
        <>
          <div className="title">
            <h2>تفاصيل الطلب</h2>
            <div className="order-status">
              {" "}
              حالة الطلب: {orderstatus[order?.status]}
            </div>
          </div>

          <div className="content">
            <section>
              <div className="summary">
                <h3>بيانات الطلب</h3>
                <h4>نوع المشكلة</h4>
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
                  {Array.isArray(order?.imageUrls)
                    ? order?.imageUrls.map((item) => (
                        <img
                          key={item}
                          src={item}
                          alt=""
                          onClick={(e) => setImageSrc(e.target.src)}
                        />
                      ))
                    : ""}
                </div>
              </div>
              {user?.role !== "Technician" ? techShow : ""}
              <div className="tech-details">
                <h3>بيانات المستخدم</h3>
                <div className="info">
                  {order?.user?.image ? (
                    <img src={order?.user?.image} alt=" " />
                  ) : (
                    <span className="image-hidden"></span>
                  )}

                  <div>
                    <h4>{order?.user?.displayName}</h4>

                    <p>{order?.user?.bio}</p>
                  </div>
                </div>
                <Link>عرض الملف الشخصي</Link>
              </div>
              <div className="address-date"></div>
            </section>
            <aside>
              <div>
                <h3>تتبع الطلب</h3>
                <ul>
                  <li
                    className={`${
                      statusNumber[order?.status] >= 1 ? "active" : ""
                    }`}
                  >
                    <div
                      className={`${
                        statusNumber[order?.status] >= 1 ? "active" : ""
                      }`}
                    >
                      <FaCheck />
                    </div>
                    تم استلام الطلب
                  </li>

                  <li
                    className={`${
                      statusNumber[order?.status] >= 2
                        ? "active"
                        : statusNumber[order?.status] === 1
                        ? "comming"
                        : ""
                    }`}
                  >
                    <div
                      className={`${
                        statusNumber[order?.status] >= 2 &&
                        statusNumber[order?.status] < 6
                          ? "active"
                          : statusNumber[order?.status] === 1
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
                        statusNumber[order?.status] === 6 ? "activeCancel" : ""
                      }`}
                    >
                      <div
                        className={`${
                          statusNumber[order?.status] === 6
                            ? "activeCancel"
                            : ""
                        }`}
                      >
                        <BsBan />
                      </div>
                      تم رفض الطلب
                    </li>
                  ) : null}

                  <li
                    className={`${
                      statusNumber[order?.status] >= 3 &&
                      statusNumber[order?.status] < 6
                        ? "active"
                        : statusNumber[order?.status] === 2
                        ? "comming"
                        : ""
                    }`}
                  >
                    <div
                      className={`${
                        statusNumber[order?.status] >= 3 &&
                        statusNumber[order?.status] < 6
                          ? "active"
                          : statusNumber[order?.status] === 2
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
                      statusNumber[order?.status] >= 4 &&
                      statusNumber[order?.status] < 6
                        ? "active"
                        : statusNumber[order?.status] === 3
                        ? "comming"
                        : ""
                    }`}
                  >
                    <div
                      className={`${
                        statusNumber[order?.status] >= 4 &&
                        statusNumber[order?.status] < 6
                          ? "active"
                          : statusNumber[order?.status] === 3
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
                      statusNumber[order?.status] === 5 &&
                      statusNumber[order?.status] < 6
                        ? "active"
                        : statusNumber[order?.status] === 4
                        ? "comming"
                        : ""
                    }`}
                  >
                    <div
                      className={`
                                    ${
                                      statusNumber[order?.status] === 5 &&
                                      statusNumber[order?.status] < 6
                                        ? "active"
                                        : statusNumber[order?.status] === 4
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
                {user?.role === "Technician" && order?.status === "Pending" ? (
                  <>
                    <button
                      className="accept-order"
                      onClick={(e) => {
                        setShowAccept(true);
                        setOrderAccept(order?.id);
                        e.stopPropagation();
                      }}
                    >
                      قبول الطلب
                    </button>
                    <button
                      className="cancel-order"
                      onClick={(e) => {
                        setShowReject(true);
                        setOrderAccept(order?.id);
                      }}
                    >
                      رفض الطلب
                    </button>
                  </>
                ) : (
                  ""
                )}
                {user?.role === "Technician" &&
                order?.status !== "Pending" &&
                order?.status !== "Finished" ? (
                  <button
                    className="update-order"
                    onClick={() => setUpdateOrder(true)}
                  >
                    تعديل الطلب
                  </button>
                ) : (
                  ""
                )}
                {updateOrder ? (
                  <div
                    className="update-order-box"
                    onClick={() => setUpdateOrder(false)}
                  >
                    <div
                      className="update-order"
                      onClick={(e) => e.stopPropagation(e)}
                    >
                      <h2>تعديل حالة الطلب #{order?.id}</h2>
                      <label>اختر حالة الطلب</label>
                      <select
                        value={selectStatus}
                        onChange={(e) => setSelectStatus(e.target.value)}
                      >
                        <option value={null}>-- اختر الحالة --</option>
                        <option value={3}>الفني في الطريق</option>
                        <option value={4}>جاري العمل</option>
                        <option value={5}>إكتمال الطلب</option>
                      </select>
                      <div className="buttons">
                        <button onClick={() => handleUpdateOrder()}>
                          تعديل
                        </button>
                        <button
                          onClick={() => {
                            setSelectStatus(null);
                            setUpdateOrder(false);
                          }}
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </aside>
          </div>
          {imageSrc !== null ? (
            <div className="active-image" onClick={() => setImageSrc(null)}>
              <img src={imageSrc} alt="" onClick={(e) => e.stopPropagation()} />
            </div>
          ) : (
            ""
          )}

          <AcceptOrderBox
            showAccept={showAccept}
            showReject={showReject}
            orderId={orderAccept}
            onClose={() => {
              setShowAccept(false);
              setShowReject(false);
              setOrderAccept(null);
            }}
          />
        </>
      )}
    </div>
  );
}
