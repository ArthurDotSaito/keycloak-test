import express from "express";

const app = express();

app.get("/login", (req, res) => {
  const loginParams = new URLSearchParams({
    client_id: "fs-client",
    redirect_uri: "http://localhost:3000/callback",
    response_type: "code",
    scope: "openid",
  });

  const url = `http://localhost:8080/realms/fs-realm/protocol/openid-connect/auth?${loginParams.toString()}`;
  res.redirect(url);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
