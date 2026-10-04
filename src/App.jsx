import AppRoutes from "./routes/AppRoutes";
import SignalRListener from "./GlobalFunction/SignalRListener";

const user = JSON.parse(localStorage.getItem("userData"));
function App() {
  return (
    <>
      <SignalRListener userId={user?.UserId} />
      <AppRoutes />
    </>
  );
}

export default App;