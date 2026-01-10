import { FaListCheck } from "react-icons/fa6";
import { LuBellRing } from "react-icons/lu";
import { BsFillHouseCheckFill } from "react-icons/bs";
import { CiStar } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { FaUserGear } from "react-icons/fa6";
import { useGetTechnicianDashboardQuery } from "../../store/services/TechniciansApi";
import Cookie from "cookie-universal";
import { useState } from "react";
import axios from "axios";
import { AcceptOrder, BaseUrl, orderApi, RejectOrder } from "../../APIs/Api";
import AcceptOrderBox from "../../Components/AcceptOrderBox";
import AppLoading from "../../Components/AppLoading";

export default function Dashboard() {
  const nav = useNavigate();
  const cookie = Cookie();
  const token = cookie.get("token");
  const {
    data: technicianDashboard,
    isLoading,
    isFetching,
  } = useGetTechnicianDashboardQuery({
    token,
  });
  const [showAccept, setShowAccept] = useState(false);
  const [orderAccept, setOrderAccept] = useState(null);
  const [showReject, setShowReject] = useState(false);

  function formatOrderDate(dateString) {
    if (!dateString) return "—"; // للتأكد من وجود التاريخ
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",

      hour12: true,
    }).format(date);
  }
  const newOrdersShow = Array.isArray(technicianDashboard?.newOrders)
    ? technicianDashboard?.newOrders.map((order) => (
        <div className="order" key={order?.id}>
          <Link to={`orders/${order?.id}`}>
            <div className="data">
              {order?.user?.image ? (
                <img src={order?.user?.image} alt="" />
              ) : (
                <span className="image-hidden"></span>
              )}

              <div className="info">
                <h4>{order?.description}</h4>
                <p>
                  العميل: {order?.user?.fullName || "********"} -{" "}
                  {order?.address
                    ? `${order?.address?.city} - ${order?.address?.center} - ${order?.address?.street}`
                    : "العنوان:********"}
                </p>
              </div>
            </div>
            <span> {formatOrderDate(order?.createAt)}</span>
          </Link>
          <div className="order-btns" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => {
                setShowAccept(true);
                setOrderAccept(order?.id);
                e.stopPropagation();
              }}
            >
              قبول
            </button>
            <button
              onClick={(e) => {
                setOrderAccept(order?.id);
                setShowReject(order?.id);
              }}
            >
              رفض
            </button>
          </div>
        </div>
      ))
    : [];

  const activeOrdersShow = Array.isArray(technicianDashboard?.activeOrders)
    ? technicianDashboard.activeOrders.map((order) => (
        <Link className="order" key={order?.id}>
          <div className="data">
            <img src={order?.user?.image} alt="" />

            <div className="info">
              <h4>{order?.description}</h4>
              <p>
                العميل: {order?.user?.fullName} -{" "}
                {`${order?.address?.city} - ${order?.address?.center} - ${order?.address?.street}`}
              </p>
            </div>
          </div>

          <span>{formatOrderDate(order?.createAt)}</span>

          <div className="order-btns">
            <Link to={`orders/${order?.id}`}>عرض التفاصيل</Link>
          </div>
        </Link>
      ))
    : [];

  return (
    <div className="dash-overview bg-page">
      {isLoading || isFetching ? (
        <AppLoading heading="جاري جلب البيانات" />
      ) : (
        <>
          {" "}
          <div className="dash-boxs">
            <Link to="orders?status=active">
              <h3>
                مهامي النشطة
                <FaListCheck />
              </h3>
              <p>{technicianDashboard?.totalActiveOrders || 0}</p>
              <span>مهمة قادمة اليوم</span>
            </Link>
            <Link to="orders?status=Pending">
              <h3>
                طلبات جديدة
                <LuBellRing />
              </h3>
              <p>{technicianDashboard?.totalNewOrders || 0}</p>
              <span>في انتظار موافقتك</span>
            </Link>
            <Link to="orders?status=Finished">
              <h3>
                مكتملة مهام
                <BsFillHouseCheckFill />
              </h3>
              <p>{technicianDashboard?.totalCompletedOrders || 0}</p>
              <span>مهمة مكتملة خلال الشهر</span>
            </Link>
            <Link to="reviews">
              <h3>
                التقييمات
                <CiStar />
              </h3>
              <p>
                {technicianDashboard?.averageRating || 0} <span>/ 5</span>
              </p>
              <span>متوسط التقيمات</span>
            </Link>
          </div>
          <div className="common">
            <div className="orders">
              <div className="new-orders">
                <h3>طلبات جديدة</h3>
                {newOrdersShow}
              </div>
              <div className="current-orders">
                <h3>المهام النشطة</h3>
                {activeOrdersShow}
              </div>
            </div>
            <div className="profile">
              <div className="data">
                <div>
                  <FaUserGear />
                </div>
                <h3>إدارة الملف الشخصي</h3>
                <p>حافظ على تحديث ملفك الشخصي لجذب المزيد من العملاء.</p>
                <Link to="/user-profile">الانتقال إلى الملف الشخصي</Link>
              </div>
            </div>
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
          </div>
        </>
      )}
    </div>
  );
}
