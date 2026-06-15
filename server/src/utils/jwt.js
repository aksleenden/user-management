const jwt = require("jsonwebtoken");

const TOKEN_EXPIRY = "7d";
const COOKIE_NAME = "auth_token";

function signAuthToken(userId) {
  return jwt.sign({ sub: String(userId) }, process.env.JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
}

function verifyAuthToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

function getCookieOptions() {
  return {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  };
}

module.exports = {
  COOKIE_NAME,
  signAuthToken,
  verifyAuthToken,
  getCookieOptions,
};
