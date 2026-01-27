import { Link } from "react-router-dom";
import Header from "../Components/Header";
import "../Css/UserProfile.css";
import { IoHome } from "react-icons/io5";
import { MdAddLocationAlt, MdDelete } from "react-icons/md";
import { useGetCurrentUserQuery } from "../store/services/CurrentUser";
import { TbCameraPlus } from "react-icons/tb";
import { FaUser } from "react-icons/fa6";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  AddAddress,
  BaseTechniciansUrl,
  BaseUrl,
  DeleteAddress,
  UpdateActiveAccount,
  UpdateImage,
} from "../APIs/Api";
import Cookie from "cookie-universal";
import Switch from "@mui/material/Switch";
import Skeleton from "@mui/material/Skeleton";
import Avatar from "@mui/material/Avatar";
import {
  useGetAvaliableDepartmentsQuery,
  useGetCureentTechnicianQuery,
} from "../store/services/TechniciansApi";
import { useGetTopFourCategoriesQuery } from "../store/services/CategoriesApi";
import { useGetCountOfOrdersByUserEmailQuery } from "../store/services/UserApi";
import AppLoading from "../Components/AppLoading";

export default function UserProfile() {
  const [departmentLoading, setDepartmentLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const cookie = Cookie();
  const token = cookie.get("token");
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showChangeImage, setShowChangeImage] = useState(false);
  const [imageForm, setImageForm] = useState(null);
  const [showDepartments, setShowDepartments] = useState(false);

  const [activeAccount, setActiveAccount] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [err, setErr] = useState(null);

  const [newAddress, setNewAddress] = useState({
    city: "",
    center: "",
    street: "",
  });

  function handleChange(e) {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAddressLoading(true);
    try {
      if (
        newAddress.city !== "" &&
        newAddress.center !== "" &&
        newAddress.street !== ""
      ) {
        const res = await axios.post(`${BaseUrl}/${AddAddress}`, newAddress, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        if (res.status === 200) {
          refetch();
          setShowAddAddress(false);
          setErr(null);
        }
        console.log(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddressLoading(false);
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageForm(URL.createObjectURL(file)); // تحويل الملف لرابط عرض مؤقت
      setImageFile(file);
    }
  };
  const {
    data: currentUser,
    refetch,
    isLoading: isUserLoading,
    isFetching: isUserFetching,
  } = useGetCurrentUserQuery();

  const { data: CountOrders } = useGetCountOfOrdersByUserEmailQuery({
    email: currentUser?.email,
  });

  const {
    data: avalibleCat,
    refetch: refetchAvalibleCat,
  } = useGetAvaliableDepartmentsQuery();

  const handleUpdateImage = async (e) => {
    e.preventDefault();
    setImageLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      const res = await axios.put(`${BaseUrl}/${UpdateImage}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        refetch();
        setImageFile(null);
        setImageForm(null);
        setShowChangeImage(false);
      }
    } catch (err) {
      setErr("حدث خطأ أثناء تحديث الصورة");
      console.log(err);
    } finally {
      setImageLoading(false);
    }
  };

  const handleDeleteAddress = async (item) => {
    try {
      const res = await axios.delete(
        `${BaseUrl}/${DeleteAddress}/${parseInt(item)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.status === 204) {
        refetch();
      }
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    refetch();
    setActiveAccount(currentUser?.isActive);
  }, [refetch, currentUser]);

  const handleActiveAccount = async (newValue) => {
    try {
      const res = await axios.put(
        `${BaseUrl}/${BaseTechniciansUrl}/${UpdateActiveAccount}/${newValue}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.status === 200) {
        setActiveAccount(newValue); // نحدث الحالة بعد نجاح الـ API
        refetch();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const {
    data: currentTechnician,
    refetch: refetchTechnician,
    isLoading: isTechnicianLoading,
    isFetching: isTechnicianFetching,
  } = useGetCureentTechnicianQuery();

  console.log(currentTechnician);

  const handleDeleteDepartment = async (id) => {
    try {
      const res = await axios.delete(`${BaseUrl}/${BaseTechniciansUrl}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        refetchTechnician();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [selectedCategory, setSelectedCategory] = useState(false);
  const [categories, setCategories] = useState([]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    const id = Number(e.target.id); // ← مهم جداً

    if (categories.some((c) => c.id === id)) {
      setCategories(categories.filter((c) => c.id !== id));
    } else {
      setCategories([...categories, { id, name: value }]);
    }
  };

  const saveCategories = async () => {
    if (categories.length > 0) {
      setDepartmentLoading(true);
      try {
        const res = await axios.post(
          `${BaseUrl}/${BaseTechniciansUrl}/add-depatments`,
          categories.map((item) => ({
            id: item.id,
            name: item.name, // أو سيبه فاضي
          })),
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        if (res.status === 200) {
          setSelectedCategory(false);
          setCategories([]);
          refetchTechnician();
          refetchAvalibleCat();
        }
        console.log(res);
      } catch (err) {
        console.log(err);
      } finally {
        setDepartmentLoading(false);
      }
    } else {
      return;
    }
  };

  return (
    <>
      <Header />

      <div className="user-profile bg-page">
        {isUserLoading ||
        isUserFetching ||
        isTechnicianFetching ||
        isTechnicianLoading ? (
          <AppLoading heading="جاري تحميل الصفحة" />
        ) : (
          <div className="container">
            <div className="information">
              <div className="info">
                <div className="image">
                  {currentUser?.image === "" || !currentUser ? (
                    <FaUser />
                  ) : (
                    <img src={currentUser?.image} alt="" />
                  )}

                  <label onClick={() => setShowChangeImage(true)}>
                    <TbCameraPlus />
                  </label>
                </div>
                <div>
                  <h3>{currentUser?.displayName}</h3>
                  <p>{currentUser?.bio}</p>
                </div>
              </div>
              <Link to="update">تعديل الملف الشخصي</Link>
            </div>

            {currentUser?.role === "Technician" ? (
              <>
                <div className="active-account">
                  <h3>نشاط الحساب</h3>
                  <div>
                    <p>هل تريد تغيير حالة الحساب النشط؟</p>
                    <Switch
                      checked={activeAccount}
                      onChange={(e) => handleActiveAccount(e.target.checked)}
                      slotProps={{ input: { "aria-label": "controlled" } }}
                    />
                  </div>
                  <div className="count-of-points">
                    <p>عدد النقاط:</p>
                    <span> {currentTechnician?.countOfPoints}</span>
                  </div>
                </div>
                <div className="tech-departments">
                  <h3>الخدمات:</h3>
                  <div className="departments-list">
                    {Array.isArray(currentTechnician?.departments) &&
                      currentTechnician?.departments.map((department) => (
                        <div className="item" key={department?.id}>
                          <span>{department?.name}</span>
                          <MdDelete
                            onClick={() =>
                              handleDeleteDepartment(department?.id)
                            }
                          />
                        </div>
                      ))}
                  </div>
                  <div className="btn">
                    <button onClick={() => setSelectedCategory(true)}>
                      إضافة خدمة
                    </button>
                  </div>
                </div>
              </>
            ) : null}

            {currentUser?.role === "Technician" && selectedCategory ? (
              <div
                className="add-department-box"
                onClick={() => setSelectedCategory(false)}
              >
                <div
                  className="departmets"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3>اختر الخدمة المناسبة</h3>
                  <div className="department-list">
                    {Array.isArray(avalibleCat) && avalibleCat.length > 0
                      ? avalibleCat?.map((item) => (
                          <div className="item" key={item?.id}>
                            <span>{item?.name}</span>
                            <input
                              id={item?.id}
                              type="checkbox"
                              value={item?.name}
                              onChange={handleCategoryChange}
                              checked={categories.some(
                                (c) => c.id === Number(item?.id),
                              )}
                            />
                          </div>
                        ))
                      : null}
                  </div>
                  <div className="btn">
                    <button
                      onClick={() => saveCategories()}
                      disabled={departmentLoading}
                    >
                      {" "}
                      {departmentLoading ? (
                        <span className="btn-loader"></span>
                      ) : (
                        "حفظ"
                      )}{" "}
                    </button>

                    <button onClick={() => setSelectedCategory(false)}>
                      إالغاء
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}

            {/* content users */}

            <div className="content-users">
              <div className="">
                <div className="connection-info">
                  <h3>معلومات الاتصال</h3>
                  <ul>
                    <li>
                      <span>رقم الهاتف:</span> {currentUser?.phoneNumber}
                    </li>
                    <li>
                      <span>البريد الإلكتروني:</span> {currentUser?.email}
                    </li>
                  </ul>
                </div>
                <div className="orders-details">
                  <h3>ملخص الطلبات</h3>
                  <ul>
                    <li>
                      <Link>
                        إجمالي الطلبات <span>{CountOrders?.all}</span>
                      </Link>
                    </li>
                    <li>
                      <Link>
                        الطلبات المكتملة<span>{CountOrders?.finished}</span>
                      </Link>
                    </li>
                    <li>
                      <Link>
                        الطلبات المعلقة<span>{CountOrders?.pending}</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="addresses-info">
                <h3>عناويني</h3>
                <ul>
                  {Array.isArray(currentUser?.addresses)
                    ? currentUser?.addresses.map((item, index) => (
                        <li key={index}>
                          <IoHome />
                          <div className="address-item">
                            <h4>العنوان {index + 1}</h4>
                            <p>
                              {item?.city} - {item?.center} - {item?.street}
                            </p>
                          </div>
                          <button>
                            <MdDelete
                              onClick={() => handleDeleteAddress(item?.id)}
                            />
                          </button>
                        </li>
                      ))
                    : null}
                </ul>
                <Link onClick={() => setShowAddAddress(true)}>
                  <MdAddLocationAlt /> إضافة عنوان جديد
                </Link>
              </div>
            </div>
          </div>
        )}

        {showAddAddress ? (
          <div className="add-address" onClick={() => setShowAddAddress(false)}>
            <div className="address-form" onClick={(e) => e.stopPropagation()}>
              <h2>عنوان جديد</h2>
              <form onSubmit={handleSubmit}>
                <label htmlFor="city">المحافظة</label>
                <input
                  type="text"
                  id="city"
                  placeholder="ادخل محافظتك"
                  name="city"
                  required
                  value={newAddress.city}
                  onChange={handleChange}
                />
                <label htmlFor="center">المركز</label>
                <input
                  type="text"
                  id="center"
                  placeholder="ادخل المركز التابع له"
                  name="center"
                  required
                  value={newAddress.center}
                  onChange={handleChange}
                />
                <label htmlFor="street">الشارع</label>
                <input
                  type="text"
                  id="street"
                  placeholder="ادخل اسم الشارع"
                  name="street"
                  required
                  value={newAddress.street}
                  onChange={handleChange}
                />
                <button type="submit" disabled={addressLoading}>
                  {" "}
                  {addressLoading ? (
                    <span className="btn-loader"></span>
                  ) : (
                    "حفظ"
                  )}{" "}
                </button>
              </form>
            </div>
          </div>
        ) : (
          ""
        )}

        {showChangeImage ? (
          <div
            className="change-image"
            onClick={() => setShowChangeImage(false)}
          >
            <div className="change-form" onClick={(e) => e.stopPropagation()}>
              <h2>تغيير الصورة</h2>

              <form onSubmit={handleUpdateImage}>
                <div className="image ">
                  {imageForm || currentUser?.image !== "" ? (
                    <div className="hover-show">
                      <TbCameraPlus />
                    </div>
                  ) : (
                    ""
                  )}

                  {currentUser?.image === "" && !imageForm ? (
                    <TbCameraPlus />
                  ) : (
                    <img
                      src={imageForm ? imageForm : currentUser?.image}
                      className=""
                      alt="User"
                    />
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    id="userImage"
                    onChange={(e) => handleImageChange(e)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
                {err ? <div className="err">{err}</div> : ""}
                <button type="submit" disabled={imageLoading}>
                  {" "}
                  {imageLoading ? (
                    <span className="btn-loader"></span>
                  ) : (
                    "حفظ الصورة"
                  )}{" "}
                </button>
              </form>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
