import Pagination from "@mui/material/Pagination";
import { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { featchAllDepartment } from "../../store/slices/department-slice";
import { Link } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { featchAllOrders } from "../../store/slices/dashboardSlices/overview-slice";
import { useGetAllOrdersQuery } from "../../store/services/AdminDashboardApi";
import { useGetAllCategoryQuery } from "../../store/services/CategoriesApi";
import AppLoading from "../../Components/AppLoading";

export default function OrdersControl() {
  const topRef = useRef(null);
  const isFirstRender = useRef(true);
  const savedPage = parseInt(sessionStorage.getItem("pageIndexOrders")) || 1;
  const [page, setPage] = useState(savedPage);
  const [departmentsSelect, setDepartmentsSelect] = useState("");

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [center, setCenter] = useState("");
  const [sort, setSort] = useState("");
  const [status, setStatus] = useState(null);
  const [userId, setUserId] = useState("");
  const [technicianId, setTechnicianId] = useState("");
  const [date, setDate] = useState(null);
  // const departments = useSelector((state) => state?.department);
  // const orders = useSelector((state) => state?.dashboard);

  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(
  //     featchAllOrders({
  //       pageIndex: page,
  //       sort,
  //       search,
  //       departmentId: departmentsSelect,
  //       city,
  //       center,
  //       status,
  //       userId,
  //       technicianId,
  //       date,
  //     })
  //   );
  // }, [dispatch, page, sort, search, departmentsSelect, city, center, status]);

  // useEffect(() => {
  //   dispatch(featchAllDepartment());
  // }, [dispatch]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      window.scrollTo(0, 0);
      return;
    }

    topRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [page]);

  const {
    data: departments,
    isLoading: isLoadingDepartments,
    isFetching: isFetchingDepartments,
  } = useGetAllCategoryQuery();
  const {
    data: orders,
    isLoading: isLoadingOrders,
    isFetching: isFetchingOrders,
  } = useGetAllOrdersQuery({
    pageIndex: page,
    sort,
    search,
    departmentId: departmentsSelect,
    city,
    center,
    status,
    userId,
    technicianId,
    date,
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
  const ordersShow = Array.isArray(orders?.data)
    ? orders.data.map((item) => (
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
            <Link className="details" to={`${item?.id}`}>
              التفاصيل
            </Link>
          </td>
        </tr>
      ))
    : "";

  const departmentShow = Array.isArray(departments)
    ? departments.map((department) => (
        <option value={department?.id} key={department?.id}>
          {department?.name}
        </option>
      ))
    : [];

  const handleChange = (event, value) => {
    if (value === page) return;
    setPage(value);
    sessionStorage.setItem("pageIndexOrders", value);
    // dispatch(featchAllOrders({ pageIndex: value }));
  };

  const totalPages = Math.ceil((orders?.count || 1) / (orders?.pageSize || 8));
  return (
    <div className="tech-controle bg-page">
      {isFetchingDepartments || isLoadingDepartments ? (
        <AppLoading headind="جاري تحميل الصفحة" />
      ) : (
        <>
          {" "}
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
                <select name="sort" onChange={(e) => setSort(e.target.value)}>
                  <option value="">ترتيب حسب:</option>
                  <option value="ratingDesc">الاعلى تقييم فقط</option>
                  <option value="ratingAsc">الاقل تقييم فقط</option>
                  <option value="ratingTop">الاعلى تقييم واكثر طلبا</option>
                  <option value="ratingTopAsc">اقل تقيم واقل طلبا</option>
                  <option value="experienceDesc">اكثر سنوات خبرة</option>
                  <option value="experienceAsc">اقل سنوات خبرة</option>
                </select>
                <select onChange={(e) => setDepartmentsSelect(e.target.value)}>
                  <option value=""> التخصص</option>
                  {departmentShow}
                </select>

                <select
                  name="status"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value=""> الحالة</option>
                  <option value={true}>نشط الآن</option>
                  <option value={false}>غير نشط</option>
                </select>
                <select
                  name="location"
                  onChange={(e) => setCity(e.target.value)}
                  value={city}
                >
                  <option value="">المحافظة</option>
                  <option value="الاسماعيليه">الاسماعيليه</option>
                  <option value="السويس">السويس</option>
                </select>
                <select
                  name="center"
                  onChange={(e) => setCenter(e.target.value)}
                  value={center}
                >
                  <option value="">المركز</option>
                  <option value="التل الكبير">التل الكبير</option>
                  <option value="القصاصين">القصاصين</option>
                </select>
              </div>
            </div>

            <div className="table" ref={topRef}>
              {isFetchingOrders || isLoadingOrders ? (
                <AppLoading headind="جاري تحميل الطلبات" />
              ) : (
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
        </>
      )}
    </div>
  );
}
