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
    response_type: "token id_token",
    scope: "openid",
    nonce: nonce,
    state: state,
  });

  return `http://localhost:8080/realms/fs-realm/protocol/openid-connect/auth?${loginUrlParams.toString()}`;
}

export function login(accessToken: string, idToken: string, state: string) {
  const stateCookie = Cookies.get("state");
  if (stateCookie !== state) {
    throw new Error("Invalid State");
  }

  let decodedAccessToken = null;
  let decodedIdToken = null;

  try {
    decodedAccessToken = decodeJwt(accessToken);
    decodedIdToken = decodeJwt(idToken);
  } catch (e) {
    throw new Error("Invalid token");
  }

  if (decodedAccessToken.nonce !== Cookies.get("nonce")) {
    throw new Error("Invalid nonce");
  }

  if (decodedIdToken.nonce !== Cookies.get("nonce")) {
    throw new Error("Invalid nonce");
  }

  Cookies.set("access-token", accessToken);
  Cookies.set("id-token", idToken);

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
