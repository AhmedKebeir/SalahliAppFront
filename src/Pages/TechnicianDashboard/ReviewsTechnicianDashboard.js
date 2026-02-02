import Rating from "@mui/material/Rating";
import Footer from "../../Components/Footer";
import { useTechnician } from "../../Context/TechnicianProvider";
import {
  useGetAllReviewsByAnyUserQuery,
  useGetAllReviewsByTechnicianIdQuery,
  useGetAllReviewsForTechnicianQuery,
} from "../../store/services/ReviewsApi";
import { useGetTechnicianByIdQuery } from "../../store/services/TechniciansApi";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import Pagination from "@mui/material/Pagination";
import AppLoading from "../../Components/AppLoading";

export default function ReviewsTechnicianDashboard() {
  const topRef = useRef(null);
  const isFirstRender = useRef(true);
  const savedPage =
    parseInt(sessionStorage.getItem("pageIndexRatingTechDashboard")) || 1;
  const [page, setPage] = useState(savedPage);
  const [status, setStatus] = useState("");

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[200],
      ...theme.applyStyles("dark", {
        backgroundColor: theme.palette.grey[800],
      }),
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
    },
  }));

  const {
    data: ratings,
    isLoading,
    isFetching,
  } = useGetAllReviewsForTechnicianQuery({
    pageIndex: page,
    pageSize: 8,
  });

  const totalPages = Math.ceil(
    (ratings?.count || 1) / (ratings?.pageSize || 8),
  );
  const handleChange = (event, value) => {
    if (value === page) return;
    setPage(value);
    sessionStorage.setItem("pageIndexReviewsTechDashboard", value);
  };

  function timeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);

    const seconds = Math.floor((now - date) / 1000);

    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return "منذ لحظات";
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days < 30) return `منذ ${days} يوم`;
    if (months < 12) return `منذ ${months} شهر`;
    return `منذ ${years} سنة`;
  }
  const reviewItemShow = Array.isArray(ratings?.data)
    ? ratings?.data.map((item) => (
        <div className="rating-item">
          <div className="information">
            <div
              className={`image ${item?.user?.image !== "" ? "" : "no-image"}`}
            >
              {item?.user?.image !== "" ? (
                <img src={item?.user?.image} alt={item?.user?.displayName} />
              ) : (
                item?.user?.displayName.split("")[0]
              )}
            </div>
            <div className="info">
              <h3>{item?.user?.displayName}</h3>
              <p>
                {timeAgo(item?.date)} <span> الخدمة {item?.orderTitle}</span>
              </p>
            </div>
          </div>
          <div className="stars">
            {" "}
            <Rating
              name="half-rating"
              value={item?.rating}
              precision={0.5}
              readOnly
            />
          </div>
          <div className="text">
            <p>{item?.comment}</p>
          </div>
          <div className="review-image">
            {item?.imageUrl !== "" ? (
              <img src={item?.imageUrl} alt={item?.user?.displayName} />
            ) : (
              ""
            )}
          </div>
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
    <div className="reviews-dashboard bg-page">
      <div className="title">
        <div className="info">
          <h2>إدارة التعليقات</h2>
        </div>
      </div>
      {isLoading || isFetching ? (
        <AppLoading heading="جاري جلب البيانات" />
      ) : (
        <>
          <div className="rating-page-dashboard">
            <div className="rating-section">
              <h3>ملخص التقييمات:</h3>
              <div className="rate-char">
                <div>
                  <span className="avg-rate">
                    {Number(ratings?.reviewsStatistics?.averageRating) || 0}.0
                  </span>
                  <div className="stars">
                    <Rating
                      name="rating"
                      value={
                        Number(ratings?.reviewsStatistics?.averageRating) || 0
                      }
                      precision={0.5}
                      readOnly
                    />
                  </div>
                  <span className="count-rate">
                    {ratings?.reviewsStatistics?.totalReviews} تقييم
                  </span>
                </div>
                <div className="progress">
                  <div>
                    5{" "}
                    <BorderLinearProgress
                      variant="determinate"
                      value={
                        Number(
                          (ratings?.reviewsStatistics?.fiveStar /
                            ratings?.reviewsStatistics?.totalReviews) *
                            100,
                        ) || 0
                      }
                      sx={{
                        [`& .${linearProgressClasses.bar}`]: {
                          backgroundColor: "#28a745",
                        },
                      }}
                    />{" "}
                    <span className="persent">
                      {Number(
                        (ratings?.reviewsStatistics?.fiveStar /
                          ratings?.reviewsStatistics?.totalReviews) *
                          100,
                      ) || 0}
                      %
                    </span>
                  </div>
                  <div>
                    4{" "}
                    <BorderLinearProgress
                      variant="determinate"
                      value={
                        Number(
                          (ratings?.reviewsStatistics?.fourStar /
                            ratings?.reviewsStatistics?.totalReviews) *
                            100,
                        ) || 0
                      }
                      sx={{
                        [`& .${linearProgressClasses.bar}`]: {
                          backgroundColor: "#28a745",
                        },
                      }}
                    />{" "}
                    <span className="persent">
                      {Number(
                        (ratings?.reviewsStatistics?.fourStar /
                          ratings?.reviewsStatistics?.totalReviews) *
                          100,
                      ) || 0}
                      %
                    </span>
                  </div>
                  <div>
                    3{" "}
                    <BorderLinearProgress
                      variant="determinate"
                      value={
                        Number(
                          (ratings?.reviewsStatistics?.threeStar /
                            ratings?.reviewsStatistics?.totalReviews) *
                            100,
                        ) || 0
                      }
                      sx={{
                        [`& .${linearProgressClasses.bar}`]: {
                          backgroundColor: "#28a745",
                        },
                      }}
                    />{" "}
                    <span className="persent">
                      {Number(
                        (ratings?.reviewsStatistics?.threeStar /
                          ratings?.reviewsStatistics?.totalReviews) *
                          100,
                      ) || 0}
                      %
                    </span>
                  </div>
                  <div>
                    2{" "}
                    <BorderLinearProgress
                      variant="determinate"
                      value={
                        Number(
                          (ratings?.reviewsStatistics?.twoStar /
                            ratings?.reviewsStatistics?.totalReviews) *
                            100,
                        ) || 0
                      }
                      sx={{
                        [`& .${linearProgressClasses.bar}`]: {
                          backgroundColor: "#eab308",
                        },
                      }}
                    />{" "}
                    <span className="persent">
                      {Number(
                        (ratings?.reviewsStatistics?.twoStar /
                          ratings?.reviewsStatistics?.totalReviews) *
                          100,
                      ) || 0}
                      %
                    </span>
                  </div>
                  <div>
                    1{" "}
                    <BorderLinearProgress
                      variant="determinate"
                      value={
                        Number(
                          (ratings?.reviewsStatistics?.oneStar /
                            ratings?.reviewsStatistics?.totalReviews) *
                            100,
                        ) || 0
                      }
                      sx={{
                        [`& .${linearProgressClasses.bar}`]: {
                          backgroundColor: "#ef4444",
                        },
                      }}
                    />{" "}
                    <span className="persent">
                      {Number(
                        (ratings?.reviewsStatistics?.oneStar /
                          ratings?.reviewsStatistics?.totalReviews) *
                          100,
                      ) || 0}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rating-box" ref={topRef}>
              <div className="rating-list">{reviewItemShow}</div>
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
        </>
      )}
    </div>
  );
}
