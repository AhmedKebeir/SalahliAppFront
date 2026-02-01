import Header from "../Components/Header";
import "../Css/HomePage.css";
import { CiSearch } from "react-icons/ci";
import About from "../Components/About";
import Footer from "../Components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useGetTopFourCategoriesQuery } from "../store/services/CategoriesApi";
import { useGetTopTechniciansApiQuery } from "../store/services/TechniciansApi";
import Rating from "@mui/material/Rating";
import { useContext, useState } from "react";

import { Virtual, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { WindowSize } from "../Context/WindowWidthContext";
import AppLoading from "../Components/AppLoading";

export default function HomePage() {
  const {
    data: categories,
    isLoading: categoriesLoading,
    isFetching: categoriesFetching,
  } = useGetTopFourCategoriesQuery({
    pageSize: 20,
    pageIndex: 1,
    sort: "orderDesc",
  });

  const {
    data: topTechnicians,
    isLoading: topTechniciansLoading,
    isFetching: topTechniciansFetching,
  } = useGetTopTechniciansApiQuery({
    pageSize: 5,
    pageIndex: 1,
    sort: "ratingTop",
  });

  const CategoriesShow = Array.isArray(categories?.data)
    ? categories?.data.map((item) => (
        <SwiperSlide key={item?.id}>
          {" "}
          <Link to={`/categories/${item?.id}`} className="category-item">
            <div className="image">
              <img
                src={item?.imageUrl || require("../Images/category01.png")}
                alt=""
                loading="lazy"
              />
            </div>
            <h3>{item?.name}</h3>
            <p>{item?.description}</p>
          </Link>
        </SwiperSlide>
      ))
    : [];

  const TechniciansShow = Array.isArray(topTechnicians?.data)
    ? topTechnicians?.data.map((item) => (
        <SwiperSlide key={item?.id}>
          <div className="nominations-item">
            <div className="info d-flex items-center">
              <img
                src={item?.image || require("../Images/unnamed (2).png")}
                alt="Client 3"
                loading="lazy"
              />

              <div>
                <h3>{item?.displayName}</h3>
                <p>{item?.experienceYears} سنوات من الخبرة</p>
              </div>
            </div>

            <div className="stars">
              {" "}
              <Rating
                name="half-rating"
                value={Number(item?.averageRating) || 0}
                precision={0.5}
                readOnly
              />
            </div>
            <blockquote>"خدمة العملاء سريعة ومحترفة جدًا."</blockquote>
            <Link to={`/technicians/${item?.id}`}>عرض الملف الشخصي</Link>
          </div>
        </SwiperSlide>
      ))
    : [];

  const [searchValue, setSearch] = useState("");
  const navigate = useNavigate();
  const handleSearch = () => {
    if (!searchValue.trim()) return;
    navigate(`/categories?query=${searchValue}`);
  };

  const WindowWidth = useContext(WindowSize);
  const size = WindowWidth.windowSize;
  return (
    <div className="home-page">
      <Header />
      {categoriesLoading ||
      topTechniciansLoading ||
      categoriesFetching ||
      topTechniciansFetching ? (
        <AppLoading heading="جاري التحميل" />
      ) : (
        <div className="content">
          <div className="container">
            <div className="welcome">
              <div className="background">
                <img src={require("../Images/home-page-welcom.png")} alt="" />
              </div>
              <h2>صديق منزلك المفضل للصيانة</h2>
              <p>ابحث عن فنيين موثوقين ومهرة لأي إصلاح بسرعة وسهولة.</p>
              <div className="search">
                <div>
                  <CiSearch />

                  <input
                    type="text"
                    placeholder="ابحث عن خدمة (مثال: تصليح مكيف)..."
                    name="search"
                    onChange={(e) => setSearch(e.target.value)}
                    value={searchValue}
                  />
                </div>
                <button onClick={handleSearch}>بحث</button>
              </div>
            </div>

            <div className="common-categories">
              <h2>الأقسام الشائعة</h2>
              <div>
                <Swiper
                  style={{ paddingBottom: "50px" }}
                  className="category-list"
                  modules={[Virtual, Navigation, Pagination]}
                  spaceBetween={30}
                  slidesPerView={
                    size > 1400
                      ? 6
                      : size > 1200
                      ? 4
                      : size > 992
                      ? 3
                      : size > 768
                      ? 2
                      : 1
                  }
                  pagination={{ clickable: true }}
                >
                  {CategoriesShow}
                </Swiper>
              </div>
            </div>
            <div className="nominations">
              <h2>ترشيحات سريعة</h2>
              <div>
                <Swiper
                  style={{ paddingBottom: "40px" }}
                  className="nominations-list"
                  modules={[Virtual, Navigation, Pagination]}
                  spaceBetween={30}
                  slidesPerView={
                    size > 1400
                      ? 4
                      : size > 1200
                      ? 3
                      : size > 992
                      ? 2
                      : size > 768
                      ? 1
                      : 1
                  }
                  pagination={{ clickable: true }}
                >
                  {TechniciansShow}
                </Swiper>
              </div>
            </div>
            <About />
          </div>
          <Footer />
        </div>
      )}
    </div>
  );
}
