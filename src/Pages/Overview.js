import RatingSection from "./Rating";
import { LuMapPinned } from "react-icons/lu";
import { MdAccessTime } from "react-icons/md";
import { BiSolidBriefcase } from "react-icons/bi";
import { HiBadgeCheck } from "react-icons/hi";
import { FaAddressCard, FaRegCheckCircle } from "react-icons/fa";
import Footer from "../Components/Footer";
import { useTechnician } from "../Context/TechnicianProvider";
import { useGetTechnicianByIdQuery } from "../store/services/TechniciansApi";
import AppLoading from "../Components/AppLoading";

export default function Overview() {
  const { technicianId } = useTechnician();
  const { data: technician, isLoading, isFetching } = useGetTechnicianByIdQuery(
    { id: technicianId },
    { skip: !technicianId } // لو مفيش id => مايبعتش request
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
                  <h3>عن الفني:</h3>
                  <p>{technician?.bio}</p>
                </div>
                <div className="service-list">
                  <h3>الخدمات:</h3>
                  {Array.isArray(technician?.departments)
                    ? technician?.departments.map((item) => (
                        <span className="service-item">{item?.name}</span>
                      ))
                    : []}
                </div>
              </div>

              <RatingSection />
            </div>
            <aside>
              <div className="additional-information">
                <h3>معلومات إضافية</h3>
                <ul>
                  <li>
                    <LuMapPinned />
                    <div>
                      <h4>منطقة الخدمة</h4>
                      {Array.isArray(technician?.addresses)
                        ? technician?.addresses.map((item) => (
                            <p>
                              {item?.city} - {item?.center} - {item?.street}
                            </p>
                          ))
                        : []}
                    </div>
                  </li>
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
                      <p>+{technician?.experienceYears} سنوات </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="">
                <h3>التوثيقات</h3>
                <ul>
                  <li>
                    <HiBadgeCheck />
                    فني موثوق
                  </li>
                  <li>
                    <FaAddressCard />
                    الهوية موثقة
                  </li>
                  <li>
                    <FaRegCheckCircle />+{technician?.totalFinishedOrders} عمل
                    مكتمل
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
