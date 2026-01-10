import Header from "../Components/Header";
import "../Css/LandingPage.css";

import { MdOutlineHomeRepairService, MdDateRange } from "react-icons/md";
import { HiMiniWrenchScrewdriver } from "react-icons/hi2";
import { BiCheckShield } from "react-icons/bi";
import { FaSackDollar } from "react-icons/fa6";
import { AiFillLike } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";

import About from "../Components/About";
import Footer from "../Components/Footer";

import { useGetTopFourCategoriesQuery } from "../store/services/CategoriesApi";

import { Virtual, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { WindowSize } from "../Context/WindowWidthContext";
import { useContext } from "react";
import Skeleton from "@mui/material/Skeleton";

export default function LandingPage() {
  const WindowWidth = useContext(WindowSize);
  const size = WindowWidth.windowSize;
  const {
    data: departments,
    isLoading,
    isFetching,
  } = useGetTopFourCategoriesQuery({
    pageSize: 20,
    pageIndex: 1,
    sort: "orderDesc",
  });

  const nav = useNavigate();

  const deptShow = Array.isArray(departments?.data)
    ? departments?.data?.map((item) => {
        return (
          <SwiperSlide key={item?.id}>
            <Link
              to={`/categories/${item?.id}`}
              className="category"
              key={item?.id}
            >
              <h4>{item?.name}</h4>
            </Link>
          </SwiperSlide>
        );
      })
    : [];
  return (
    <>
      <Header />
      <div className="welcome-section">
        <div className="container">
          <h2>
            شريكــك الموثوق لإصلاح
            <br />
            الأجهزة المنزلية.
          </h2>
          <p>تواصل مع فنيين معتمدين ومحليين لخدمة سريعة وموثوقة.</p>
          <div className="welcome-btns">
            <button className="serv-btn" onClick={() => nav("/login")}>
              اطلب خدمة
            </button>
            <button className="learn-btn" onClick={() => nav("/account-type")}>
              انضم كفني
            </button>
          </div>
        </div>
      </div>

      <section className="how-to-work" id="how-work">
        <div className="container">
          <div className="title">
            <p>كيف نعمل</p>
            <h2>احصل على خدمة صيانة في 3 خطوات بسيطة</h2>
          </div>

          <div className="steps">
            <hr />
            <div className="step">
              <span>
                <MdOutlineHomeRepairService />
              </span>
              <h3>1. اختر الخدمة</h3>
              <p>
                حدد نوع الجهاز والمشكلة التي تواجهها من خلال قائمتنا المبسطة.
              </p>
            </div>
            <div className="step">
              <span>
                <MdDateRange />
              </span>

              <h3>2. احجز موعداً</h3>
              <p>
                اختر الوقت والتاريخ المناسبين لك وسنصلك بأفضل الفنيين المتاحين.
              </p>
            </div>
            <div className="step">
              <span>
                <HiMiniWrenchScrewdriver />
              </span>
              <h3>3. احصل على الخدمة</h3>
              <p>سيصل الفني في الموعد المحدد لإصلاح جهازك بكفاءة وأمان.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="categories" id="categories">
        <div className="container">
          <div className="title">
            <h3>خدماتنا الشاملة</h3>
            <p>
              نحن نغطي مجموعة واسعة من الأجهزة المنزلية لضمان راحتك وسلامة
              منزلك.
            </p>
            <div>
              <Swiper
                style={{ padding: "0px   20px 50px 20px" }}
                className="categories-list"
                modules={[Virtual, Navigation, Pagination]}
                spaceBetween={30}
                slidesPerView={
                  size > 1400
                    ? 4
                    : size > 1200
                    ? 4
                    : size > 992
                    ? 3
                    : size > 768
                    ? 2
                    : size > 400
                    ? 2
                    : 1
                }
                pagination={{ clickable: true }}
              >
                {isLoading || isFetching ? (
                  <>
                    {" "}
                    <SwiperSlide>
                      <Skeleton
                        variant="rounded"
                        style={{
                          backgroundColor: "rgb(255 255 255 / 0.1)",
                          border: "1px solid rgb(255 255 255 / 0.2)",
                          borderRadius: "15px",
                          boxShadow:
                            "0 0 #0000, 0 0 #0000, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05);",
                        }}
                        height={250}
                      />
                    </SwiperSlide>
                    <SwiperSlide>
                      <Skeleton
                        variant="rounded"
                        style={{
                          backgroundColor: "rgb(255 255 255 / 0.1)",
                          border: "1px solid rgb(255 255 255 / 0.2)",
                          borderRadius: "15px",
                          boxShadow:
                            "0 0 #0000, 0 0 #0000, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05);",
                        }}
                        height={250}
                      />
                    </SwiperSlide>
                    <SwiperSlide>
                      <Skeleton
                        variant="rounded"
                        style={{
                          backgroundColor: "rgb(255 255 255 / 0.1)",
                          border: "1px solid rgb(255 255 255 / 0.2)",
                          borderRadius: "15px",
                          boxShadow:
                            "0 0 #0000, 0 0 #0000, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05);",
                        }}
                        height={250}
                      />
                    </SwiperSlide>
                    <SwiperSlide>
                      <Skeleton
                        variant="rounded"
                        style={{
                          backgroundColor: "rgb(255 255 255 / 0.1)",
                          border: "1px solid rgb(255 255 255 / 0.2)",
                          borderRadius: "15px",
                          boxShadow:
                            "0 0 #0000, 0 0 #0000, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05);",
                        }}
                        height={250}
                      />
                    </SwiperSlide>
                  </>
                ) : (
                  deptShow
                )}
              </Swiper>
            </div>
          </div>
        </div>
      </section>

      <div className="why pt-50 pb-50">
        <div className="container d-flex gap-20">
          <div className="image">
            <img
              src={require("../Images/unnamed (1).png")}
              alt="Why Choose Us"
              loading="lazy"
            />
          </div>
          <div className="content">
            <h2>
              <span>لماذا</span> تختار صلحلي؟
            </h2>
            <p>
              نحن نقدم تجربة سلسة وموثوقة من البداية إلى النهاية. إليك ما
              يميزنا:
            </p>
            <ul>
              <li className="d-flex  gap-20">
                <BiCheckShield />
                <div className="why-title">
                  <h4>فنيون معتمدون</h4>
                  <p>يتم فحص كل فني على منصتنا والتحقق من اعتماده.</p>
                </div>
              </li>
              <li className="d-flex  gap-20">
                <FaSackDollar />
                <div className="why-title">
                  <h4>أسعار شفافة</h4>
                  <p>
                    احصل على عروض أسعار مقدمًا قبل بدء أي عمل. لا توجد رسوم
                    خفية.
                  </p>
                </div>
              </li>
              <li className="d-flex  gap-20">
                <AiFillLike />
                <div className="why-title">
                  <h4>ضمان الرضا</h4>
                  <p>
                    نحن نضمن جودة عملنا. إذا لم تكن راضياً، فسنقوم بإصلاح الأمر.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="clients">
        <div className="container">
          <h2>يثق بنا الآلاف من العملاء السعداء</h2>
          <p>لا تأخذ كلمتنا فقط. انظر ماذا يقول عملاؤنا وفنيونا عن تجربتهم.</p>
          <div className="client-list d-flex items-center">
            <div className="client">
              <div className="info d-flex items-center">
                <img
                  src={require("../Images/unnamed (2).png")}
                  alt="Client 3"
                  loading="lazy"
                />

                <div>
                  <h3>سارة ك.</h3>
                  <p>عميل</p>
                </div>
              </div>
              <div className="stars">★★★★★</div>
              <blockquote>"خدمة العملاء سريعة ومحترفة جدًا."</blockquote>
            </div>
            <div className="client">
              <div className="info d-flex items-center">
                <img
                  src={require("../Images/unnamed (2).png")}
                  alt="Client 3"
                  loading="lazy"
                />

                <div>
                  <h3>سارة ك.</h3>
                  <p>عميل</p>
                </div>
              </div>
              <div className="stars">★★★★★</div>
              <blockquote>
                "سريع، وبأسعار معقولة، وشرح الفني كل شيء بوضوح. أخيراً لدي مكان
                أعتمد عليه لمشاكل الأجهزة."
              </blockquote>
            </div>
            <div className="client">
              <div className="info d-flex items-center">
                <img
                  src={require("../Images/unnamed (2).png")}
                  alt="Client 3"
                  loading="lazy"
                />

                <div>
                  <h3>سارة ك.</h3>
                  <p>عميل</p>
                </div>
              </div>
              <div className="stars">★★★★★</div>
              <blockquote>
                "صلحلي غير طريقة عملي. أحصل على المزيد من العملاء الآن وأدير
                جدول أعمالي بسهولة. منصة رائعة للفنيين."
              </blockquote>
            </div>
          </div>
        </div>
      </div>

      <div className="ready">
        <h2>هل أنت جاهز لإصلاح جهازك؟</h2>
        <p>
          سواء كنت بحاجة إلى إصلاح عاجل أو ترغب في الانضمام إلى شبكتنا من
          الفنيين المهرة، نحن هنا لمساعدتك.
        </p>
        <div className="links-sign d-flex gap-20">
          <Link to="/login" className="serv-btn">
            اطلب خدمة الآن
          </Link>
          <Link to="/account-type" className="learn-btn">
            سجل كفني
          </Link>
        </div>
      </div>

      <About />
      <Footer />
    </>
  );
}
