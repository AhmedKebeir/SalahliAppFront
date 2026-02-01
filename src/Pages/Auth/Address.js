import { useState } from "react";
import Logo from "../../Components/Logo";
import { AddAddress, BaseUrl } from "../../APIs/Api";
import axios from "axios";
import Cookie from "cookie-universal";
import { useNavigate } from "react-router-dom";
export default function Address() {
  const [loading, setLoading] = useState(false);
  const cookie = Cookie();
  const nav = useNavigate();
  const [form, setForm] = useState({ city: "", center: "", street: "" });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${BaseUrl}/${AddAddress}`, form, {
        headers: {
          Authorization: "Bearer " + cookie.get("token"),
        },
      });
      if (res.status === 200) {
        nav("/user-image");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="address">
      <div className="container">
        <Logo />
        <h2>أدخل عنوانـــــك</h2>
        <p>يرجى تقديم عنوانك لتلقي الخدمة.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="city">المحافظة</label>
          <input
            type="text"
            id="city"
            placeholder="ادخل محافظتك"
            name="city"
            value={form.city}
            onChange={handleChange}
            required
          />
          <label htmlFor="center">المركز</label>
          <input
            type="text"
            id="center"
            placeholder="ادخل المركز التابع له"
            name="center"
            value={form.center}
            onChange={handleChange}
            required
          />
          <label htmlFor="street">الشارع</label>
          <input
            type="text"
            id="street"
            placeholder="ادخل اسم الشارع"
            name="street"
            value={form.street}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? <span className="btn-loader"></span> : "حفظ"}
          </button>
        </form>
      </div>
    </div>
  );
}
