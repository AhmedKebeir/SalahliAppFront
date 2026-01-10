import { MdOutlineCheckCircleOutline } from "react-icons/md";
import Header from "../Components/Header";
import "../Css/SendSuccess.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function SendSuccess() {
  const order = useSelector((state) => state.order.currentOrder);

  function formatOrderDate(dateString) {
    if (!dateString) return "—"; // لو التاريخ null أو undefined أو ""

    const date = new Date(dateString);

    // لو التاريخ غير صالح
    if (isNaN(date.getTime())) return "—";

    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  }
  return (
    <>
      <Header />
      <div className="send-success bg-page">
        <div className="container">
          <div className="title">
            <div>
              <MdOutlineCheckCircleOutline />
            </div>
            <h2>تم إرسال طلبك بنجاح!</h2>
            <p>
              لقد أرسلنا تفاصيل طلبك إلي الفني. سيتم إعلامك بمجرد قبول الفني
              للطلب.
            </p>
          </div>

          <div className="request-details">
            <ul>
              <li>
                <span>رقم الطلب</span>
                <span>#{order?.id}</span>
              </li>
              <li>
                <span>ملخص الخدمة</span>
                <span>{order?.description}</span>
              </li>
              <li>
                <span>اسم الفني</span>
                <span>{order?.technician?.displayName}</span>
              </li>
              <li>
                <span>التاريخ والوقت</span>
                <span>{formatOrderDate(order?.createAt)}</span>
              </li>
            </ul>
          </div>
          <div className="request-steps">
            <h3>الخطوات التالية</h3>
            <ul>
              <li>
                <span>1</span>
                <div>
                  <h4>انتظر تأكيد الفني</h4>
                  <p>
                    سيقوم الفني بمراجعة طلبك وتأكيده قريبًا. ستتلقى إشعارًا
                    بذلك.
                  </p>
                </div>
              </li>
              <li>
                <span>2</span>
                <div>
                  <h4>تواصل الفني معك</h4>
                  <p>قد يتصل بك الفني لتأكيد التفاصيل قبل الموعد المحدد.</p>
                </div>
              </li>
              <li>
                <span>3</span>
                <div>
                  <h4>إتمام الخدمة</h4>
                  <p>
                    سيصل الفني في الموعد لإصلاح العطل. يمكنك تقييم الخدمة بعد
                    الانتهاء.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="request-btns">
            <Link to={`/my-orders/${order?.id}`}>تتبع حالة الطلب</Link>
            <Link to="/home">العودة إلي الرئيسية</Link>
          </div>
        </div>
      </div>
    </>
  );
}
