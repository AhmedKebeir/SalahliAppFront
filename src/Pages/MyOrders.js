import { AiOutlinePlusCircle } from "react-icons/ai";
import Header from "../Components/Header";
import { Link, NavLink } from "react-router-dom";
import "../Css/MyOrder.css";
import { useEffect, useRef, useState } from "react";
import Pagination from "@mui/material/Pagination";
import { useGetUserOrdersQuery } from "../store/services/ordersApi";
import AppLoading from "../Components/AppLoading";

export default function MyOrders() {
  const topRef = useRef(null);
  const savedPage =
    parseInt(sessionStorage.getItem("pageIndexOrdersUser")) || 1;
  const [page, setPage] = useState(savedPage);
  const [status, setStatus] = useState(null);

  const { data: orders, isLoading, isFetching } = useGetUserOrdersQuery({
    status: status !== "active" ? status : null,
    pageIndex: page,
    activity: status === "active" ? status : null,
  });

  const handleChange = (event, value) => {
    if (value === page) return;
    setPage(value);
    sessionStorage.setItem("pageIndexOrdersUser", value);
  };

  const totalPages = Math.ceil((orders?.count || 1) / (orders?.pageSize || 8));

  function formatOrderDate(dateString) {
    if (!dateString) return "—"; // لو التاريخ null أو undefined أو ""

    const date = new Date(dateString);

    // لو التاريخ غير صالح
    if (isNaN(date.getTime())) return "—";

    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  }

  const orderstatus = {
    Pending: "قيد الانتظار",
    Accepted: "تم قبول الطلب",
    OnTheWay: "الفني في الطريق",
    InProgress: "جاري العمل",
    Finished: "إكتمال الطلب",
    Cancelled: "لم يتم قبول الطلب",
  };

  const ordersShow =
    Array.isArray(orders?.data) && orders.data.length > 0 ? (
      orders.data.map((item) => (
        <tr key={item?.id}>
          <td>{item?.id}#</td>

          <td>{item?.technician?.displayName || "بدون اسم"}</td>
          <td>{item?.title}</td>
          <td>{formatOrderDate(item?.createAt)}</td>
          <td>{orderstatus[item?.status]}</td>
          <td>
            {item?.status === "Pending" ? (
              "انتظر الانتهاء"
            ) : item?.status === "Finished" ? (
              <Link to={`/order-rating/${item?.id}`}>تقييم الطلب</Link>
            ) : (
              "انتظر الانتهاء"
            )}
          </td>
          <td>
            <Link className="details" to={`${item?.id}`}>
              التفاصيل
            </Link>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={7} style={{ textAlign: "center", display: "table-cell" }}>
          لا يوجد طلبات
        </td>
      </tr>
    );
  useEffect(() => {
    topRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [page]);

  return (
    <>
      <Header />
      <div className="my-orders bg-page">
        <div className="container">
          <div className="title">
            <div className="info">
              <h1>طلباتي</h1>
              <p>تتبع وإدارة طلبات صيانة الأجهزة المنزلية الخاصة بك</p>
            </div>
            <Link to="/categories" className="btn">
              <AiOutlinePlusCircle />
              طلب خدمة جديدة
            </Link>
          </div>

          <div className="links">
            <span
              className={status === null ? "active" : null}
              onClick={() => setStatus(null)}
            >
              الكل
            </span>
            <span
              className={status === "Pending" ? "active" : ""}
              onClick={() => setStatus("Pending")}
            >
              قيد الإنتظار
            </span>
            <span
              className={status === "active" ? "active" : ""}
              onClick={() => setStatus("active")}
            >
              نشطة
            </span>
            <span
              className={status === "Finished" ? "active" : ""}
              onClick={() => setStatus("Finished")}
            >
              {" "}
              المكتملة
            </span>
          </div>

          <div className="table" ref={topRef}>
            {isLoading || isFetching ? (
              <AppLoading />
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>رقم الطلب</th>

                    <th>اسم الفني</th>
                    <th>نوع الخدمة </th>
                    <th>تاريخ الطلب</th>
                    <th>الحالة</th>
                    <th>تقييم الطلب</th>
                    <th>الإجراء</th>
                  </tr>
                </thead>
                <tbody>{ordersShow}</tbody>
              </table>
            )}
          </div>
          <div className="pagin">
            <Pagination
              count={totalPages}
              value={page}
              page={page}
              onChange={handleChange}
              variant="outlined"
              color="primary"
              siblingCount={1}
              boundaryCount={1}
            />
          </div>
        </div>
      </div>
    </>
  );
}
