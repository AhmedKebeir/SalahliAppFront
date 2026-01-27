import Pagination from "@mui/material/Pagination";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { featchAllDepartment } from "../../store/slices/department-slice";
import { Link, useSearchParams } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { featchAllOrders } from "../../store/slices/dashboardSlices/overview-slice";
import { useGetTechnicianOrdersQuery } from "../../store/services/ordersApi";
import Cookie from "cookie-universal";
import AppLoading from "../../Components/AppLoading";

export default function OrdersTechnicianControl() {
  const [searchParams] = useSearchParams();

  const savedPage = parseInt(sessionStorage.getItem("pageIndexOrders")) || 1;
  const [page, setPage] = useState(savedPage);

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [center, setCenter] = useState("");
  const [sort, setSort] = useState("");
  const [status, setStatus] = useState(searchParams.get("status") || null);
  const [userId, setUserId] = useState("");
  const [technicianId, setTechnicianId] = useState("");
  const [date, setDate] = useState(null);

  const cookie = Cookie();
  const token = cookie.get("token");

  const {
    data: orders,
    isLoading,
    isFetching,
    error,
  } = useGetTechnicianOrdersQuery({
    pageIndex: page,
    sort,
    search,
    departmentId: "",
    city,
    center,
    status: status === "active" ? null : status,
    userId,
    technicianId,
    date,
    activity: status === "active" ? "active" : null,
  });

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
  const ordersShow =
    Array.isArray(orders?.data) && orders?.data.length > 0 ? (
      orders.data.map((item) => (
        <tr key={item?.id}>
          <td>{item?.id}#</td>
          <td>{item?.user?.displayName || "بدون اسم"}</td>

          <td>{item?.title}</td>
          <td>{formatOrderDate(item?.createAt)}</td>
          <td>
            {item?.status === "Pending"
              ? "قيد الانتظار"
              : item?.status === "Finished"
              ? "تم الانتهاء"
              : "قيد التنفيذ"}
          </td>
          <td>
            <Link
              className="details"
              to={`/technician-dashboard/rating/${item?.id}`}
            >
              تقييم المستخدم
            </Link>
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
        <td colSpan={6} style={{ textAlign: "center", display: "table-cell" }}>
          لا يوجد طلبات
        </td>
      </tr>
    );

  const handleChange = (event, value) => {
    if (value === page) return;
    setPage(value);
    sessionStorage.setItem("pageIndexOrders", value);
  };

  const totalPages = Math.ceil((orders?.count || 1) / (orders?.pageSize || 8));
  return (
    <div className="tech-controle bg-page">
      <div className="title">
        <div className="info">
          <h2>إدارة اللطلبات</h2>
        </div>
      </div>

      <div className="tech-box">
        <div className="head">
          <div className="search-box">
            <span>
              <CiSearch />
            </span>
            <input
              type="text"
              name="search"
              placeholder="ابحث عن طلب..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button>بحث</button>
          </div>
          <div className="filter">
            <select name="status" onChange={(e) => setStatus(e.target.value)}>
              <option value=""> الكل</option>
              <option value={"Pending"}>المهام المعلقة</option>
              <option value={"active"}>المهام النشطة</option>
              <option value={"Finished"}>المهام المنتهية</option>
            </select>
          </div>
        </div>

        <div className="table">
          {isLoading || isFetching ? (
            <AppLoading heading="جاري جلب الطلبات" />
          ) : (
            <table>
              <thead>
                <tr>
                  <th>رقم الطلب</th>
                  <th>اسم العميل</th>

                  <th>نوع المشكلة</th>
                  <th>تاريخ الطلب</th>
                  <th>الحالة</th>
                  <th>التقييم</th>
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
  );
}
