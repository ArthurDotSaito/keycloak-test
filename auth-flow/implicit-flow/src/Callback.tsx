import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { login } from "./utils";

export function Callback() {
  const { hash } = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(hash.replace("#", ""));
    const accessToken = searchParams.get("access_token") as string;
    const idToken = searchParams.get("id_token") as string;
    const state = searchParams.get("state") as string;

    if (!accessToken || !idToken || !state) {
      //login
    }

    login(accessToken, idToken, state);
  }, [hash]);

  return (
    <div>
      <h1>Loading...</h1>
    </div>
  );
}
