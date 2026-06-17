const express = require("express");

const { User } = require("../models/User");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);

const SORTABLE_FIELDS = [
  "name",
  "email",
  "status",
  "lastLoginTime",
  "registrationTime",
];

router.get("/", async (req, res, next) => {
  try {
    const { search = "", sortBy = "lastLoginTime", order = "desc" } = req.query;

    const sortField = SORTABLE_FIELDS.includes(sortBy)
      ? sortBy
      : "lastLoginTime";
    const sortOrder = order === "asc" ? 1 : -1;

    const filter = {};
    if (search && search.trim()) {
      const regex = new RegExp(
        search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i",
      );
      filter.$or = [{ name: regex }, { email: regex }];
    }

    const users = await User.find(filter)
      .sort({ [sortField]: sortOrder, _id: 1 })
      .lean();

    users.sort((a, b) => {
      if (sortField !== "lastLoginTime") return 0;
      const aNull = a.lastLoginTime == null;
      const bNull = b.lastLoginTime == null;
      if (aNull && !bNull) return 1;
      if (!aNull && bNull) return -1;
      return 0;
    });

    res.json({ users, currentUserId: String(req.user._id) });
  } catch (err) {
    next(err);
  }
});

function affectsSelf(req, ids) {
  return ids.map(String).includes(String(req.user._id));
}

router.post("/block", async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "No users selected" });
    }

    await User.updateMany(
      { _id: { $in: ids } },
      { $set: { status: "blocked" } },
    );

    res.json({
      message: "Selected user(s) blocked",
      selfAffected: affectsSelf(req, ids),
    });
  } catch (err) {
    next(err);
  }
});

router.post("/unblock", async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "No users selected" });
    }

    await User.updateMany(
      { _id: { $in: ids }, status: "blocked", verificationToken: null },
      { $set: { status: "active" } },
    );

    await User.updateMany(
      {
        _id: { $in: ids },
        status: "blocked",
        verificationToken: { $ne: null },
      },
      { $set: { status: "unverified" } },
    );

    res.json({ message: "Selected user(s) unblocked" });
  } catch (err) {
    next(err);
  }
});

router.post("/delete", async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "No users selected" });
    }

    const selfAffected = affectsSelf(req, ids);

    await User.deleteMany({ _id: { $in: ids } });

    res.json({ message: "Selected user(s) deleted", selfAffected });
  } catch (err) {
    next(err);
  }
});

router.post("/delete-unverified", async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "No users selected" });
    }

    const selfAffected = affectsSelf(req, ids);

    const result = await User.deleteMany({
      _id: { $in: ids },
      status: "unverified",
    });

    if (result.deletedCount === 0) {
      return res.json({
        message: "None of the selected users were unverified",
        deletedCount: 0,
      });
    }

    res.json({
      message: `Deleted ${result.deletedCount} unverified user(s)`,
      deletedCount: result.deletedCount,
      selfAffected,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
