import { Link, NavLink, Outlet, useParams } from "react-router-dom";
import Header from "../Components/Header";
import "../Css/TechnicianPage.css";
import { useGetTechnicianByIdQuery } from "../store/services/TechniciansApi";
import { useTechnician } from "../Context/TechnicianProvider";
import { useGetAllReviewsByTechnicianIdQuery } from "../store/services/ReviewsApi";
import AppLoading from "../Components/AppLoading";
import { useEffect } from "react";

export default function TechnicianPage() {
  const params = useParams();

  const {
    data: technician,
    isLoading,
    isFetching,
  } = useGetTechnicianByIdQuery({ id: params?.id });

  const { setTechnicianId } = useTechnician();

  useEffect(() => {
    if (params?.id) {
      setTechnicianId(params.id);
    }
  }, [params?.id]);

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
                      technician?.image || require("../Images/unnamed (2).png")
                    }
                    alt=""
                  />
                  <div>
                    <h3>{technician?.displayName}</h3>
                    <div className="rating">
                      <span className="star">★ </span>
                      {Number(technician?.averageRating) || 0}.0
                      <span className="count-rate">
                        {" "}
                        ({technician?.totalReviews} تقيم)
                      </span>
                    </div>
                  </div>
                </div>
                <Link to={`/request-service/${technician?.id}`}>اطلب الآن</Link>
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
