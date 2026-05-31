import AppRoutes from "./routes/AppRoutes";
import NotificationListener from "./GlobalFunction/NotificaiontListener";

const user = JSON.parse(localStorage.getItem("userData"));
function App() {
  return (
    <>
      <NotificationListener userId={user?.UserId} />
      <AppRoutes />
    </>
  );
}

export default App;