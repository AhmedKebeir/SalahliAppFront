import RatingSection from "./Rating";
import { LuMapPinned } from "react-icons/lu";
import { MdAccessTime } from "react-icons/md";
import { BiSolidBriefcase } from "react-icons/bi";
import { HiBadgeCheck } from "react-icons/hi";
import { FaAddressCard, FaRegCheckCircle } from "react-icons/fa";
import Footer from "../Components/Footer";

import AppLoading from "../Components/AppLoading";
import { useGetUserProfileByIdQuery } from "../store/services/UserApi";
import { useUser } from "../Context/UserProvider";
import { FaHourglassEnd } from "react-icons/fa6";
import { BsBriefcaseFill } from "react-icons/bs";
import RatingOverviewUser from "./RatingOverviewUser";

export default function OverviewUser() {
  const { userId } = useUser();
  const { data: user, isLoading, isFetching } = useGetUserProfileByIdQuery(
    { id: userId },
    { skip: !userId }, // لو مفيش id => مايبعتش request
  );

  return (
    <>
      {isLoading || isFetching ? (
        <AppLoading heading="جاري التحميل" />
      ) : (
        <div className="overview ">
          <div className="container">
            <div>
              <div className="right">
                <div className="bio">
                  {user?.user?.role === "Technician" && <h3>عن الفني:</h3>}
                  {user?.user?.role === "User" && <h3>عن المستخدم:</h3>}
                  <p>{user?.user?.bio}</p>
                </div>
                {user?.user?.role === "Technician" && (
                  <div className="service-list">
                    <h3>الخدمات:</h3>
                    {Array.isArray(user?.departments)
                      ? user?.departments.map((item) => (
                          <span className="service-item">{item?.name}</span>
                        ))
                      : []}
                  </div>
                )}
              </div>

              <RatingOverviewUser />
            </div>
            <aside>
              <div className="additional-information">
                <h3>معلومات إضافية</h3>
                <ul>
                  <li>
                    <LuMapPinned />
                    <div>
                      <h4>منطقة الخدمة</h4>
                      {Array.isArray(user?.user?.addresses)
                        ? user?.user?.addresses.map((item) => (
                            <p>
                              {item?.city} - {item?.center} - {item?.street}
                            </p>
                          ))
                        : []}
                    </div>
                  </li>
                  {user?.user?.role === "Technician" && (
                    <>
                      <li>
                        <MdAccessTime />
                        <div>
                          <h4>متوسط وقت الاستجابة</h4>
                          <p>خلال ساعتين</p>
                        </div>
                      </li>

                      <li>
                        <BiSolidBriefcase />
                        <div>
                          <h4>الخبرة</h4>
                          <p>+{user?.experienceYears} سنوات </p>
                        </div>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              <div className="">
                <h3>التوثيقات</h3>
                <ul>
                  <li>
                    <FaRegCheckCircle />+{user?.completedOrders} طلب مكتمل
                  </li>
                  <li>
                    <FaHourglassEnd />+{user?.pendingOrders} طلب تحت الإنتظار
                  </li>
                  <li>
                    <BsBriefcaseFill />+{user?.totalOrders} مجمل الطلبات
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
