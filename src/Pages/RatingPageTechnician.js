import Rating from "@mui/material/Rating";
import Footer from "../Components/Footer";
import { useTechnician } from "../Context/TechnicianProvider";
import {
  useGetAllReviewsByAnyUserQuery,
  useGetAllReviewsByTechnicianIdQuery,
} from "../store/services/ReviewsApi";
import { useGetTechnicianByIdQuery } from "../store/services/TechniciansApi";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import Pagination from "@mui/material/Pagination";
import AppLoading from "../Components/AppLoading";

export default function RatingPageTechnician() {
  const savedPage =
    parseInt(sessionStorage.getItem("pageIndexRatingTech")) || 1;
  const [page, setPage] = useState(savedPage);
  const [status, setStatus] = useState("");
  const { technicianId } = useTechnician();
  const { data: technician } = useGetTechnicianByIdQuery(
    { id: technicianId },
    { skip: !technicianId }, // لو مفيش id => مايبعتش request
  );

  const { data: reviewsCount } = useGetAllReviewsByTechnicianIdQuery(
    {
      id: technician?.id,
    },
    { skip: !technicianId },
  );

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
  } = useGetAllReviewsByAnyUserQuery({
    pageIndex: page,
    pageSize: 8,

    technicianId: technician?.id,
  });

  const totalPages = Math.ceil(
    (ratings?.count || 1) / (ratings?.pageSize || 8),
  );
  const handleChange = (event, value) => {
    if (value === page) return;
    setPage(value);
    sessionStorage.setItem("pageIndexRatingTech", value);
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
  return (
    <>
      <div className="technician-rating-page">
        {isFetching || isLoading ? (
          <AppLoading heading="جاري التحميل" />
        ) : (
          <div className="container">
            <div className="rating-section">
              <h3>ملخص التقييمات:</h3>
              <div className="rate-char">
                <div>
                  <span className="avg-rate">
                    {Number(technician?.averageRating) || 0}.0
                  </span>
                  <div className="stars">
                    <Rating
                      name="rating"
                      value={Number(technician?.averageRating) || 0}
                      precision={0.5}
                      readOnly
                    />
                  </div>
                  <span className="count-rate">
                    {reviewsCount?.totalReviews} تقييم
                  </span>
                </div>
                <div className="progress">
                  <div>
                    5{" "}
                    <BorderLinearProgress
                      variant="determinate"
                      value={
                        Number(
                          (reviewsCount?.fiveStar /
                            reviewsCount?.totalReviews) *
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
                        (reviewsCount?.fiveStar / reviewsCount?.totalReviews) *
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
                          (reviewsCount?.fourStar /
                            reviewsCount?.totalReviews) *
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
                        (reviewsCount?.fourStar / reviewsCount?.totalReviews) *
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
                          (reviewsCount?.threeStar /
                            reviewsCount?.totalReviews) *
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
                        (reviewsCount?.threeStar / reviewsCount?.totalReviews) *
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
                          (reviewsCount?.twoStar / reviewsCount?.totalReviews) *
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
                        (reviewsCount?.twoStar / reviewsCount?.totalReviews) *
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
                          (reviewsCount?.oneStar / reviewsCount?.totalReviews) *
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
                        (reviewsCount?.oneStar / reviewsCount?.totalReviews) *
                          100,
                      ) || 0}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rating-box">
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
        )}
      </div>
      <Footer />
    </>
  );
}
