import Cookies from "js-cookie";

export function makeLoginUrl() {
  const nonce = Math.random().toString(36);
  const state = Math.random().toString(36);

  Cookies.set("nonce", nonce);
  Cookies.set("state", state);

  const loginUrlParams = new URLSearchParams({
    client_id: "implicit-flow",
    redirect_uri: "http://localhost:3000/callback",
    response_type: "token token_id",
    scope: "openid",
    nonce: nonce,
    state: state,
  });

  return `http://localhost:8080/auth/realms/master/protocol/openid-connect/auth?${loginUrlParams.toString()}`;
}
