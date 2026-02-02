import { useEffect, useRef, useState } from "react";
import Header from "../Components/Header";
import "../Css/Category.css";
import { Link, useParams } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import { useGetCategoryByIdQuery } from "../store/services/CategoriesApi";
import { useGetTopTechniciansApiQuery } from "../store/services/TechniciansApi";
import Rating from "@mui/material/Rating";
import { CiSearch } from "react-icons/ci";
import AppLoading from "../Components/AppLoading";

export default function Category() {
  const topRef = useRef(null);
  const savedPage =
    parseInt(sessionStorage.getItem("pageIndexCategoryId")) || 1;
  const [page, setPage] = useState(savedPage);
  const params = useParams();

  const [filteration, setFilteration] = useState({
    search: "",
    city: "",
    center: "",
    sort: "",
    status: "",
  });

  const {
    data: department,
    isLoading: isLoadingDepartment,
    isFetching: isFetchingDepartment,
  } = useGetCategoryByIdQuery({ id: params.id });

  const {
    data: technicians,
    isLoading: isLoadingTechnicians,
    isFetching: isFetchingTechnicians,
  } = useGetTopTechniciansApiQuery({
    departmentId: params.id,
    pageSize: 8,
    pageIndex: page,
    sort: filteration.sort,
    isActive: filteration.status,
    city: filteration.city,
    center: filteration.center,
    search: filteration.search,
  });

  const handleChange = (event, value) => {
    if (value === page) return;
    setPage(value);
    sessionStorage.setItem("pageIndexCategoryId", value);
  };

  const totalPages = Math.ceil(
    (technicians?.count || 1) / (technicians?.pageSize || 8),
  );

  const techniciansShow = Array.isArray(technicians?.data)
    ? technicians?.data.map((item) => (
        <div className="item" key={item?.id}>
          <div className="info">
            <img
              src={item?.image || require("../Images/unnamed (2).png")}
              alt=""
              loading="lazy"
            />
            <div>
              <h3>{item?.displayName}</h3>
              <div className="rating">
                <span className="star">
                  <Rating
                    name="half-rating"
                    value={item?.averageRating || 0}
                    precision={0.5}
                    max={1}
                    readOnly
                  />
                </span>
                {item?.averageRating}
                <span className="count-rate">
                  {"  "} ({Number(item?.totalReviews || 0)} تقييم )
                </span>
              </div>
            </div>
          </div>
          <div className="bio">نبذة: {item?.bio}.</div>
          <div className="service-list">
            <h4>الخدمات:</h4>
            {Array.isArray(item?.departments)
              ? item?.departments.map((dept) => (
                  <span className="service-item" key={dept?.id}>
                    {dept?.name}
                  </span>
                ))
              : []}
          </div>
          <div className="btns">
            <Link to={`/request-service/${item?.id}`}>اطلب الآن</Link>
            <Link to={`/technicians/${item?.id}`}>عرض الملف الشخصي</Link>
          </div>
        </div>
      ))
    : [];

  const handleChangeFilter = (e) => {
    setFilteration({ ...filteration, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    topRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [page]);
  return (
    <>
      <Header />
      <div className="category-page" ref={topRef}>
        {isFetchingDepartment || isLoadingDepartment ? (
          <AppLoading />
        ) : (
          <div className="container">
            <div className="heading">
              <div className="title">
                <h1>فنيون {department?.name}</h1>
                <p>اختر من بين افضل الفنيين المتاحين لخدمتك</p>
              </div>
              <div className="filter-boxs">
                <div className="search-box">
                  <span>
                    <CiSearch />
                  </span>
                  <input
                    type="text"
                    name="search"
                    placeholder="ابحث عن فني...."
                    value={filteration.search}
                    onChange={handleChangeFilter}
                  />
                  <button>بحث</button>
                </div>

                <div className="filter">
                  <div className="sort">
                    <select
                      name="sort"
                      value={filteration.sort}
                      onChange={handleChangeFilter}
                    >
                      <option value="">ترتيب حسب:</option>
                      <option value="ratingDesc">الاعلى تقييم فقط</option>
                      <option value="ratingAsc">الاقل تقييم فقط</option>
                      <option value="ratingTop">الاعلى تقييم واكثر طلبا</option>
                      <option value="ratingTopAsc">اقل تقيم واقل طلبا</option>
                      <option value="experienceDesc">اكثر سنوات خبرة</option>
                      <option value="experienceAsc">اقل سنوات خبرة</option>
                      <option>الأحدث</option>
                    </select>
                  </div>
                  <div className="avalible">
                    <select
                      name="status"
                      value={filteration.status}
                      onChange={handleChangeFilter}
                    >
                      <option value=""> الحالة</option>
                      <option value={true}>نشط الآن</option>
                      <option value={false}>غير نشط</option>
                    </select>
                  </div>

                  <div className="city">
                    <select
                      name="city"
                      value={filteration.city}
                      onChange={handleChangeFilter}
                    >
                      <option value="">المحافظة</option>
                      <option value="الإسماعيلية">الإسماعيلية</option>
                      <option value="السويس">السويس</option>
                    </select>
                  </div>
                  <div className="center">
                    <select
                      name="center"
                      value={filteration.center}
                      onChange={handleChangeFilter}
                    >
                      <option value="">اختر المركز</option>
                      <option value="أبو صوير">أبو صوير</option>
                      <option value="التل الكبير">التل الكبير</option>
                      <option value="مركز فايد">مركز فايد </option>
                      <option value="القنطرة شرق"> القنطرة شرق </option>
                      <option value="القنطرة غرب"> القنطرة غرب </option>
                      <option value="القصاصين">القصاصين</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="results">
              {isLoadingTechnicians || isFetchingTechnicians ? (
                <AppLoading />
              ) : (
                techniciansShow
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
        )}
      </div>
    </>
  );
}
