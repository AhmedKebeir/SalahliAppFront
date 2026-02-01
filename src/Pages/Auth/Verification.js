import { useEffect, useRef, useState } from "react";
import Logo from "../../Components/Logo";
import axios from "axios";
import { BaseUrl, ResendVerifyEmail, VerifyEmail } from "../../APIs/Api";
import Cookie from "cookie-universal";
import { useNavigate } from "react-router-dom";

export default function Verification() {
  const [loading, setLoading] = useState(false);
  const cookie = Cookie();
  const RESEND_TIME = 60;

  const [seconds, setSeconds] = useState(RESEND_TIME);
  const [canResend, setCanResend] = useState(false);

  const nav = useNavigate();
  const [error, setError] = useState(null);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const [otp, setOtp] = useState(["", "", "", ""]);
  const handleChange = (index, e) => {
    const value = e.target.value.replace(/\D/, ""); // السماح فقط بالأرقام
    const newOtp = [...otp];
    // console.log(newOtp);

    if (value) {
      newOtp[index] = value;
      setOtp(newOtp);

      // الانتقال للحقل التالي عند الإدخال
      if (index < 3) {
        inputRefs[index + 1].current.focus();
      }
    } else {
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus(); // الانتقال للحقل السابق عند الحذف
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const code = otp.join("");
      if (code.length === 4) {
        const token = cookie.get("token");
        const res = await axios.post(
          `${BaseUrl}/${VerifyEmail}?code=${code}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        if (res.status === 200) {
          cookie.set("token", res.data.token);
          nav("/address");
        }
      } else {
        setError("الرجاء إدخال الرمز!");
      }
    } catch (err) {
      setError("الكود غير صحيح!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (seconds === 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const handleResend = async () => {
    const token = cookie.get("token");
    if (!canResend || !token) return;

    try {
      setCanResend(false);
      setSeconds(RESEND_TIME);

      const res = await axios.post(
        `${BaseUrl}/${ResendVerifyEmail}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (err) {
      setError("حدث خطأ أثناء إعادة الإرسال");
    }
  };

  return (
    <div className="verify">
      <div className="container">
        <Logo />
        <h2>تأكيد البريد الإلكتروني</h2>
        <p>لقد أرسلنا رمزًا إلى بريدك الإلكتروني. الرجاء إدخاله أدناه.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-opt">
            {otp.map((_, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength="1"
                value={otp[index]}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                placeholder="_"
              />
            ))}
          </div>
          {error ? <div className="err">{error}</div> : ""}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <span className="btn-loader"></span> : "تأكيد"}
          </button>
        </form>
        <div className="resend">
          لم تستلم الرمز؟
          <button
            onClick={handleResend}
            disabled={!canResend}
            className={!canResend ? "disabled" : ""}
          >
            إعادة إرسال الرمز{" "}
          </button>
          {!canResend && (
            <span>00:{seconds < 10 ? `0${seconds}` : seconds}</span>
          )}
        </div>
      </div>
    </div>
  );
}
