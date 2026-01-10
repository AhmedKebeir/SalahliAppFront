// components/AppLoading.jsx
import "./loading.css";

export default function AppLoading(props) {
  return (
    <div className="app-loading">
      <span className="loader"></span>
      <h4>{props.heading}</h4>
    </div>
  );
}
