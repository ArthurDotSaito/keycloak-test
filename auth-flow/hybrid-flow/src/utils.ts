import { decodeJwt } from "jose";
import Cookies from "js-cookie";

export function makeLoginUrl() {
  const nonce = Math.random().toString(36);
  const state = Math.random().toString(36);

  //Armazenar em um secury cookie (https)
  Cookies.set("nonce", nonce);
  Cookies.set("state", state);

  const loginUrlParams = new URLSearchParams({
    client_id: "fs-client",
    redirect_uri: "http://localhost:3000/callback",
    response_type: "token id_token code",
    scope: "openid",
    nonce: nonce,
    state: state,
  });

  return `http://localhost:8080/realms/fs-realm/protocol/openid-connect/auth?${loginUrlParams.toString()}`;
}

export function login(
  accessToken: string,
  idToken: string | null,
  refreshToken?: string,
  state?: string
) {
  const stateCookie = Cookies.get("state");
  if (state && stateCookie !== state) {
    throw new Error("Invalid State");
  }

  let decodedAccessToken = null;
  let decodedIdToken = null;
  let decodedRefreshToken = null;

  if (refreshToken) {
    decodedRefreshToken = decodeJwt(refreshToken);
  }

  try {
    decodedAccessToken = decodeJwt(accessToken);
    if (idToken) {
      decodedIdToken = decodeJwt(idToken);
    }
  } catch (e) {
    throw new Error("Invalid token");
  }

  if (decodedAccessToken.nonce !== Cookies.get("nonce")) {
    throw new Error("Invalid nonce");
  }

  if (decodedIdToken.nonce !== Cookies.get("nonce")) {
    throw new Error("Invalid nonce");
  }

  if (
    decodedRefreshToken &&
    decodedRefreshToken.nonce !== Cookies.get("nonce")
  ) {
    throw new Error("Invalid nonce");
  }

  Cookies.set("access-token", accessToken);

  if (idToken) {
    Cookies.set("id-token", idToken);
  }

  if (decodedRefreshToken) {
    Cookies.set("refresh-token", refreshToken as string);
  }

  return decodedAccessToken;
}

export function getAuth() {
  const token = Cookies.get("access_token");
  if (!token) {
    return null;
  }

  try {
    return decodeJwt(token);
  } catch (e) {
    return null;
  }
}

export function makeLogoutUrl() {
  if (Cookies.get("id_token")) {
    return false;
  }

  const logoutParams = new URLSearchParams({
    id_token_hint: Cookies.get("id_token") as string,
    post_logout_redirect_uri: "http://localhost:3000/login",
  });

  Cookies.remove("access_token");
  Cookies.remove("id_token");
  Cookies.remove("nonce");
  Cookies.remove("state");
  Cookies.remove("refresh_token");

  return `http://localhost:8080/realms/fs-realm/protocol/openid-connect/logout?${logoutParams.toString()}`;
}

export function exchangeCodeForToken(code: string) {
  const tokenUrlParams = new URLSearchParams({
    client_id: "fs-client",
    grant_type: "authorization_code",
    code: code,
    redirect_url: "http://localhost:3000/callback",
    nonce: Cookies.get("nonce") as string,
  });

  return fetch(
    "http://localhost:8080/realms/fs-realm/protocol/openid-connect/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: tokenUrlParams.toString(),
    }
  )
    .then((res) => res.json())
    .then((res) => {
      return login(res.access_token, res.id_token, res.refresh_token);
    });
}
