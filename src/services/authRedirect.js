// services/authRedirect.js
export const handleAuthRedirect = (navigate) => {
  const token = localStorage.getItem("token");

  if (!token) return;

  try {
    const userData = JSON.parse(localStorage.getItem("userData"));
    console.log(userData);
    const role = userData?.UserRoleId;
    console.log("Redirect role:", role);

    switch (role) {
      case 1:
        navigate("/admission/dashboard");
        break;
      case 2:
        navigate("/cfw/dashboard");
        break;
      case 3:
        navigate("/cashier/dashboard");
        break;
      case 4:
        navigate("/finance/dashboard");
        break;
      case 5:
        navigate("/sru/dashboard");
        break;
      case 6:
        navigate("/academic/dashboard");
        break;
      case 7:
        navigate("/hrd/dashboard");
        break;
      case 8:
        navigate("/hrd/dashboard");
        break;
      case 9:
        navigate("/hrd/dashboard");
        break;
      case 10:
        navigate("/hrd/dashboard");
        break;
      case 11:
        navigate("/sac/dashboard");
        break;
      case 12:
        navigate("/ap/dashboard");
        break;
      case 13:
        navigate("/principal/dashboard");
        break;
      case 17:
        navigate("/parent/dashboard");
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