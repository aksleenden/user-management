const mongoose = require('mongoose');

const { Schema } = mongoose;

const USER_STATUSES = ['unverified', 'active', 'blocked'];

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: USER_STATUSES,
      default: 'unverified',
    },
    verificationToken: {
      type: String,
      default: null,
    },
    registrationTime: {
      type: Date,
      default: Date.now,
    },
    lastLoginTime: {
      type: Date,
      default: null,
    },
    lastActivityTime: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 }, { unique: true });

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    delete ret.verificationToken;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = { User, USER_STATUSES };
