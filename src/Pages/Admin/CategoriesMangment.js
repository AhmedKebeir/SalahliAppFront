import { Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from "@mui/material/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { featchAllDepartment } from "../../store/slices/dashboardSlices/overview-slice";
import { useGetTopFourCategoriesQuery } from "../../store/services/CategoriesApi";
import AppLoading from "../../Components/AppLoading";

export default function CategoriesMangment() {
  const topRef = useRef(null);
  const savedPage =
    parseInt(sessionStorage.getItem("pageIndexDepartments")) || 1;
  const [page, setPage] = useState(savedPage);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    topRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [page]);
  // const departments = useSelector((state) => state.dashboard);
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(featchAllDepartment({ pageIndex: page, search, sort }));
  // }, [dispatch, search, page, sort]);
  // console.log(departments);

  const {
    data: departments,
    isFetching,
    isLoading,
  } = useGetTopFourCategoriesQuery({
    pageSize: 8,
    pageIndex: page,
    sort,
    search,
  });

  const totalPages = Math.ceil(
    (departments?.count || 1) / (departments?.pageSize || 8),
  );
  const handleChange = (event, value) => {
    if (value === page) return;
    setPage(value);
    sessionStorage.setItem("pageIndexDepartments", value);
  };

  async function handleDelete(id) {}

  const dataShow = Array.isArray(departments?.data)
    ? departments?.data.map((item) => (
        <tr key={item?.id}>
          <td>{item?.name}</td>
          <td>{item?.description}</td>
          <td>
            <img
              src={item?.imageUrl || require("../../Images/category01.png")}
              alt={item?.name}
            />
          </td>
          <td>
            <Link to={`${item?.id}`}>
              <FaRegEdit />
            </Link>
            <Link onClick={() => handleDelete(item?.id)}>
              <MdDelete />
            </Link>
          </td>
        </tr>
      ))
    : [];
  return (
    <div className="cat-mangment bg-page">
      <>
        <div className="title">
          <div className="info">
            <h2>إدارة الأقسام</h2>
            <p>إضافة وتعديل وحذف أقسام ألخدمات على المنصة.</p>
          </div>
          <Link to="create" className="btn">
            <AiOutlinePlusCircle />
            إضافة فسم جديد
          </Link>
        </div>
        <div className="cat-box">
          <div className="cat-head">
            <div className="search-box">
              <span>
                <CiSearch />
              </span>
              <input
                type="text"
                name="search"
                placeholder="ابحث عن قسم..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
              <button>بحث</button>
            </div>
            <div className="filter">
              <label>فرز حسب:</label>
              <select onChange={(e) => setSort(e.target.value)}>
                <option value=""> الاسم (أ-ي)</option>
                <option value="orderAsc">الاكثر طلبا</option>
                <option value="orderDesc">الاكثر فنيين</option>
              </select>
            </div>
          </div>
          <div className="table" ref={topRef}>
            {isFetching || isLoading ? (
              <AppLoading heading="جاري تحميل الصفحة" />
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>اسم القسم</th>
                    <th>الوصف</th>
                    <th>صورة القسم</th>
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
      </>
    </div>
  );
}
