import { createBrowserRouter } from "react-router-dom";
import { Admin } from "./Admin";
import { Callback } from "./Callback";
import { Login } from "./Login";
import { Logout } from "./Logout";

const router = createBrowserRouter([
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "home",
    element: <Logout />,
  },
  {
    path: "admin",
    element: <Admin></Admin>,
  },
  {
    path: "callback",
    element: <Callback />,
  },
]);

function App() {
  return (
    <>
      <div>
        <h1>Implicit Flow</h1>
      </div>
    </>
  );
}

export default App;