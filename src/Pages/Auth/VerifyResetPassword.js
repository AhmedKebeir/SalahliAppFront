import { useEffect, useRef, useState } from "react";
import Logo from "../../Components/Logo";
import axios from "axios";
import {
  BaseUrl,
  ResendVerifyEmail,
  VerifyResetPasswordApi,
} from "../../APIs/Api";
import { useNavigate } from "react-router-dom";

export default function VerifyResetPassword() {
  const RESEND_TIME = 60;

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [seconds, setSeconds] = useState(RESEND_TIME);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const inputRefs = useRef([]);
  const nav = useNavigate();

  /* ================= OTP INPUT ================= */

  const handleChange = (index, e) => {
    const rawValue = e.target.value;
    const value = rawValue.replace(/\D/, "");

    const newOtp = [...otp];

    // لو المستخدم مسح
    if (value === "") {
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    // لو دخل رقم
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();

      const newOtp = [...otp];

      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const code = otp.join("");
      if (code.length !== 4) {
        setError("الرجاء إدخال الرمز كاملًا");
        return;
      }

      const email = sessionStorage.getItem("forget-password-email");
      if (!email) return;

      const res = await axios.post(
        `${BaseUrl}/${VerifyResetPasswordApi}`,
        {
          email,
          code,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      sessionStorage.setItem("reset-token", res.data.token);
      nav("/new-reset-password");
    } catch {
      setError("الكود غير صحيح!");
      setOtp(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  /* ================= TIMER ================= */

  useEffect(() => {
    if (!canResend && seconds > 0) {
      const timer = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }

    if (seconds === 0) {
      setCanResend(true);
    }
  }, [seconds, canResend]);

  /* ================= RESEND ================= */

  const handleResend = async () => {
    const email = sessionStorage.getItem("forget-password-email");
    if (!canResend || !email) return;

    try {
      setCanResend(false);
      setSeconds(RESEND_TIME);

      await axios.post(`${BaseUrl}/${ResendVerifyEmail}`, { email });
    } catch {
      setError("حدث خطأ أثناء إعادة الإرسال");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="verify">
      <div className="container">
        <Logo />

        <h2>تأكيد رمز التحقق</h2>
        <p>لقد أرسلنا رمزًا إلى بريدك الإلكتروني. الرجاء إدخاله أدناه.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-opt">
            {otp.map((value, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={value}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                placeholder="_"
              />
            ))}
          </div>

          {error && <div className="err">{error}</div>}

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
            إعادة إرسال الرمز
          </button>
          {!canResend && (
            <span>00:{seconds < 10 ? `0${seconds}` : seconds}</span>
          )}
        </div>
      </div>
    </div>
  );
}
