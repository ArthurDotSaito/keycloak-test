import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Admin } from "./Admin";
import { AuthProvider } from "./AuthProvider";
import { Callback } from "./Callback";
import { Login } from "./Login";
import { Logout } from "./Logout";
import { PrivateRoute } from "./PrivateRoute";

const router = createBrowserRouter([
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "logout",
    element: <Logout />,
  },
  {
    path: "admin",
    element: (
      <PrivateRoute>
        <Admin></Admin>
      </PrivateRoute>
    ),
  },
  {
    path: "callback",
    element: <Callback />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
  );
}

export default App;
