import { CiSearch } from "react-icons/ci";
import About from "../Components/About";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import "../Css/Categories.css";
import { AiFillCaretDown } from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Pagination from "@mui/material/Pagination";
import { useGetTopFourCategoriesQuery } from "../store/services/CategoriesApi";
import AppLoading from "../Components/AppLoading";

export default function Categories() {
  const topRef = useRef(null);
  const isFirstRender = useRef(true);
  const savedPage =
    parseInt(sessionStorage.getItem("userPageIndexCategories")) || 1;
  const [page, setPage] = useState(savedPage);
  const [searchPage, setSearchPage] = useState(1);

  const [catBasicShow, setBasicCatShow] = useState(true);
  const { search } = useLocation();
  const [catShow, setCatShow] = useState(false);
  const query = new URLSearchParams(search).get("query") || "";
  const [searchText, setSearchText] = useState(query);
  const [results, setResults] = useState([]);
  const {
    data: categories,
    isLoading,
    isFetching,
  } = useGetTopFourCategoriesQuery({
    pageSize: 6,
    pageIndex: searchText === "" ? page : searchPage,
    sort: "orderDesc",
    search: searchText,
  });

  const navigate = useNavigate();

  // عند تغيير كلمة البحث → اعمل API fetch

  const totalPages = Math.ceil(
    (categories?.count || 1) / (categories?.pageSize || 6),
  );
  const handleChange = (event, value) => {
    if (value === page) return;
    setPage(value);
    sessionStorage.setItem("userPageIndexCategories", value);
  };

  const categoriesShow = Array.isArray(categories?.data)
    ? categories?.data.map((item) => (
        <Link key={item?.id} to={`${item?.id}`} className="category-item">
          <img
            src={item?.imageUrl || require("../Images/category01.png")}
            alt=""
          />
          <h3>{item?.name}</h3>
          <p>{item?.description}</p>
        </Link>
      ))
    : [];

  const searchResultShow = Array.isArray(categories?.data)
    ? categories?.data.map((item) => (
        <div key={item?.id} className="item">
          <div className="data">
            <img src={require("../Images/category01.png")} alt="" />
            <div className="info">
              <h3>{item?.name}</h3>
              <p>{item?.description}</p>
            </div>
          </div>
          <Link to={`${item?.id}`} className="btn">
            عرض القسم
          </Link>
        </div>
      ))
    : [];

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

  return (
    <div className="categories-page" ref={topRef}>
      <Header />

      <div className="container">
        <div className="title">
          <h1>تصفح جميع فئات الخدمات</h1>
          <p>ابحث عن الخدمات التي تحتاجها أو استكشف فئاتنا المنظمة بعناية.</p>
        </div>
        <div className="search-box">
          <CiSearch />
          <input
            type="text"
            placeholder="ابحث عن خدمه معينة..."
            name="search"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setSearchPage(1);
            }}
          />
          <button>بحث</button>
        </div>
        {searchText === "" ? (
          <>
            <div className="categories-section">
              <div
                className="title"
                // onClick={() => setBasicCatShow(!catBasicShow)}
              >
                <h2>خدمات منزلية أساسية</h2>
                <AiFillCaretDown
                  className={`${catBasicShow ? "rotaion-icon" : ""}`}
                />
              </div>
              <div
                className={`categories-list ${catBasicShow ? "show-cat" : ""}`}
              >
                {isLoading || isFetching ? (
                  <AppLoading heading="جاري البحث" />
                ) : (
                  categoriesShow
                )}
              </div>
              {catBasicShow ? (
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
              ) : (
                ""
              )}
            </div>
            {/* <div className="categories-section ">
                <div className="title " onClick={() => setCatShow(!catShow)}>
                  <h2>أجهزة المطبخ</h2>
                  <AiFillCaretDown
                    className={`${catShow ? "rotaion-icon" : ""}`}
                  />
                </div>
                <div className={`categories-list ${catShow ? "show-cat" : ""}`}>
                  <Link to="" className="category-item">
                    <img src={require("../Images/category01.png")} alt="" />
                    <h3>تكييف الهواء</h3>
                    <p>تركيب وإصلاح</p>
                  </Link>
                  <Link to="" className="category-item">
                    <img src={require("../Images/category01.png")} alt="" />
                    <h3>تكييف الهواء</h3>
                    <p>تركيب وإصلاح</p>
                  </Link>
                  <Link to="" className="category-item">
                    <img src={require("../Images/category01.png")} alt="" />
                    <h3>تكييف الهواء</h3>
                    <p>تركيب وإصلاح</p>
                  </Link>
                  <Link to="" className="category-item">
                    <img src={require("../Images/category01.png")} alt="" />
                    <h3>تكييف الهواء</h3>
                    <p>تركيب وإصلاح</p>
                  </Link>
                </div>
                {catShow ? (
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
                ) : (
                  ""
                )}
              </div> */}
            <div className="any-service">
              <div className="title">
                <h2>لم تجد ما تبحث عنه؟</h2>
                <p>لا تقلق, يمكنك طلب خدمة مخصصة وسنصلك بأفضل الفنيين.</p>
              </div>
              <button>اطلب خدمة مخصصة</button>
            </div>
          </>
        ) : (
          <div className="search-result">
            <div className="title " onClick={() => setCatShow(!catShow)}>
              <h2>نتائج البحث</h2>
            </div>
            <div className="categories-list">
              {isLoading || isFetching ? (
                <AppLoading heading="جاري البحث" />
              ) : (
                searchResultShow
              )}

              {/* {searchResultShow} */}
            </div>
            <div className="pagin">
              <Pagination
                count={totalPages}
                value={searchPage}
                page={searchPage}
                onChange={(e, v) => setSearchPage(v)}
                variant="outlined"
                color="primary"
                siblingCount={1}
                boundaryCount={1}
              />
            </div>
          </div>
        )}
      </div>

      <About />
      <Footer />
    </div>
  );
}
