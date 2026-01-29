import { useState } from "react";
import { AcceptOrder, BaseUrl, orderApi, RejectOrder } from "../APIs/Api";
import axios from "axios";
import Cookie from "cookie-universal";
import { useDispatch } from "react-redux";
import { ordersApi } from "../store/services/ordersApi";

export default function AcceptOrderBox({
  showAccept = false,
  showReject = false,
  orderId = null,
  onClose,
}) {
  const dispatch = useDispatch();
  const cookie = Cookie();
  const token = cookie.get("token");
  const [selectedDate, setSelectedDate] = useState(""); // YYYY-MM-DD
  const [selectedTime, setSelectedTime] = useState(""); // HH:MM
  const [err, setErr] = useState("");

  const handleAccept = async () => {
    if (!orderId || selectedDate === "" || !selectedTime === "") return;
    try {
      // دمج التاريخ والوقت في Date object
      const dateTime = new Date(`${selectedDate}T${selectedTime}`);

      // تحويل إلى DateTimeOffset باستخدام offset الجهاز
      const offsetMinutes = dateTime.getTimezoneOffset(); // بالـ minutes
      const dateTimeOffset = new Date(
        dateTime.getTime() - offsetMinutes * 60 * 1000,
      );

      const res = await axios.put(
        `${BaseUrl}/${orderApi}/${AcceptOrder}/${orderId}`,
        { scheduledDate: dateTimeOffset.toISOString() },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.status === 200) {
        onCancel();

        setSelectedDate("");
        setSelectedTime("");
        dispatch(
          ordersApi.endpoints.getOrderDetails.initiate(
            { id: orderId },
            { forceRefetch: true },
          ),
        );
      }
    } catch (err) {
      setErr(err.response.data.message);
      console.error(err.response.data.message);
    }
  };
  const onCancel = () => {
    onClose();
  };

  const handleReject = async () => {
    if (!orderId) return;
    try {
      const res = await axios.put(
        `${BaseUrl}/${orderApi}/${RejectOrder}/${orderId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.status === 200) {
        onClose();
        setSelectedDate("");
        setSelectedTime("");
        dispatch(
          ordersApi.endpoints.getOrderDetails.initiate(
            { id: orderId },
            { forceRefetch: true },
          ),
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (showAccept)
    return (
      <div
        className="accept-alter"
        onClick={() => {
          onClose();
        }}
      >
        <div className="accept-box" onClick={(e) => e.stopPropagation()}>
          <h2>هل تريد قبول الطلب رقم #{orderId}</h2>
          {/* اختيار التاريخ */}
          <div className="schedule">
            <label>اختر التاريخ:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {/* اختيار الوقت */}
          <div className="schedule">
            <label>اختر الوقت:</label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            />
          </div>
          {err && <p className="err">{err}</p>}
          <div className="buttons">
            <button onClick={() => handleAccept()}>موافق</button>
            <button onClick={onClose}>إلفاء</button>
          </div>
        </div>
      </div>
    );

  if (showReject)
    return (
      <div
        className="accept-alter"
        onClick={() => {
          onCancel();
        }}
      >
        <div className="accept-box" onClick={(e) => e.stopPropagation()}>
          <h2>هل تريد رفض الطلب رقم #{orderId}</h2>

          <div className="buttons">
            <button onClick={() => handleReject()}>موافق</button>
            <button onClick={onClose}>إلفاء</button>
          </div>
        </div>
      </div>
    );
}
