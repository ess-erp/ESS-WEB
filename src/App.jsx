import AppRoutes from "./routes/AppRoutes";
import NotificationListener from "./GlobalFunction/NotificaiontListener";
import GlobalToastHandler from "./GlobalFunction/GlobalToastHandler";

const user = JSON.parse(localStorage.getItem("userData"));

function App() {
  return (
    <>
      <NotificationListener userId={user?.UserId} />
      <GlobalToastHandler />
      <AppRoutes />
    </>
  );
}

export default App;