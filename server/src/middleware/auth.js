const { User } = require("../models/User");
const { COOKIE_NAME, verifyAuthToken } = require("../utils/jwt");

async function requireAuth(req, res, next) {
  try {
    const token = req.cookies ? req.cookies[COOKIE_NAME] : null;

    if (!token) {
      return res
        .status(401)
        .json({ error: "Not authenticated", redirectTo: "/login" });
    }

    let payload;
    try {
      payload = verifyAuthToken(token);
    } catch (_err) {
      res.clearCookie(COOKIE_NAME);
      return res
        .status(401)
        .json({ error: "Session expired", redirectTo: "/login" });
    }

    const user = await User.findById(payload.sub);

    if (!user) {
      res.clearCookie(COOKIE_NAME);
      return res
        .status(401)
        .json({ error: "Account no longer exists", redirectTo: "/login" });
    }

    if (user.status === "blocked") {
      res.clearCookie(COOKIE_NAME);
      return res
        .status(403)
        .json({ error: "Your account has been blocked", redirectTo: "/login" });
    }

    user.lastActivityTime = new Date();
    await user.save();

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { requireAuth };
