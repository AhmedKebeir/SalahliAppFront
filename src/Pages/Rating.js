import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import Rating from "@mui/material/Rating";
import { styled } from "@mui/material/styles";
import { useTechnician } from "../Context/TechnicianProvider";
import { useGetTechnicianByIdQuery } from "../store/services/TechniciansApi";
import {
  useGetAllReviewsByAnyUserQuery,
  useGetAllReviewsByTechnicianIdQuery,
} from "../store/services/ReviewsApi";
import AppLoading from "../Components/AppLoading";
// import StarIcon from "@mui/icons-material/Star";

export default function RatingSection() {
  const { technicianId } = useTechnician();
  const { data: technician } = useGetTechnicianByIdQuery(
    { id: technicianId },
    { skip: !technicianId }, // لو مفيش id => مايبعتش request
  );

  const {
    data: reviews,
    isLoading: isLoadingReviews,
    isFetching: isFetchingReviews,
  } = useGetAllReviewsByAnyUserQuery(
    {
      pageIndex: 1,
      pageSize: 2,
      technicianId: technician?.id,
    },
    { skip: !technician?.id },
  );

  const {
    data: reviewsCount,
    isLoading: isLoadingReviewsCount,
    isFetching: isFetchingReviewsCount,
  } = useGetAllReviewsByTechnicianIdQuery(
    {
      id: technician?.id,
    },
    { skip: !technician?.id },
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

  const ratingShow = Array.isArray(reviews?.data)
    ? reviews?.data.map((review) => (
        <div className="review-item">
          <div className="data">
            <div className="info">
              <img src={review?.user?.image} alt="" />
              <div>
                <h4>{review?.user?.displayName}</h4>
                <div className="stars">
                  <Rating
                    name="half-rating"
                    defaultValue={review?.rating}
                    value={review?.rating}
                    precision={0.5}
                    readOnly
                  />
                </div>
              </div>
            </div>
            <span>{timeAgo(review?.date)}</span>
          </div>
          <p>{review?.comment}</p>
        </div>
      ))
    : [];

  return (
    <div className="rating-section">
      {isLoadingReviews ||
      isLoadingReviewsCount ||
      isFetchingReviews ||
      isFetchingReviewsCount ? (
        <AppLoading heading="جاري تحميل التقييمات" />
      ) : (
        <>
          <h3>التقييمات:</h3>
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
                      (reviewsCount?.fiveStar / reviewsCount?.totalReviews) *
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
                    (reviewsCount?.fiveStar / reviewsCount?.totalReviews) * 100,
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
                      (reviewsCount?.fourStar / reviewsCount?.totalReviews) *
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
                    (reviewsCount?.fourStar / reviewsCount?.totalReviews) * 100,
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
                      (reviewsCount?.threeStar / reviewsCount?.totalReviews) *
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
                    (reviewsCount?.twoStar / reviewsCount?.totalReviews) * 100,
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
                    (reviewsCount?.oneStar / reviewsCount?.totalReviews) * 100,
                  ) || 0}
                  %
                </span>
              </div>
            </div>
          </div>
          <div className="reviews-box">
            <div className="reviews">{ratingShow}</div>
          </div>
        </>
      )}
    </div>
  );
}
