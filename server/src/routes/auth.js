const express = require("express");
const bcrypt = require("bcryptjs");

const { User } = require("../models/User");
const { getUniqIdValue } = require("../utils/getUniqIdValue");
const { sendVerificationEmail } = require("../utils/mailer");
const {
  COOKIE_NAME,
  signAuthToken,
  getCookieOptions,
} = require("../utils/jwt");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ error: "E-mail is required" });
    }
    if (!password || password.length === 0) {
      return res.status(400).json({ error: "Password is required" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = getUniqIdValue();

    const user = new User({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      status: "unverified",
      verificationToken,
    });

    await user.save();

    res.status(201).json({
      message:
        "Registration successful. Please check your e-mail to verify your account.",
    });

    sendVerificationEmail(user.email, verificationToken);
  } catch (err) {
    if (err && err.code === 11000) {
      return res
        .status(409)
        .json({ error: "An account with this e-mail already exists" });
    }
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "E-mail and password are required" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(401).json({ error: "Invalid e-mail or password" });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid e-mail or password" });
    }

    if (user.status === "blocked") {
      return res.status(403).json({ error: "This account has been blocked" });
    }

    user.lastLoginTime = new Date();
    user.lastActivityTime = new Date();
    await user.save();

    const token = signAuthToken(user._id);
    res.cookie(COOKIE_NAME, token, getCookieOptions());

    res.json({ message: "Logged in successfully", user });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  res.json({ message: "Logged out" });
});

router.get("/verify/:token", async (req, res, next) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res
        .status(404)
        .json({ error: "Invalid or expired verification link" });
    }

    if (user.status === "unverified") {
      user.status = "active";
    }
    user.verificationToken = null;
    await user.save();

    res.json({ message: "E-mail verified successfully", status: user.status });
  } catch (err) {
    next(err);
  }
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
