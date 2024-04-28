import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { makeLoginUrl } from "./utils";

export function Login() {
  const { auth } = {
    auth: false,
  };

  useEffect(() => {
    if (!auth) {
      window.location.href = makeLoginUrl();
    }
  }, [auth]);

  return auth ? <Navigate to="/admin" /> : <div>Loading</div>;
}
