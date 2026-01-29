import Pagination from "@mui/material/Pagination";
import Rating from "@mui/material/Rating";
import { use, useEffect, useRef, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { featchAllTechnicians } from "../../store/slices/dashboardSlices/overview-slice";
import { featchAllDepartment } from "../../store/slices/department-slice";
import axios from "axios";
import { AdminDashboard, BaseUrl, UpdatePoints } from "../../APIs/Api";
import Cookie from "cookie-universal";
import { useGetTopTechniciansApiQuery } from "../../store/services/TechniciansApi";
import AppLoading from "../../Components/AppLoading";

export default function TechnicianControl() {
  const topRef = useRef(null);
  const cookie = Cookie();
  const token = cookie.get("token");
  const savedPage =
    parseInt(sessionStorage.getItem("pageIndexTechnicians")) || 1;
  const [page, setPage] = useState(savedPage);

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [center, setCenter] = useState("");
  const [sort, setSort] = useState("");
  const [status, setStatus] = useState("");
  // const [department, setDepartment] = useState("");

  // const technicians = useSelector((state) => state?.dashboard);
  const departments = useSelector((state) => state?.department);

  const [departmentsSelect, setDepartmentsSelect] = useState(null);

  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(
  //     featchAllTechnicians({
  //       pageIndex: page,
  //       search,
  //       city,
  //       center,
  //       sort,
  //       isActive: status,
  //       departmentId: departmentsSelect,
  //     })
  //   );
  // }, [dispatch, page, search, city, center, sort, status, departmentsSelect]);

  // useEffect(() => {
  //   dispatch(featchAllDepartment());
  // }, [dispatch]);

  useEffect(() => {
    topRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [page]);

  const {
    data: technicians,
    isLoading,
    isFetching,
    refetch,
  } = useGetTopTechniciansApiQuery({
    pageSize: 8,
    pageIndex: page,
    search,
    city,
    center,
    sort,
    isActive: status,
    departmentId: departmentsSelect,
  });

  const totalPages = Math.ceil(
    (technicians?.count || 1) / (technicians?.pageSize || 8),
  );

  const dataShow = Array.isArray(technicians?.data)
    ? technicians.data.map((item) => (
        <tr key={item?.email || Math.random()}>
          <td>{item?.id}#</td>
          <td>
            <img
              src={item?.image || require("../../Images/unnamed (2).png")}
              alt="image-name"
            />
            <span>{item?.fullName || "بدون اسم"}</span>
          </td>

          <td>
            <div className="depts">
              {item?.departments?.map((department, index) => (
                <span key={index}>{`${department?.name}`}</span>
              ))}
            </div>
          </td>
          <td>{item?.experienceYears}</td>
          <td>
            {" "}
            <div className="rate">
              {/* <Rating value={0} readOnly /> */}
              <Rating
                name="half-rating"
                defaultValue={0}
                precision={1}
                max={1}
                readOnly
              />
              <span>{item?.averageRating}</span>
            </div>
          </td>
          <td>
            {item?.isActive === true ? (
              <span className="active">نشط الآن</span>
            ) : (
              "غير نشط"
            )}
          </td>
          <td>{item?.countOfPoints}</td>
          <td>
            <Link
              onClick={() => {
                setShowUpdatePoint(true);
                setTechnicianId(item?.id);
              }}
            >
              <FaRegEdit />
            </Link>
            <Link to="">
              <MdDelete />
            </Link>
          </td>
        </tr>
      ))
    : [];

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
    sessionStorage.setItem("pageIndexTechnicians", value);
    // dispatch(featchAllTechnicians({ pageIndex: value }));
  };

  const [showUpdatePoint, setShowUpdatePoint] = useState(false);
  const [points, setPoints] = useState("");
  const [technicianId, setTechnicianId] = useState(null);
  const [errUpdate, setErrUpdate] = useState(null);

  const handleChangePoints = async () => {
    if (points > 0) {
      try {
        const res = await axios.put(
          `${BaseUrl}/${AdminDashboard}/${UpdatePoints}/${technicianId}`,
          { points: Number(points) },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log(res);
        if (res.status === 200) {
          // dispatch(featchAllTechnicians({ pageIndex: page }));
          refetch();
          setShowUpdatePoint(false);
          setTechnicianId(null);
          setPoints("");
          setErrUpdate(null);
        }
      } catch (err) {
        setErrUpdate(err.response.data.message);
      }
    }
  };

  return (
    <div className="tech-controle bg-page">
      <div className="title">
        <div className="info">
          <h2>إدارة الفنيين</h2>
        </div>
        <Link className="btn">
          <AiOutlinePlusCircle />
          إضافة فني جديد
        </Link>
      </div>

      <div className="tech-box">
        {showUpdatePoint && technicianId ? (
          <div
            className="tech-Updateing"
            onClick={() => {
              setShowUpdatePoint(false);
              setTechnicianId(null);
            }}
          >
            <div className="update-points" onClick={(e) => e.stopPropagation()}>
              <h3>تعديل نقاط الفني #{technicianId}</h3>
              <label htmlFor="points">نقاط</label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                id="points"
                placeholder="ادخل عدد النقاط المراد منحها...."
              />
              {errUpdate && <p className="err">{errUpdate}</p>}
              <button onClick={() => handleChangePoints()}>تعديل</button>
            </div>
          </div>
        ) : null}

        <div className="head">
          <div className="search-box">
            <span>
              <CiSearch />
            </span>
            <input
              type="text"
              name="search"
              placeholder="ابحث عن فني..."
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

            <select name="status" onChange={(e) => setStatus(e.target.value)}>
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
          {isLoading || isFetching ? (
            <AppLoading heading="جاري جلب الفنيين" />
          ) : (
            <table>
              <thead>
                <tr>
                  <th>الرقم</th>
                  <th>اسم الفني</th>

                  <th>التخصصات</th>
                  <th>سنوات الخبرة</th>
                  <th>التقييم</th>

                  <th>الحالة</th>
                  <th>عدد النقاط</th>
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
