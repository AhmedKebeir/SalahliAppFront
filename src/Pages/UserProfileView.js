import { Link, NavLink, Outlet, useParams } from "react-router-dom";
import Header from "../Components/Header";
import "../Css/TechnicianPage.css";
import { useGetTechnicianByIdQuery } from "../store/services/TechniciansApi";
import { useTechnician } from "../Context/TechnicianProvider";
import { useGetAllReviewsByTechnicianIdQuery } from "../store/services/ReviewsApi";
import AppLoading from "../Components/AppLoading";
import { useEffect } from "react";
import { useUser } from "../Context/UserProvider";
import { useGetUserProfileByIdQuery } from "../store/services/UserApi";

export default function UserProfileView() {
  const params = useParams();

  const { data: user, isLoading, isFetching } = useGetUserProfileByIdQuery({
    id: params?.id,
  });

  const { setUserId } = useUser();

  useEffect(() => {
    if (params?.id) {
      setUserId(params.id);
    }
  }, [params?.id]);

  console.log(user);

  return (
    <>
      <Header />
      <div className="technician-page">
        {isLoading || isFetching ? (
          <AppLoading heading="جاري التحميل" />
        ) : (
          <>
            {" "}
            <div className="information">
              <div className="container">
                <div className="info">
                  <img
                    src={
                      user?.user?.image || require("../Images/unnamed (2).png")
                    }
                    alt=""
                  />
                  <div>
                    <h3>{user?.user?.displayName}</h3>
                    <p>{user?.user?.role === "User" ? "مستخدم عادي" : "فني"}</p>
                    <div className="rating">
                      <span className="star">★ </span>
                      {Number(user?.user?.averageRating) || 0.0}
                      <span className="count-rate">
                        {" "}
                        ({user?.user?.totalReviews} تقيم)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <ul>
                <li>
                  <NavLink to="." end>
                    نظرة عامة
                  </NavLink>
                </li>

                <li>
                  <NavLink to="rating">التقييمات</NavLink>
                </li>
              </ul>
            </div>
          </>
        )}

        <Outlet />
      </div>
    </>
  );
}
