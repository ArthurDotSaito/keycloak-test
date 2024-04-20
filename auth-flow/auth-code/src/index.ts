import crypto from "crypto";
import express from "express";

const app = express();

app.get("/login", (req, res) => {
  const nonce = crypto.randomBytes(16).toString("base64");

  //@ts-expect-error - type mismatch
  req.session.nonce = nonce;
  //@ts-expect-error - type mismatch
  req.session.save();

  const loginParams = new URLSearchParams({
    client_id: "fs-client",
    redirect_uri: "http://localhost:3000/callback",
    response_type: "code",
    scope: "openid",
    nonce: nonce,
  });

  const url = `http://localhost:8080/realms/fs-realm/protocol/openid-connect/auth?${loginParams.toString()}`;
  res.redirect(url);
});

app.get("/callback", async (req, res) => {
  console.log(req.query);

  const bodyParams = new URLSearchParams({
    client_id: "fs-client",
    grant_type: "authorization_code",
    code: req.query.code as string,
    redirect_uri: "http://localhost:3000/callback",
  });

  const url = `http://host.docker.internal:8080/realms/fs-realm/protocol/openid-connect/token`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: bodyParams.toString(),
  });

  const result = await response.json();
  console.log(result);
  res.json(result);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
