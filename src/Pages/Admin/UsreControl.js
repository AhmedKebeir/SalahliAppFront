import Pagination from "@mui/material/Pagination";

import { AiOutlinePlusCircle } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { featchAllUsers } from "../../store/slices/dashboardSlices/overview-slice";
import { useGetAllUsersApiQuery } from "../../store/services/AdminDashboardApi";
import AppLoading from "../../Components/AppLoading";

export default function USerControl() {
  const topRef = useRef(null);
  const savedPage = parseInt(sessionStorage.getItem("pageIndexUsers")) || 1;
  const [page, setPage] = useState(savedPage);

  // const location = useLocation();
  // useEffect(() => {
  //   sessionStorage.setItem("pageIndex", 1); // يرجّع الصفحة للأولى عند تغيير الـ Route
  // }, [location.pathname]);

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [center, setCenter] = useState("");
  const [sort, setSort] = useState("");

  // const users = useSelector((state) => state.dashboard);
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(featchAllUsers({ pageIndex: page, search, city, center, sort }));
  // }, [dispatch, page, search, city, center, sort]);

  // console.log(users);

  useEffect(() => {
    topRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [page]);

  const {
    data: users,
    isLoading,
    isFetching,
    isError,
  } = useGetAllUsersApiQuery({
    pageIndex: page,
    search,
    city,
    center,
    sort,
  });
  const totalPages = Math.ceil((users?.count || 1) / (users?.pageSize || 8));
  const dataShow = Array.isArray(users?.data)
    ? users.data.map((item) => (
        <tr key={item?.email || Math.random()}>
          <td>
            <img
              src={item?.image || require("../../Images/unnamed (2).png")}
              alt="image-name"
            />
            <span>{item?.displayName || "بدون اسم"}</span>
          </td>
          <td>
            <div className="depts">
              {item?.addresses?.map((address, index) => (
                <span
                  key={index}
                >{`${address?.city} - ${address?.center} - ${address?.street}`}</span>
              ))}
            </div>
          </td>
          <td>{item?.email}</td>
          <td>{item?.fullName}</td>
          <td>
            <Link to={`/user-profile/${item?.id}`}>تفاصيل المستخدم</Link>
          </td>
          <td>
            <Link to="">
              <FaRegEdit />
            </Link>
            <Link to="">
              <MdDelete />
            </Link>
          </td>
        </tr>
      ))
    : [];

  const handleChange = (event, value) => {
    if (value === page) return;
    setPage(value);
    sessionStorage.setItem("pageIndexUsers", value);
    // dispatch(featchAllUsers({ pageIndex: value }));
  };

  return (
    <div className="tech-controle bg-page">
      <div className="title">
        <div className="info">
          <h2>إدارة المستخدمين</h2>
        </div>
        <Link className="btn">
          <AiOutlinePlusCircle />
          إضافة مستخدم
        </Link>
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
              placeholder="ابحث عن مستخدم...."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button>بحث</button>
          </div>
          <div className="filter">
            <select
              name="sort"
              onChange={(e) => setSort(e.target.value)}
              value={sort}
            >
              <option value="">ترتيب</option>
              <option value="nameAsc">ترتيب من (أ-ي)</option>
              <option value="nameDesc">ترتيب من (ي-أ)</option>
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

        <div className="table  users-table" ref={topRef}>
          {isLoading || isFetching ? (
            <AppLoading heading="جاري تحميل المستخدمين" />
          ) : (
            <table>
              <thead>
                <tr>
                  <th>اسم المستخدم</th>
                  <th>العنوان</th>
                  <th>الإيميل</th>
                  <th>الاسم الكامل</th>
                  <th>تفاصيل المستخدم</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>{dataShow}</tbody>
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
