import { BsWrenchAdjustable } from "react-icons/bs";
import "../Css/Components/Logo.css";
import { useNavigate } from "react-router-dom";
import { useGetCurrentUserQuery } from "../store/services/CurrentUser";
export default function Logo() {
  const nav = useNavigate();
  const { data } = useGetCurrentUserQuery();
  return (
    <div className="logo" onClick={() => (data ? nav("/home") : nav("/"))}>
      <span className="logo-icon">
        <BsWrenchAdjustable />
      </span>
      <h1>صلحلي</h1>
    </div>
  );
}
