import { BsFillHouseCheckFill } from "react-icons/bs";
import { CiStar } from "react-icons/ci";
import { FaListCheck, FaUserGear, FaUsers } from "react-icons/fa6";
import { LuBellRing } from "react-icons/lu";
import { Link } from "react-router-dom";
import { FaUsersCog } from "react-icons/fa";

import { GiNotebook } from "react-icons/gi";
import { PiUserCircleCheckFill } from "react-icons/pi";
import Rating from "@mui/material/Rating";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { featchOverview } from "../../store/slices/dashboardSlices/overview-slice";
import { useGetAdminDashboardQuery } from "../../store/services/AdminDashboardApi";
import AppLoading from "../../Components/AppLoading";

export default function OverviewAdmin() {
  // const overview = useSelector((state) => state.dashboard);
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(featchOverview());
  // }, []);

  const { data: overview, isFetching, isLoading } = useGetAdminDashboardQuery();

  function formatOrderDate(dateString) {
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

  const lastOrdersShow =
    Array.isArray(overview?.lastOrders) && overview?.lastOrders.length > 0 ? (
      overview.lastOrders.map((item) => (
        <tr key={item?.id}>
          <td>{item?.id}</td>
          <td>{item?.user?.displayName || "بدون اسم"}</td>
          <td>{item?.technician?.displayName || "بدون اسم"}</td>
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
            <Link to={`orders/${item?.id}`}>التفاصيل</Link>
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

  const topTechShow =
    Array.isArray(overview?.topTechnicians) &&
    overview?.topTechnicians.length > 0
      ? overview.topTechnicians.map((item) => (
          <li key={item?.id}>
            <Link to={`/technicians/${item?.id}`}>
              <div className="data">
                <img src={item?.image || ""} alt="" />
                <div className="info">
                  <h4>{item?.displayName || "بدون اسم"}</h4>
                  <p>{item?.experienceYears || 0} سنوات خبرة</p>
                </div>
              </div>

              <div className="rate">
                <Rating
                  name="half-rating"
                  defaultValue={0}
                  precision={0.5}
                  max={1}
                  readOnly
                />
                <span>{item?.averageRating || 0}</span>
              </div>
            </Link>
          </li>
        ))
      : "";

  const techs = (
    <div className="summry-technician">
      <div className="title">
        <h3>ملخص أداء الفنيين </h3>
        <Link to="technicians">عرض الكل</Link>
      </div>
      <ul>{topTechShow}</ul>
    </div>
  );

  return (
    <div className="dash-overview bg-page">
      {isFetching || isLoading ? (
        <AppLoading heading="جاري تحميل الصفحة" />
      ) : (
        <>
          <div className="dash-boxs">
            <Link to="users">
              <h3>
                إجمالي المستخدمين <FaUsers />
              </h3>
              <p>{overview?.totalUsers || 0}</p>
              <span>عدد المستخدمين للموقع</span>
            </Link>
            <Link to="technicians">
              <h3>
                إجمالي الفنيين <FaUsersCog />
              </h3>
              <p>{overview?.totalTechnicians || 0}</p>
              <span>عدد الفنيين في الموقع</span>
            </Link>
            <Link>
              <h3>
                الفنيون النشطون
                <PiUserCircleCheckFill />
              </h3>
              <p>{overview?.totalsActiveTechnicians || 0}</p>
              <span>فنيون نشطون الآن</span>
            </Link>
            <Link to="orders">
              <h3>
                إجمالي الطلبات <GiNotebook />
              </h3>
              <p>{overview?.orderCounter || 0}</p>
              <span>طلبات خلال هذا الشهر</span>
            </Link>
          </div>

          <section className="">
            <div className="last-orders">
              <div className="title">
                <h3>أحدث الطلبات</h3>
                <Link to="orders">عرض الكل </Link>
              </div>
              <div className="table">
                <table>
                  <thead>
                    <tr>
                      <th>رقم الطلب</th>
                      <th>اسم العميل</th>
                      <th>اسم الفني</th>
                      <th>نوع الخدمة </th>
                      <th>تاريخ الطلب</th>
                      <th>الحالة</th>
                      <th>الإجراء</th>
                    </tr>
                  </thead>
                  <tbody>{lastOrdersShow}</tbody>
                </table>
              </div>
            </div>
            {techs}
          </section>
        </>
      )}
    </div>
  );
}
