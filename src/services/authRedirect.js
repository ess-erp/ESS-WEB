// services/authRedirect.js
export const handleAuthRedirect = (navigate) => {
  const token = localStorage.getItem("token");

  if (!token) return;

  try {
    const userData = JSON.parse(localStorage.getItem("userData"));
    console.log(userData);
    const role = userData?.UserRole;
    console.log("Redirect role:", role);

    switch (role) {
      case "admission":
        navigate("/admission/dashboard");
        break;
      case "cfw":
        navigate("/cfw/dashboard");
        break;
      case "cashier":
        navigate("/cashier/dashboard");
        break;
      case "finance":
        navigate("/finance/dashboard");
        break;
      default:
        navigate("/");
        break;
    }
  } catch (err) {
    console.error("Error parsing userData:", err);
    navigate("/");
  }
};
