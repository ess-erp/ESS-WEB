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
      case "1":
        navigate("/admission/dashboard");
        break;
      case "2":
        navigate("/cfw/dashboard");
        break;
      case "3":
        navigate("/cashier/dashboard");
        break;
      case "4":
        navigate("/finance/dashboard");
        break;
      case "7":
        navigate("/sru/dashboard");
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