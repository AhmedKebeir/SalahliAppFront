// export const BaseUrl = "https://salahliapp.runasp.net/api";
export const BaseUrl = "https://localhost:7186/api";

export const LoginUser = "account/login";
export const RegisterUser = "account/register";
export const CurrentUser = "account/current";
export const VerifyEmail = "account/verify";
export const ResendVerifyEmail = "account/resendcode";
export const AddAddress = "account/addAddress";
export const UpdateImage = "account/updateimage";
export const DeleteAddress = "account/address";
export const UpdateProfile = "account/updateprofile";
export const ForgetPasswordApi = "account/forget-password";
export const VerifyResetPasswordApi = "account/verify-reset-password";
export const ResetPasswordApi = "account/reset-password-with-token";
export const UpdatePasswordApi = "account/change-password";
export const UserProfileApi = "account/user-profile-by-id";

//User
export const CountOfOrdersByUserEmail = "order/get-all-count-orders-user";

//   department APIs
export const BaseDepartmentUrl = "departments";
export const landingDepartment = "departments/top-four";
export const getAllDepartments = "departments";

//dashboard
export const AdminDashboard = "adminDashboard";
export const overview = "adminDashboard/overview";
export const getAllUsers = "adminDashboard/all-users";
export const getAllOrders = "order/pagin-orders";
export const UpdatePoints = "technician/points";

//Technican
export const BaseTechniciansUrl = "technician";
export const getTechnicians = "technician/page-technicians";
export const TechniciansDashboard = "technician/technician-dashboard";
export const getTopTechnicians = "technician/top-technicians";
export const UpdateActiveAccount = "update-state";

//Orders
export const orderApi = "order";
export const AcceptOrder = "accept";
export const RejectOrder = "cancel";

// Rating

export const Review = "reviews";
export const UserReviews = "reviews/user";
export const TechnicianReviews = "reviews/technician";
export const AnyUserReviews = "reviews/any-user";
export const CountReviewsForTechnician = "reviews/technician-count";
export const UserDoReview = "reviews/user-do-rating";
export const TechDoReview = "reviews/technician-do-rating";

export const UserOwnsReviews = "reviews/user-reviews";
export const UserOwnsCountReviews = "reviews/user-count";
